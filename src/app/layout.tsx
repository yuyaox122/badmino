import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TopNav, BottomNav } from "@/components/Navigation";
import { UserProvider } from "@/context/UserContext";
import { BookingProvider } from "@/context/BookingContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Goodminton - Find Your Perfect Partner",
  description: "Connect with badminton players near you. Find partners, join tournaments, and become part of the community.",
  keywords: ["badminton", "sports", "community", "partner finder", "tournaments"],
  authors: [{ name: "AstonHack11 Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-sky-50 via-white to-blue-50 min-h-screen`}
      >
        <UserProvider>
          <BookingProvider>
            <TopNav />
            <main className="min-h-screen pb-20 md:pb-0">
              {children}
            </main>
            <BottomNav />
          </BookingProvider>
        </UserProvider>
      </body>
    </html>
  );
}