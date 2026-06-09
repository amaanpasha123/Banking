"use client";
import { Models } from "node-appwrite";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Signup from "@/app/(auth)/signup/page";
import { getLoggedInUser, signIn, signUp } from "@/lib/actions/user.actions";

// ── Schema ────────────────────────────────────────────────
const authFormSchema = (type: "sign-in" | "sign-up") =>
  z.object({
    // Sign-up only fields
    firstName:
      type === "sign-up"
        ? z.string().min(2, "First name must be at least 2 characters")
        : z.string().optional(),
    lastName:
      type === "sign-up"
        ? z.string().min(2, "Last name must be at least 2 characters")
        : z.string().optional(),
    address1:
      type === "sign-up"
        ? z.string().max(50, "Address too long")
        : z.string().optional(),
    city:
      type === "sign-up"
        ? z.string().max(50, "City name too long")
        : z.string().optional(),
    state:
      type === "sign-up"
        ? z.string().min(2).max(2, "Use 2-letter state code (e.g. NY)")
        : z.string().optional(),
    postalCode:
      type === "sign-up"
        ? z.string().min(3).max(6, "Enter a valid postal code")
        : z.string().optional(),
    dateOfBirth:
      type === "sign-up"
        ? z.string().min(1, "Date of birth is required")
        : z.string().optional(),
    ssn:
      type === "sign-up"
        ? z.string().min(4, "Enter last 4 digits of SSN")
        : z.string().optional(),

    // Shared fields
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address1: "",
      city: "",
      state: "",
      postalCode: "",
      dateOfBirth: "",
      ssn: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // TODO: wire up your signIn / signUp actions here
      // e.g. const session = await signIn({ email: values.email, password: values.password });
      if (type === "sign-up") {
        const newUser = await signUp(values);
        if (newUser) setUser(newUser); // ✅ only set if not undefined
      }
      if (type === "sign-in") {
        const response = await signIn({
          email:values.email,
          password : values.password
        });
        if(response) router.push('/');
      }
      console.log(values);
      // router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="auth-form">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer items-center gap-2 flex">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-26 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          <p className="text-16 font-normal text-gray-600">
            {user
              ? "Link your account to get started"
              : "Please enter your details"}
          </p>
        </div>
      </header>

      {/* ── Form ───────────────────────────────────────── */}
      {user ? (
        <div className="flex flex-col gap-4">{/* Plaid Link goes here */}</div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* ── Sign-up only fields ─────────────────── */}
            {type === "sign-up" && (
              <>
                {/* First name + Last name */}
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="form-label">First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your first name"
                            className="input-class"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="form-label">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your last name"
                            className="input-class"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-label">Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your specific address"
                          className="input-class"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-label">City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your city"
                          className="input-class"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* State + Postal Code */}
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="form-label">State</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ex: NY"
                            className="input-class"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="form-label">
                          Postal Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ex: 11101"
                            className="input-class"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Date of Birth + SSN */}
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="form-label">
                          Date of Birth
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="yyyy-mm-dd"
                            className="input-class"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ssn"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="form-label">SSN</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ex: 1234"
                            className="input-class"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {/* ── Shared fields (both sign-in & sign-up) ─ */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Submit ──────────────────────────────── */}
            <div className="flex flex-col gap-4">
              <Button type="submit" disabled={isLoading} className="form-btn">
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    &nbsp;Loading...
                  </>
                ) : type === "sign-in" ? (
                  "Sign In"
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* ── Footer link ────────────────────────────────── */}
      <footer className="flex justify-center gap-1">
        <p className="text-14 font-normal text-gray-600">
          {type === "sign-in"
            ? "Don't have an account?"
            : "Already have an account?"}
        </p>
        <Link
          href={type === "sign-in" ? "/signup" : "/signin"}
          className="form-link"
        >
          {type === "sign-in" ? "Sign up" : "Sign in"}
        </Link>
      </footer>
    </section>
  );
};

export default AuthForm;
