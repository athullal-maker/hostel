import type { Metadata, Viewport } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileTabBar from "@/components/layout/MobileTabBar";
import AuthProvider from "@/components/providers/AuthProvider";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kerala Hostel Booker | Verified Hostels, PGs & Co-Living Across Kerala",
  description:
    "Find and book verified student hostels, working professional PGs, and co-living spaces in Kochi, Trivandrum, Kozhikode, and across Kerala. Transparent pricing, no brokerage.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-charcoal font-body selection:bg-primary-50 selection:text-primary-dark">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pb-app-nav md:pb-0">{children}</main>
          <Footer />
          <MobileTabBar />
        </AuthProvider>
      </body>
    </html>
  );
}
