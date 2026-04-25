import type { Metadata } from "next";
import { Bebas_Neue, Geist, Geist_Mono } from "next/font/google";
import HackermouthProvider from "@/components/hackermouth/HackermouthProvider";
import HackermouthNode from "@/components/hackermouth/HackermouthNode";
import Header from "@/components/Header";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "Boricuapunk Archive",
    template: "%s | Boricuapunk Archive",
  },
  description:
    "A living archive for the Red Noodle Clan universe — characters, factions, lore, locations, and logs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#050505] text-stone-200">
        <HackermouthProvider>
          <div
            id="hm-app-shell"
            className="relative flex min-h-screen w-full flex-col overflow-hidden transition-transform duration-75 ease-out will-change-transform"
          >
            <Header />
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
          </div>
          <HackermouthNode />
        </HackermouthProvider>
      </body>
    </html>
  );
}
