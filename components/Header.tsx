import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b-[3px] border-[#7f1d1d]/90 bg-gradient-to-b from-[#0f0f0f] to-black/95 shadow-[inset_0_-2px_12px_rgba(0,0,0,0.85),0_4px_24px_rgba(234,88,12,0.12)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 md:px-6">
        <Link
          href="/"
          className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-[#fecaca] transition-shadow [text-shadow:0_0_24px_rgba(248,113,113,0.25)] hover:text-[#ffedd5] hover:shadow-[0_0_16px_rgba(234,88,12,0.55)]"
        >
          Boricuapunk Archive
        </Link>
        <nav className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.18em] md:gap-6 md:text-xs md:tracking-[0.25em]">
          <Link href="/" className="text-zinc-500 transition hover:text-[#fdba74] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)]">
            Home
          </Link>
          <Link href="/archive" className="text-zinc-500 transition hover:text-[#fdba74] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)]">
            Archive
          </Link>
          <Link href="/characters" className="text-zinc-500 transition hover:text-[#fdba74] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)]">
            Characters
          </Link>
          <Link href="/factions" className="hidden text-zinc-500 transition hover:text-[#fdba74] hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.75)] md:inline-flex">
            Factions
          </Link>
        </nav>
      </div>
    </header>
  );
}
