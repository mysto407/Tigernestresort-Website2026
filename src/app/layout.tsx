import type { Metadata } from "next";
import { Cormorant_Garamond, Gloock, League_Script } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AlignmentGuide from "@/components/dev/AlignmentGuide";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const leagueScript = League_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const gloock = Gloock({
  variable: "--font-gloock",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const daltonWhite = localFont({
  src: "../../public/dalton-white/Dalton White.otf",
  variable: "--font-dalton",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tiger's Nest Resort — Paro, Bhutan",
  description:
    "A luxury resort nestled in Paro Valley, Bhutan, at the foot of the sacred Taktsang Monastery. Where luxury meets tradition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${leagueScript.variable} ${daltonWhite.variable} ${gloock.variable} `}>
      <body className="min-h-screen flex flex-col bg-cream text-bark antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <AlignmentGuide />
      </body>
    </html>
  );
}
