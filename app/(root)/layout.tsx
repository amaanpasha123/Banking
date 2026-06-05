import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

 // Expand this object with mock data to satisfy the strict 'User' type requirements
  const loggedIn: User = {
    $id: 'mock-id-123',
    userId: 'mock-user-123',
    email: 'amaan@example.com',
    firstName: 'Amaan',
    lastName: 'Pasha',
    dwollaCustomerUrl: 'https://mock.dwolla.com/customers/123',
    // 💡 If TypeScript complains about more missing properties, 
    // add them right here as empty strings or mock values:
    dwollaCustomerId: 'mock-dwolla-id',
    address1: '123 Mock St',
    city: 'Mock City',
    state: 'NY',
    postalCode: '10001',
    dateOfBirth: '2000-01-01',
    ssn: '1234',
  };

  return (
     <main className="flex h-screen w-full font-inter">
        <Sidebar user={loggedIn}/>
        <div className="flex size-full flex-col">
            <div className="root-layout">
                <Image
                src="/icons/logo.svg"
                width={30}
                height={30}
                alt="logo"
                 />
                <div>
                  <MobileNav user={loggedIn} />
                </div>
            </div>
          {children}
        </div>
      
     </main>
  );
}
