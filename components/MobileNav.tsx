"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
  SheetTitle, // 1. Make sure SheetTitle is imported
} from "@/components/ui/sheet";

const MobileNav = ({ user }: MobileNavProps) => {
  const pathname = usePathname();
  
  return (
    <section>
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white">
          
          {/* 2. ✅ ADD THIS LINE: It keeps screen readers happy but stays invisible */}
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              className="cursor-pointer items-center gap-2 px-4 flex"
            >
              <Image
                src="/icons/logo.svg"
                width={34}
                height={34}
                alt="horizon logo"
              />
              <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
                Horizon
              </h1>
            </Link>

            <div className="mobilenav-sheet">
              <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                {sidebarLinks.map((item) => {
                  const isActive =
                    pathname === item.route ||
                    pathname.startsWith(`${item.route}/`);
                    
                  return (
                    <SheetClose asChild key={item.route}>
                      <Link
                        href={item.route}
                        className={cn("mobilenav-sheet_close w-full", {
                          "bg-bank-gradient": isActive,
                        })}
                      >
                        <Image
                          src={item.imgURL}
                          alt={item.label || "Sidebar Icon"}
                          width={20}
                          height={20}
                          className={cn({
                            "brightness-[3] invert-0": isActive,
                          })}
                        />
                        <p
                          className={cn("text-16 font-semibold text-black-2", {
                            "text-white": isActive,
                          })}
                        >
                          {item.label}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}

                <div className="text-black-1">
                  USER
                </div>

              </nav>
            </div>

            <div className="text-black-2 mt-auto">
              FOOTER
            </div>

          </nav>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;