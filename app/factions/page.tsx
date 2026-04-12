import Link from "next/link";
import ArchivePageShell from "@/components/ArchivePageShell";
import { characters } from "@/types/characters";
import { factions } from "@/types/factions";

const alignmentStyles: Record<string, string> = {
  ally: "text-[#86efac] border-[#22c55e]/70 bg-[#052e16]/80",
  enemy: "text-[#fecaca] border-[#f87171]/70 bg-[#450a0a]/80",
  neutral: "text-[#fde68a] border-[#f59e0b]/70 bg-[#422006]/80",
  unknown: "text-[#c4b5fd] border-[#a78bfa]/70 bg-[#1e1b4b]/80",
};

function getFactionMembers(factionId: string) {
  return characters.filter((c) => c.faction === factionId);
}

export default function FactionsPage() {
  return (
    <ArchivePageShell
      eyebrow="Faction Index"
      title="Power Maps"
      description="Every faction in the Boricuapunk archive, organized by alignment and by the figures who carry their name. Use this page to understand who moves with whom and which groups are allies, enemies, or still unreadable."
      meta={[`${factions.length} factions`, `${characters.length} indexed figures`]}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {factions.map((faction) => {
          const roster = getFactionMembers(faction.id);
          return (
            <article
              key={faction.id}
              className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#160909] via-[#0d0d0d] to-[#050505] p-5 shadow-[inset_0_0_32px_rgba(0,0,0,0.72)] md:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-[#fb923c]">
                    {faction.id}
                  </p>
                  <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl uppercase tracking-[0.04em] text-[#fecaca]">
                    <Link href={`/factions/${faction.id}`} className="transition hover:text-[#ffedd5]">
                      {faction.name}
                    </Link>
                  </h2>
                </div>
                <span
                  className={`rounded border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${
                    alignmentStyles[faction.alignment]
                  }`}
                >
                  {faction.alignment}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-zinc-400 md:text-base">
                {faction.description}
              </p>

              <Link
                href={`/factions/${faction.id}`}
                className="mt-4 inline-flex rounded border border-[#f97316]/70 bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#ffedd5] transition hover:border-[#fb923c]"
              >
                open dossier
              </Link>

              <div className="mt-5 border-t border-[#451a1a]/70 pt-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-600">
                  Known members
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {roster.length ? (
                    roster.map((member) => (
                      <Link
                        key={member.id}
                        href={`/characters/${member.id}`}
                        className="rounded border border-[#9a3412]/70 bg-black/65 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
                      >
                        {member.name}
                      </Link>
                    ))
                  ) : (
                    <span className="text-sm text-zinc-600">No roster entries linked yet.</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section className="mt-12 rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
          Reading order
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
          Red Noodle Clan is the heart of the archive. The Lily Pad Clan and Neverminds are your
          biggest pressure points. Neon Independents, Skywave Collective, Dockside Syndicate, and
          the rest form the city’s shifting balance—sometimes ally, sometimes obstruction, always
          useful context.
        </p>
        <Link
          href="/relationships"
          className="mt-4 inline-flex rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
        >
          Open relationship graph
        </Link>
      </section>
    </ArchivePageShell>
  );
}
