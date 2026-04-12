import Link from "next/link";
import ArchivePageShell from "@/components/ArchivePageShell";
import { locations } from "@/types/locations";

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
              <Link href={`/locations/${location.slug}`} className="transition hover:text-[#ffedd5]">
                {location.name}
              </Link>
            </h2>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-[#fde68a]">
              {location.faction}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{location.note}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/locations/${location.slug}`}
                className="rounded border border-[#f97316]/70 bg-black/65 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ffedd5] transition hover:border-[#fb923c]"
              >
                open dossier
              </Link>
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
