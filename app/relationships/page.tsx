import Link from "next/link";
import ArchivePageShell from "@/components/ArchivePageShell";

const relationships = [
  {
    source: "Manus Neco",
    target: "The GRATS",
    type: "ally / legacy bond",
    note: "The childhood blade-squad that protects the Central Socket myth and reflects the hero’s original tribe.",
    links: ["/characters/manus-neco", "/characters/gratitude-frogs-grats", "/factions"],
  },
  {
    source: "Manus Neco",
    target: "La Mofongo",
    type: "internal ally",
    note: "A support-unit relationship that grounds the archive in food, care, and practical survival.",
    links: ["/characters/manus-neco", "/characters/la-mofongo", "/characters"],
  },
  {
    source: "Manus Neco",
    target: "Vera Córdoba",
    type: "signal ally",
    note: "A grid-adjacent oracle connection that links the physical world to the archive’s electric underlayer.",
    links: ["/characters/vera-cordoba", "/logs", "/lore"],
  },
  {
    source: "Manus Neco",
    target: "Yulania Friz",
    type: "hostile thread",
    note: "The Neverminds hunt the black; Manus stands in the path of that pressure.",
    links: ["/characters/yulania-friz", "/factions", "/logs"],
  },
  {
    source: "Perfect Abuelo",
    target: "Manus Neco",
    type: "ancestral mentorship",
    note: "Bladecraft and musiccraft fuse into the hero’s style, making inheritance feel like action instead of history.",
    links: ["/characters/manus-neco", "/lore"],
  },
  {
    source: "Tito Kaiju",
    target: "Dockside Syndicate",
    type: "tension / dependency",
    note: "Debt flows through the harbor as much as water does; the syndicate is both shelter and hook.",
    links: ["/factions", "/locations", "/logs"],
  },
  {
    source: "DJ Astro",
    target: "Skywave Collective",
    type: "signal clergy",
    note: "Music as map and bass as law—this is one of the clearest examples of faction identity becoming atmosphere.",
    links: ["/factions", "/locations", "/logs"],
  },
  {
    source: "Sifu Kinoko",
    target: "The Lily Pad Clan",
    type: "cult hierarchy",
    note: "The clearest enemy pressure point in the archive: doctrine, citadels, and obsession dressed as scripture.",
    links: ["/factions", "/lore"],
  },
  {
    source: "Saint Flamingo",
    target: "Spada Virina",
    type: "weapon conflict",
    note: "The blade is not just a tool, but a hinge between tyranny and revolt.",
    links: ["/characters/saint-flamingo", "/characters/spada-virina", "/lore"],
  },
];

export default function RelationshipsPage() {
  return (
    <ArchivePageShell
      eyebrow="Relationship Graph"
      title="Connection Map"
      description="A narrative network for the archive. These links show who matters to whom, which tensions drive the story, and how the universe starts to behave when characters are read together instead of alone."
      meta={[
        "Allies and tensions",
        "Character-to-character links",
        "Faction and lore bridges",
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {relationships.map((rel) => (
          <article
            key={`${rel.source}-${rel.target}`}
            className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#160909] to-[#050505] p-5 shadow-[inset_0_0_32px_rgba(0,0,0,0.72)] md:p-6"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-[#fb923c]">
              {rel.type}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl uppercase tracking-[0.04em] text-[#fecaca]">
              {rel.source} ↔ {rel.target}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{rel.note}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {rel.links.map((href) => (
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
            How to read it
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            This page is meant to answer “who is connected to who?” fast. It gives the site a
            relationship layer that can keep expanding as new characters or story threads appear.
          </p>
        </div>

        <div className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#120909] to-black/80 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.7)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            Next expansion targets
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-400">
            <li>• Add relationship tags inside character detail pages</li>
            <li>• Promote faction pages into richer mini-hubs</li>
            <li>• Turn locations into detail pages with linked characters</li>
            <li>• Add a visual graph later if you want a network-style view</li>
          </ul>
        </div>
      </section>
    </ArchivePageShell>
  );
}
