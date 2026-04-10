import Link from "next/link";
import ArchivePageShell from "@/components/ArchivePageShell";

const locations = [
  {
    name: "Flower City",
    role: "Primary cityscape",
    faction: "Flower City Interests",
    note: "A neon-parasol power zone where elegance and cruelty share the same hallway.",
    links: ["/lore", "/factions"],
  },
  {
    name: "People of Pisces",
    role: "Seven-story ale joint",
    faction: "People of Pisces",
    note: "A musician’s nest, a board for gigs, and one of the saga’s most memorable meeting grounds.",
    links: ["/characters", "/logs"],
  },
  {
    name: "Central Socket",
    role: "Mythic infrastructure",
    faction: "Red Noodle Clan",
    note: "The stolen heart of the archive’s tech mythology—where betrayal and protocol overlap.",
    links: ["/lore", "/logs"],
  },
  {
    name: "Piano Factory",
    role: "Acoustic power plant",
    faction: "Skywave Collective",
    note: "Ventilation, jazz, and judgment. The building itself feels like an instrument with a memory.",
    links: ["/lore", "/factions"],
  },
  {
    name: "Salt Ring Enclave",
    role: "Dockside treaty zone",
    faction: "Salt Ring Enclave",
    note: "Brine, rust, silence, and blacked-out windows—where bargains last longer than names.",
    links: ["/factions", "/logs"],
  },
  {
    name: "Bamboo Mountain",
    role: "Kismet ridge",
    faction: "House of Yabu",
    note: "A stage for ancestral power, grief, and the kind of lineage that changes your hand on the weapon.",
    links: ["/lore", "/characters"],
  },
  {
    name: "Boricuapunk Archive",
    role: "Living dossier system",
    faction: "Red Noodle Clan",
    note: "The site’s own in-world frame: not a museum, but an active archive under construction.",
    links: ["/archive", "/about"],
  },
  {
    name: "Old San Juan Sprawl",
    role: "Harbor network",
    faction: "Dockside Syndicate",
    note: "Debts travel fast here. Tides do the accounting.",
    links: ["/factions", "/characters"],
  },
];

export default function LocationsPage() {
  return (
    <ArchivePageShell
      eyebrow="Location Atlas"
      title="Map Nodes"
      description="A place-focused view of the Boricuapunk world. These locations are the stage pieces that make the city feel navigable: the spaces characters return to, fight over, or never leave unchanged."
      meta={[
        "Urban landmarks",
        "Faction territory",
        "Story-critical meeting points",
      ]}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {locations.map((location) => (
          <article
            key={location.name}
            className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#160909] to-[#050505] p-5 shadow-[inset_0_0_32px_rgba(0,0,0,0.72)]"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-[#fb923c]">
              {location.role}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl uppercase tracking-[0.04em] text-[#fecaca]">
              {location.name}
            </h2>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-[#fde68a]">
              {location.faction}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{location.note}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {location.links.map((href) => (
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

      <section className="mt-12 rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
          Design note
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
          This page makes the setting feel like a real place you can learn. It also gives us a
          clean target for future map art, district diagrams, or location-specific story pages if
          you decide to go even deeper.
        </p>
      </section>
    </ArchivePageShell>
  );
}
