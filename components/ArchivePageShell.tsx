import Link from "next/link";
import type { ReactNode } from "react";

type ArchivePageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  meta?: string[];
};

export default function ArchivePageShell({
  eyebrow,
  title,
  description,
  children,
  meta = [],
}: ArchivePageShellProps) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 md:px-8 md:py-12">
      <div className="mb-8 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-500 md:mb-10">
        <Link href="/" className="text-[#fdba74] transition hover:text-[#fecaca]">
          Home
        </Link>
        <span className="text-zinc-700">/</span>
        <span>{eyebrow}</span>
      </div>

      <header className="mb-10 border-l-[4px] border-[#ea580c] pl-5 shadow-[inset_8px_0_24px_rgba(234,88,12,0.08)] md:mb-12">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.42em] text-[#fb923c]">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl uppercase tracking-[0.04em] text-[#fecaca] [text-shadow:0_0_24px_rgba(248,113,113,0.22)] md:text-6xl md:tracking-[0.03em]">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-500 md:text-base">
          {description}
        </p>

        {meta.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {meta.map((item) => (
              <span
                key={item}
                className="rounded border border-[#7f1d1d]/70 bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#fde68a]"
              >
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      {children}
    </main>
  );
}
