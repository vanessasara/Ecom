import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from './components/Provider'
import Footer from "./components/Footer";
import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";
import { StateContext } from "@/context/StateContext";
import { Toaster } from "react-hot-toast";

// Dynamically import Navbar with ssr: false
const Navbar = dynamic(() => import("./components/Navbar"), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Primenest",
  description: "E-commerce",
};

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: any;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
        <Providers>
          <StateContext>
            <Navbar />
            <Toaster />
            {children}
            <Footer />
          </StateContext>
        </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
