
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import Image from "next/image";



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

 // Expand this object with mock data to satisfy the strict 'User' type requirements
  const loggedIn = await getLoggedInUser();
  if(!loggedIn){
    redirect('/signin');
  }
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
