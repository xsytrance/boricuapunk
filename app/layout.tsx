import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import HackermouthProvider from '@/components/hackermouth/HackermouthProvider';
import HackermouthNode from '@/components/hackermouth/HackermouthNode';

export const metadata: Metadata = {
  title: 'BoricuaPunk',
  description: 'Red Noodle Clan Universe Rebuild',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <nav className="border-b border-[#9a3412]/30 bg-black/50 px-4 py-2">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="font-mono text-[10px] text-[#fb923c] uppercase tracking-[0.18em]">
              Boricuapunk
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="/characters"
                className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
              >
                Characters
              </Link>
              <Link
                href="/comics"
                className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
              >
                Comics
              </Link>
              <a
                href="https://t.me/kodenbushi_bot"
                className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
              >
                Telegram Bot
              </a>
              <a
                href="/profile"
                className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
              >
                Koden Bushi Bloodflower
              </a>
            </div>
          </div>
        </nav>
        <HackermouthProvider>
          {children}
          <HackermouthNode />
        </HackermouthProvider>
      </body>
    </html>
  );
}
