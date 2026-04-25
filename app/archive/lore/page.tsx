import Link from "next/link";
import ArchivePageShell from "@/components/ArchivePageShell";

const loreNodes = [
  {
    title: "The Folded Borough",
    excerpt:
      "Flower City folds inward like a letter never sent. The archive treats the borough as a crease in reality, not a map coordinate.",
    links: ["/locations"],
  },
  {
    title: "Raziel Underwire",
    excerpt:
      "Not a person, but the cough in the grid throat—where prayer and copper splice together and leave a blue spark behind.",
    links: ["/logs", "/characters/vera-cordoba"],
  },
  {
    title: "Glass Lung Choir",
    excerpt:
      "A hidden acoustic verdict under the Piano Factory. Tourists hear jazz; initiates hear a sentence delivered in harmony.",
    links: ["/locations", "/logs"],
  },
  {
    title: "Socket Ghost",
    excerpt:
      "The pause between hello and betrayal. The handshake artifact that keeps returning like a glitch with intent.",
    links: ["/logs", "/characters/manus-neco"],
  },
  {
    title: "Salt Ring Enclave",
    excerpt:
      "A dockside treaty carved in rust. Brine, blackout windows, and saints who know how to keep quiet.",
    links: ["/locations", "/factions"],
  },
  {
    title: "Obsidian Parade",
    excerpt:
      "A column that aligns instead of marching. No hymn, no hats—just a procession that arrives when the world is dreaming.",
    links: ["/locations", "/factions"],
  },
  {
    title: "Kumoyun Static Saint",
    excerpt:
      "Hope in porcelain with a contrail of almost-music. Everyone hears it differently; the archive refuses to simplify it.",
    links: ["/logs", "/characters/bloodless-visitor"],
  },
  {
    title: "Threadclose",
    excerpt:
      "The ending that isn’t an ending: gratitude as weapon, static as scripture, and a dare to keep the story alive.",
    links: ["/archive", "/about"],
  },
];

export default function LorePage() {
  return (
    <ArchivePageShell
      eyebrow="Lore Stack"
      title="Myth Fragments"
      description="A curated set of lore nodes pulled from the expanded saga and manuscript threads. This page turns the prose world into fast-scannable cards so the archive can grow without losing its mythic tone."
      meta={[
        "Expanded saga fragments",
        "In-world terminology",
        "Story beats and symbolic locations",
      ]}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loreNodes.map((node, index) => (
          <article
            key={node.title}
            className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#170909] to-[#050505] p-5 shadow-[inset_0_0_30px_rgba(0,0,0,0.7)]"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-[#fb923c]">
              Fragment {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl uppercase tracking-[0.04em] text-[#fecaca]">
              {node.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{node.excerpt}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {node.links.map((href) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded border border-[#9a3412]/70 bg-black/65 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
                >
                  {href.replace(/^\//, "")}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>

      <section className="mt-12 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            Why this page exists
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            The story already has a strong voice in its manuscript pages. This page extracts the
            most quotable ideas and gives them a permanent home in the site architecture, so future
            pages can reference them without making the homepage heavier.
          </p>
        </div>

        <div className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#120909] to-black/80 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.7)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            Ready for expansion
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-400">
            <li>• Add full chapter summaries later</li>
            <li>• Split location-specific lore into its own pages</li>
            <li>• Turn recurring entities into canonical entries</li>
            <li>• Keep the archive readable on mobile first</li>
          </ul>
        </div>
      </section>
    </ArchivePageShell>
  );
}
