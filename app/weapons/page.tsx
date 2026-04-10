import Link from "next/link";
import ArchivePageShell from "@/components/ArchivePageShell";

const weapons = [
  {
    name: "Cuatroblade",
    type: "Hidden blade / instrument weapon",
    note:
      "Manus’s found Cuatro conceals a blade, merging music and combat in the cleanest possible Boricuapunk way.",
    links: ["/characters/manus-neco", "/relationships", "/lore"],
  },
  {
    name: "Spada Virina",
    type: "Cursed purple-black blade",
    note:
      "A key reward weapon with serious narrative weight. It shifts from prize to hollow blade and back into history.",
    links: ["/characters/spada-virina", "/relationships", "/timeline"],
  },
  {
    name: "Sword of Yindao",
    type: "Planet Weapon",
    note:
      "One of the story’s central weapons, tied to soul-hunger, retribution, and clan-scale conflict.",
    links: ["/relationships", "/factions", "/logs"],
  },
  {
    name: "Chitsu Nunchucks",
    type: "Planet Weapon",
    note:
      "A wind-slicing weapon associated with Modest Shoe Chou and one of the most vivid combat images in the saga.",
    links: ["/characters", "/relationships", "/timeline"],
  },
  {
    name: "Kami Yujin Swords",
    type: "Blade set",
    note:
      "Twin-style swords that reinforce the archive’s sense of weapon lineages and martial identity.",
    links: ["/characters", "/lore"],
  },
  {
    name: "Hackermouth",
    type: "Programming weapon / signal curse",
    note:
      "More than a phrase: a weaponized system of control, noise, and tech-horror in the archive’s underlayer.",
    links: ["/logs", "/lore", "/relationships"],
  },
];

export default function WeaponsPage() {
  return (
    <ArchivePageShell
      eyebrow="Armory"
      title="Weapons Archive"
      description="The novel treats weapons as mythology, not just equipment. This page gathers the major blades, tools, and weapon-like systems so the archive can show the story’s combat identity, symbolic objects, and clan-scale power pieces in one place."
      meta={["Planet Weapons", "Blades and hidden tech", "Combat lore"]}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {weapons.map((weapon) => (
          <article
            key={weapon.name}
            className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#160909] to-[#050505] p-5 shadow-[inset_0_0_32px_rgba(0,0,0,0.72)] md:p-6"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-[#fb923c]">
              {weapon.type}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl uppercase tracking-[0.04em] text-[#fecaca]">
              {weapon.name}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{weapon.note}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {weapon.links.map((href) => (
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
            Why this matters
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            The archive gains a stronger mythic texture when weapons are treated like named
            characters. That makes the world feel closer to the novel’s scale and tone.
          </p>
        </div>

        <div className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#120909] to-black/80 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.7)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            Ready for expansion
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-400">
            <li>• Add weapon-specific detail pages later</li>
            <li>• Split Planet Weapons into their own subgroup</li>
            <li>• Link combat scenes from character dossiers</li>
            <li>• Treat tech-curse items like Hackermouth as a separate system</li>
          </ul>
        </div>
      </section>
    </ArchivePageShell>
  );
}
