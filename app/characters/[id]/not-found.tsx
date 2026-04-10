import Link from "next/link";

export default function CharacterNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24">
      <div className="w-full max-w-lg border-[3px] border-[#c2410c] bg-gradient-to-b from-[#1a1010] to-[#050505] p-10 text-center shadow-[inset_0_0_50px_rgba(0,0,0,0.75),0_0_40px_rgba(234,88,12,0.2)]">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.45em] text-[#ea580c]">
          Archive Error
        </p>
        <h1 className="mt-5 font-[family-name:var(--font-display)] text-4xl uppercase tracking-[0.06em] text-[#fecaca] [text-shadow:0_0_24px_rgba(248,113,113,0.25)] md:text-5xl">
          Signal Lost
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-zinc-400">
          This identity does not exist in the archive.
        </p>
        <Link
          href="/characters"
          className="mt-10 inline-block border-[3px] border-[#7f1d1d] bg-black px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#fb923c] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] transition hover:border-[#ea580c] hover:shadow-[0_0_28px_rgba(234,88,12,0.45)]"
        >
          Return to roster
        </Link>
      </div>
    </main>
  );
}
