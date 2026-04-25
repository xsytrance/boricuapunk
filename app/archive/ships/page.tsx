import Link from "next/link";
import ArchivePageShell from "@/components/ArchivePageShell";

const ships = [
  {
    name: "Jibaro",
    role: "Core skycraft / cosmic ark",
    note:
      "Manus’s primary vessel. The novel frames it as a sovereign skycraft, a home in motion, and the most important ship in the saga.",
    links: ["/characters/manus-neco", "/timeline", "/relationships"],
  },
  {
    name: "The Bloom",
    role: "Neverminds skycraft",
    note:
      "A rival vessel used by Yulania Friz and the Neverminds, bringing pursuit energy and aerial tension into the story.",
    links: ["/characters/yulania-friz", "/factions", "/logs"],
  },
  {
    name: "The Star of Aether",
    role: "Ceremonial skycraft",
    note:
      "A gold-and-bronze vessel that appears like a mythic arrival—part transportation, part omen.",
    links: ["/lore", "/locations"],
  },
  {
    name: "Mabaho Paa",
    role: "Ojipati craft / assault ship",
    note:
      "A mocassin-shaped skycraft used during the hunt for the Planet Weapons. It deserves a place alongside Jibaro as a major craft of the saga.",
    links: ["/relationships", "/timeline", "/logs"],
  },
  {
    name: "Asopao",
    role: "Anti-gravity racer",
    note:
      "Built from Jibaro parts and tied to the archive’s larger machine lineage. A perfect example of scraps becoming legend.",
    links: ["/lore", "/relationships"],
  },
  {
    name: "The Race Craft",
    role: "Restoration-era vehicle",
    note:
      "A later expression of the Jibaro repair cycle: proof that the ship’s parts, myth, and legacy continue to propagate.",
    links: ["/timeline", "/logs"],
  },
];

export default function ShipsPage() {
  return (
    <ArchivePageShell
      eyebrow="Shipyard"
      title="Vessels and Skycraft"
      description="The novel gives the archive a strong transport identity, especially through the Jibaro spacecraft. This page collects the key ships and aerial vehicles so the world feels mobile, mythic, and connected by motion instead of only by static locations."
      meta={["Jibaro included", "Skycraft lore", "Vehicle lineage"]}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {ships.map((ship) => {
          const isJibaro = ship.name === "Jibaro";
          return isJibaro ? (
            <Link
              key={ship.name}
              href="/ships/jibaro"
              className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#160909] to-[#050505] p-5 shadow-[inset_0_0_32px_rgba(0,0,0,0.72)] transition hover:border-[#f97316] md:p-6"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-[#fb923c]">
                {ship.role}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl uppercase tracking-[0.04em] text-[#fecaca]">
                {ship.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{ship.note}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {ship.links.map((href) => (
                  <span key={href} className="rounded border border-[#9a3412]/70 bg-black/65 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#fde68a]">
                    {href.replace(/^\//, "")}
                  </span>
                ))}
              </div>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-[#fb923c]">Open detail</p>
            </Link>
          ) : (
            <article
              key={ship.name}
              className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#160909] to-[#050505] p-5 shadow-[inset_0_0_32px_rgba(0,0,0,0.72)] md:p-6"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-[#fb923c]">
                {ship.role}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl uppercase tracking-[0.04em] text-[#fecaca]">
                {ship.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{ship.note}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {ship.links.map((href) => (
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
          );
        })}
      </div>

      <section className="mt-12 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            Why this matters
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            The Jibaro is one of the novel’s strongest recurring images. Making it a first-class
            page gives the archive a better sense of travel, pursuit, repair, and continuity.
          </p>
        </div>

        <div className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#120909] to-black/80 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.7)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            Future use
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-400">
            <li>• Add flight paths, dock notes, or repair history later</li>
            <li>• Link ships to chapters and story beats</li>
            <li>• Promote Jibaro into a visual showcase if you add art</li>
            <li>• Expand into vehicles, gear, and weapon transport pages</li>
          </ul>
        </div>
      </section>
    </ArchivePageShell>
  );
}
