import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CartProvider } from "@/context/CartContext";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Texas Hotel | Luxury Hospitality & QR Dining",
  description:
    "Texas Hotel — premium stays, contactless QR dining, real-time order tracking, and modern hospitality all in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <SessionProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
