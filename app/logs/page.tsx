import ArchivePageShell from "@/components/ArchivePageShell";
import { quotes } from "@/data/quotes";
import { characters } from "@/types/characters";

const highlightedQuotes = quotes.slice(0, 12);

export default function LogsPage() {
  return (
    <ArchivePageShell
      eyebrow="Signal Logs"
      title="Transmission Feed"
      description="A compact logbook for quotes, signal fragments, and archive voice. This page is useful both as an in-world feed and as a quick way to scan the tone of the universe without diving into a full character entry."
      meta={[
        `${highlightedQuotes.length} highlighted lines`,
        `${characters.length} character sources`,
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {highlightedQuotes.map((quote, index) => {
          const character = characters.find((c) => c.id === quote.characterId);
          return (
            <article
              key={quote.id}
              className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#160909] to-[#050505] p-5 shadow-[inset_0_0_30px_rgba(0,0,0,0.72)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-[#fb923c]">
                    Log {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl uppercase tracking-[0.04em] text-[#fecaca]">
                    {character?.name ?? quote.speakerName ?? quote.characterId}
                  </h2>
                </div>
                <span className="rounded border border-[#9a3412]/70 bg-black/65 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fde68a]">
                  {quote.style}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-300">“{quote.text}”</p>
            </article>
          );
        })}
      </div>

      <section className="mt-12 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            Log utility
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            This page gives the archive a fast-glance feed of tone and character voice. It’s a
            lightweight place to keep expanding quotes, dialogues, or transmission notes later.
          </p>
        </div>

        <div className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#120909] to-black/80 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.7)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            Voice palette
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-400">
            <li>• Streetfighter lines for confrontations and vow moments</li>
            <li>• Graffiti lines for symbolic, cryptic, or poetic fragments</li>
            <li>• Character names resolve from either dossier or saga data</li>
            <li>• Hackermouth lines stay ready for hijack-style moments</li>
          </ul>
        </div>
      </section>
    </ArchivePageShell>
  );
}
