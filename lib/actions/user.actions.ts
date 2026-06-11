"use server";
import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify, extractCustomerIdFromUrl, encryptId } from "../utils";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import { plaidClient } from "../plaid";
import { Models } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.action";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    // ✅ ADD THIS - this was missing!
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(session);
  } catch (error) {
    console.error("Error", error);
  }
};

export const signUp = async ({ password, ...userData}:SignUpParams) => {
  const { email, firstName, lastName } = userData;

  let newUserAccount;
  try {
    //mutation / Database / Make Fetch
    const { account, database } = await createAdminClient();

     newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`,
    );


    if(!newUserAccount) throw new Error('Error creating user')

    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type:'personal'
    });

    if(!dwollaCustomerUrl) throw new Error('Error creating Dwolla customer');
    

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl)

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId : newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl
      }
    )

    const session = await account.createEmailPasswordSession({
      email,
      password,
    });

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error("Error", error);
  }
};

// ... your initilization functions

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    return parseStringify(user); // ← add this ✅
  } catch (error) {
    return null;
  }
}

//logout function for this now have to do
export const logout = async () => {
  try {
    const { account } = await createSessionClient();

    (await cookies()).delete("appwrite-session");
    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};

//create Linked Token ......
export const createLinkToken = async (
  user: User
) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },

      client_name: user.name,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };
    const response = await plaidClient.linkTokenCreate(tokenParams);
    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.log(error);
  }
};

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  sharableId,
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();
    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        // ← everything goes inside ONE object
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        sharableId,
      },
    );
    return parseStringify(bankAccount);
  } catch (error) {}
};

//now to exchange the token over here of plaid
export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    //exchange the public token for the access Token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    // Get the account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    //create a process token for dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse =
      await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

    //create funding source URL for the account using Dwolla customer ID, Processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });
    // if funding source not exists throw error over here ...
    if (!fundingSourceUrl) throw Error;

    //create a bank Account using the user ID, item ID, account ID, access token, funding source URL, and sharable ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      sharableId: encryptId(accountData.account_id),
    });

    //revaidate the path to refelect the changes over here
    revalidatePath("/");

    return parseStringify({ publicTokenExchange: "completed" });
  } catch (error) {
    console.log("An error occured while creating exchange of token: ", error);
  }
};
