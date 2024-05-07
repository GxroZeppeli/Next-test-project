import type { Metadata } from "next";
import { Dosis } from "next/font/google";
import "./globals.css";
import Header, { BrandLogo } from "@/lib/Header";
import Footer from "@/lib/Footer";
import { auth } from "../../auth";

const inter = Dosis({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Endgame Gear",
  description: "High quality device store",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <BrandLogo />
        <Header session={session} />
        <div className="min-h-screen">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
