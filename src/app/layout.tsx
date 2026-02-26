import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DentalAI - Oral Health Analysis",
  description:
    "AI-powered dental disease detection and comprehensive oral health analysis",
  keywords: ["dental", "AI", "oral health", "disease detection", "teeth analysis"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased gradient-bg tooth-pattern min-h-screen">
        {children}
      </body>
    </html>
  );
}
