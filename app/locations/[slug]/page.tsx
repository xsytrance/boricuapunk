import Link from "next/link";
import { notFound } from "next/navigation";
import ArchivePageShell from "@/components/ArchivePageShell";
import { getFactionById } from "@/types/factions";
import { locations, getLocationBySlug } from "@/types/locations";
import { characters } from "@/types/characters";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}

export default async function LocationDetailPage({ params }: Props) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) notFound();

  const faction = location.factionId ? getFactionById(location.factionId) : undefined;
  const linkedCharacters = location.factionId
    ? characters.filter((character) => character.faction === location.factionId).slice(0, 10)
    : [];

  return (
    <ArchivePageShell
      eyebrow="Location Dossier"
      title={location.name}
      description={location.note}
      meta={[location.role, location.faction, `${linkedCharacters.length} linked figures`]}
    >
      <section className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#160909] via-[#0d0d0d] to-[#050505] p-5 shadow-[inset_0_0_32px_rgba(0,0,0,0.72)] md:p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-600">Node summary</p>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
          {location.name} is indexed as a {location.role.toLowerCase()} route in the archive. Use the
          link panel below to branch into connected pages and keep traversal continuous.
        </p>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <article className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#fb923c]">Connected routes</p>
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

        <article className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#fb923c]">Faction anchor</p>
          {faction ? (
            <>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl uppercase tracking-[0.04em] text-[#fecaca]">
                {faction.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{faction.description}</p>
              <Link
                href={`/factions/${faction.id}`}
                className="mt-4 inline-flex rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
              >
                open faction dossier
              </Link>
            </>
          ) : (
            <p className="mt-3 text-sm text-zinc-600">No faction dossier linked for this location.</p>
          )}
        </article>
      </section>

      <section className="mt-8 rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#fb923c]">Linked figures</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {linkedCharacters.length ? (
            linkedCharacters.map((character) => (
              <Link
                key={character.id}
                href={`/characters/${character.id}`}
                className="rounded border border-[#9a3412]/70 bg-black/65 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
              >
                {character.name}
              </Link>
            ))
          ) : (
            <p className="text-sm text-zinc-600">No linked figures found for this node yet.</p>
          )}
        </div>
      </section>

      <section className="mt-8 rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#fb923c]">Continue archive traversal</p>
        <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.18em]">
          <Link href="/archive" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Archive Hub</Link>
          <Link href="/locations" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Locations</Link>
          <Link href="/factions" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Factions</Link>
          <Link href="/characters" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Characters</Link>
        </div>
      </section>
    </ArchivePageShell>
  );
}