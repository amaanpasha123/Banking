import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, IBM_Plex_Serif} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-inter'});
const ibmplexserif  = IBM_Plex_Serif({
  subsets:['latin'],
  weight : ['400', '700'],
  variable:'--font-ibm-plex-serif'
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],

});

export const metadata: Metadata = {
  title: "Horizon",
  description: "Horizon is modern banking platform",
  icons:{
    icon:'/icons/logo.svg'
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className={`${inter.variable} ${ibmplexserif.variable}`}>{children}</body>
    </html>
  );
}