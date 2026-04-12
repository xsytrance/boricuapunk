import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b-[3px] border-[#7f1d1d]/90 bg-gradient-to-b from-[#0f0f0f] to-black/95 shadow-[inset_0_-2px_12px_rgba(0,0,0,0.85),0_4px_24px_rgba(234,88,12,0.12)] backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-3.5 md:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <Link
          href="/"
          className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#fecaca] transition-shadow [text-shadow:0_0_24px_rgba(248,113,113,0.25)] hover:text-[#ffedd5] hover:shadow-[0_0_16px_rgba(234,88,12,0.55)] md:text-sm md:tracking-[0.18em]"
        >
          Boricuapunk Archive
        </Link>
        <nav className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-bold uppercase tracking-[0.14em] md:gap-x-6 md:text-xs md:tracking-[0.22em] lg:w-auto lg:justify-end">
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
          <Link href="/review" className="text-[#fde68a] transition hover:text-[#ffedd5] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)]">
            Review
          </Link>
          <Link href="/factions" className="hidden text-zinc-500 transition hover:text-[#fdba74] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)] md:inline-flex">
            Factions
          </Link>
          <Link href="/timeline" className="hidden text-zinc-500 transition hover:text-[#fdba74] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)] lg:inline-flex">
            Timeline
          </Link>
          <Link href="/relationships" className="hidden text-zinc-500 transition hover:text-[#fdba74] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)] lg:inline-flex">
            Graph
          </Link>
          <Link
            href="/characters/hackermouth"
            className="text-[#5eead4] transition hover:text-[#99f6e4] hover:drop-shadow-[0_0_10px_rgba(45,212,191,0.85)]"
          >
            <span className="md:hidden">HM</span>
            <span className="hidden md:inline">Hackermouth</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
