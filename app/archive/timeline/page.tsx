import Link from "next/link";
import ArchivePageShell from "@/components/ArchivePageShell";

const timeline = [
  { era: "Origin", title: "The handwritten myth takes shape", description: "The archive begins as a story about Manus Neco, the Red Noodle Clan, and the gravity of a world where music and bladecraft share the same breath.", links: ["/about", "/characters/manus-neco", "/lore"] },
  { era: "Stage 01", title: "The Folded Borough appears", description: "Flower City bends into a crease in reality. The borough stops feeling like a map and starts behaving like a memory trap.", links: ["/lore", "/locations"] },
  { era: "Stage 02", title: "People of Pisces becomes a meeting ground", description: "A seven-story ale joint becomes a nexus for music, tension, and the first strong proof that the archive is larger than one hero.", links: ["/locations", "/logs", "/characters/manus-neco"] },
  { era: "Stage 03", title: "Faction pressure rises", description: "The Lily Pad Clan, the Neverminds, Dockside Syndicate, and the rest shape the city into a map of alliances and threats.", links: ["/factions", "/characters"] },
  { era: "Stage 04", title: "The archive gains a public face", description: "The site evolves from a single hero page into a browsable archive with routes for factions, lore fragments, locations, logs, and ships.", links: ["/archive", "/about", "/ships"] },
  { era: "Stage 05", title: "Cross-linking turns the site into a network", description: "Character dossiers, faction maps, lore nodes, ships, and logs begin pointing to each other. The world becomes navigable in layers.", links: ["/characters", "/factions", "/locations", "/logs", "/relationships"] },
];

export default function TimelinePage() {
  return (
    <ArchivePageShell
      eyebrow="Timeline"
      title="Story Progression"
      description="A compact chronology of the Boricuapunk archive itself. This page tracks the story’s major shifts, from the first Manus-centered myth to the broader route structure that now supports the entire universe."
      meta={["Chronological view", "Archive milestones", "Narrative layers"]}
    >
      <div className="space-y-4">
        {timeline.map((entry, index) => (
          <article
            key={entry.title}
            className="grid gap-4 rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#160909] to-[#050505] p-5 shadow-[inset_0_0_32px_rgba(0,0,0,0.72)] md:grid-cols-[auto_1fr] md:gap-6 md:p-6"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f97316]/70 bg-black/70 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#fb923c] shadow-[0_0_18px_rgba(234,88,12,0.2)]">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-[#fb923c]">
                  {entry.era}
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl uppercase tracking-[0.04em] text-[#fecaca]">
                  {entry.title}
                </h2>
              </div>
            </div>

            <div>
              <p className="text-sm leading-relaxed text-zinc-400">{entry.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.links.map((href) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded border border-[#9a3412]/70 bg-black/65 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
                  >
                    {href.replace(/^\//, "")}
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-12 rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
          Use case
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
          This is the easiest place to orient new readers or remind yourself where the archive
          has gone. It also creates a natural landing pad for future chapter-by-chapter updates.
        </p>
      </section>
    </ArchivePageShell>
  );
}
