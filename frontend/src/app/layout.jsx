import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import NavbarWrapper from "@/components/NavbarWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DropSync - Smart Dropshipping Ecosystem",
  description: "Next-generation dropshipping platform for customers, sellers, and suppliers. Featuring automated inventory, order forwarding, and ultra-fast local deliveries.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-[Inter]`}>
        <NavbarWrapper />
        <main className="flex-grow flex flex-col items-center justify-center relative w-full overflow-hidden">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
