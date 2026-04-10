import Link from "next/link";
import HomeLanding from "@/components/HomeLanding";

export default function Home() {
  return (
    <main className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
      <HomeLanding />
      <section className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8 md:py-12">
        <div className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            More routes
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl uppercase tracking-[0.04em] text-[#fecaca] md:text-4xl">
            The archive is now expandable.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
            I added a proper archive hub and the first expansion set so the site can grow into a
            multi-page world instead of staying homepage-only. Start with the Archive link in the
            header if you want the new route map.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/archive"
              className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
            >
              Archive Hub
            </Link>
            <Link
              href="/characters"
              className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
            >
              Characters
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
