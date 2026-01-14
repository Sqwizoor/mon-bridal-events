"use client";

import { Playfair_Display, Lato, Great_Vibes } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "./ConvexClientProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/CartContext";
import UserSync from "@/components/UserSync";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${playfair.variable} ${lato.variable} ${greatVibes.variable} antialiased font-sans`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClientProvider>
              <UserSync />
              <CartProvider>
                <div className="flex min-h-screen flex-col">
                  {!isAdminRoute && <Navbar />}
                  <main className="flex-1">{children}</main>
                  {!isAdminRoute && <Footer />}
                  <Toaster />
                </div>
              </CartProvider>
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
