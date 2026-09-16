import type { Metadata } from "next";
import { Cinzel, Playfair_Display, Inter } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MUQADMA 2026",
  description: "Moot Court Competition - St. Agnes College",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-court-dark text-parchment">
        <Header />
        {children}
      </body>
    </html>
  );
}
