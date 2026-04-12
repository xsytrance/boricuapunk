import Link from "next/link";
import { notFound } from "next/navigation";
import ArchivePageShell from "@/components/ArchivePageShell";
import { factions, getFactionById } from "@/types/factions";
import { characters } from "@/types/characters";
import { locations } from "@/types/locations";

type Props = { params: Promise<{ id: string }> };

const alignmentStyles: Record<string, string> = {
  ally: "text-[#86efac] border-[#22c55e]/70 bg-[#052e16]/80",
  enemy: "text-[#fecaca] border-[#f87171]/70 bg-[#450a0a]/80",
  neutral: "text-[#fde68a] border-[#f59e0b]/70 bg-[#422006]/80",
  unknown: "text-[#c4b5fd] border-[#a78bfa]/70 bg-[#1e1b4b]/80",
};

export async function generateStaticParams() {
  return factions.map((faction) => ({ id: faction.id }));
}

export default async function FactionDetailPage({ params }: Props) {
  const { id } = await params;
  const faction = getFactionById(id);
  if (!faction) notFound();

  const members = characters.filter((character) => character.faction === faction.id).slice(0, 12);
  const relatedLocations = locations.filter((location) => location.factionId === faction.id).slice(0, 6);

  return (
    <ArchivePageShell
      eyebrow="Faction Dossier"
      title={faction.name}
      description={faction.description}
      meta={[faction.id, `${members.length} linked members`, `${relatedLocations.length} linked locations`]}
    >
      <section className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#160909] via-[#0d0d0d] to-[#050505] p-5 shadow-[inset_0_0_32px_rgba(0,0,0,0.72)] md:p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-600">Alignment</p>
        <span
          className={`mt-3 inline-flex rounded border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${
            alignmentStyles[faction.alignment]
          }`}
        >
          {faction.alignment}
        </span>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
          Use this faction dossier as a quick map into linked figures and locations. Follow member and
          location nodes below to continue into full archive routes.
        </p>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <article className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#fb923c]">Linked members</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {members.length ? (
              members.map((member) => (
                <Link
                  key={member.id}
                  href={`/characters/${member.id}`}
                  className="rounded border border-[#9a3412]/70 bg-black/65 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
                >
                  {member.name}
                </Link>
              ))
            ) : (
              <p className="text-sm text-zinc-600">No linked member dossiers yet.</p>
            )}
          </div>
        </article>

        <article className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#fb923c]">Linked locations</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {relatedLocations.length ? (
              relatedLocations.map((location) => (
                <Link
                  key={location.slug}
                  href={`/locations/${location.slug}`}
                  className="rounded border border-[#9a3412]/70 bg-black/65 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
                >
                  {location.name}
                </Link>
              ))
            ) : (
              <p className="text-sm text-zinc-600">No linked location dossiers yet.</p>
            )}
          </div>
        </article>
      </section>

      <section className="mt-8 rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#fb923c]">Continue archive traversal</p>
        <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.18em]">
          <Link href="/archive" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Archive Hub</Link>
          <Link href="/factions" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Faction Index</Link>
          <Link href="/relationships" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Relationship Graph</Link>
          <Link href="/locations" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Locations</Link>
        </div>
      </section>
    </ArchivePageShell>
  );
}