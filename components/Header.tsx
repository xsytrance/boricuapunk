'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="border-b-[3px] border-[#7f1d1d]/90 bg-gradient-to-b from-[#0f0f0f] to-black/95 shadow-[inset_0_-2px_12px_rgba(0,0,0,0.85),0_4px_24px_rgba(234,88,12,0.12)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 md:px-6">
          <Link
            href="/"
            className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-[#fecaca] transition-shadow [text-shadow:0_0_24px_rgba(248,113,113,0.25)] hover:text-[#ffedd5] hover:shadow-[0_0_16px_rgba(234,88,12,0.55)]"
          >
            Boricuapunk Archive
          </Link>
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full hover:bg-[#7f1d1d]/30"
              aria-label="Open menu"
            >
              {/* Hamburger icon */}
              <svg className="h-5 w-5 text-[#fdba74] transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Desktop navigation (hidden on mobile) */}
      <nav className="hidden md:flex flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] md:gap-8 md:text-xs md:tracking-[0.25em]">
        <Link
          href="/"
          className="text-zinc-500 transition hover:text-[#fdba74] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)]"
        >
          Home
        </Link>
        <Link href="/archive" className="text-zinc-500 transition hover:text-[#fdba74] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)]">
          Archive
        </Link>
        <Link href="/characters" className="text-zinc-500 transition hover:text-[#fdba74] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)]">
          Characters
        </Link>
        <Link href="/factions" className="text-zinc-500 transition hover:text-[#fdba74] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)]">
          Factions
        </Link>
        <Link href="/timeline" className="text-zinc-500 transition hover:text-[#fdba74] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)]">
          Timeline
        </Link>
        <Link href="/comics" className="text-zinc-500 transition hover:text-[#fdba74] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)]">
          Comics
        </Link>
        <Link href="/relationships" className="text-zinc-500 transition hover:text-[#fdba74] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)]">
          Graph
        </Link>
        <Link
          href="/characters/hackermouth"
          className="text-[#5eead4] transition hover:text-[#99f6e4] hover:drop-shadow-[0_0_10px_rgba(45,212,191,0.85)]"
        >
          Hackermouth
        </Link>
      </nav>

      {/* Mobile menu drawer */}
      <div className="md:hidden">
        <div className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm ${isOpen ? 'block' : 'hidden'}`}>
          <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-[#0f0f0f] to-black/95 border-r-[3px] border-[#7f1d1d]/90 shadow-[0_0_24px_rgba(234,88,12,0.2)] flex flex-col items-start pt-10 px-4 space-y-6">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-3 text-zinc-400 hover:text-[#fdba74]"
              aria-label="Close menu"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition hover:text-[#fdba74] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)]"
              >
                Home
              </Link>
              <Link
                href="/archive"
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition hover:text-[#fdba74] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)]"
              >
                Archive
              </Link>
              <Link
                href="/characters"
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition hover:text-[#fdba74] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)]"
              >
                Characters
              </Link>
              <Link
                href="/factions"
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition hover:text-[#fdba74] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)]"
              >
                Factions
              </Link>
              <Link
                href="/timeline"
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition hover:text-[#fdba74] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)]"
              >
                Timeline
              </Link>
              <Link
                href="/relationships"
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition hover:text-[#fdba74] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)]"
              >
                Graph
              </Link>
              <Link
                href="/characters/hackermouth"
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5eead4] transition hover:text-[#99f6e4] hover:drop-shadow-[0_0_10px_rgba(45,212,191,0.85)]"
              >
                Hackermouth
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}