import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CharacterProfile from "@/components/CharacterProfile";
import CharacterQuoteSection from "@/components/CharacterQuoteSection";
import { getCharacterById } from "@/data/characters";
import { getQuotesForCharacter } from "@/data/quotes";
import { getFactionById } from "@/types/factions";

type Props = { params: Promise<{ id: string }> };

export default async function CharacterDetailPage({ params }: Props) {
  const { id } = await params;
  const character = getCharacterById(id);
  if (!character) notFound();

  const faction = getFactionById(character.faction);
  const quotes = getQuotesForCharacter(character.id).slice(0, 3);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-12 md:gap-12 md:px-8 lg:gap-14">
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-500">
        <Link href="/archive" className="text-[#fdba74] transition hover:text-[#fecaca]">
          Archive
        </Link>
        <span className="text-zinc-700">/</span>
        <Link href="/characters" className="text-[#fdba74] transition hover:text-[#fecaca]">
          Characters
        </Link>
        <span className="text-zinc-700">/</span>
        <span>{character.name}</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,0.95fr)] lg:items-start lg:gap-12 xl:gap-16">
        <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-md border-[3px] border-[#c2410c] bg-black shadow-[0_0_40px_rgba(234,88,12,0.35),inset_0_0_50px_rgba(0,0,0,0.5)] lg:max-w-none">
          <div className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_50px_rgba(0,0,0,0.45)]" />
          <Image
            src={character.image}
            alt={character.name}
            fill
            className="object-cover object-top"
            priority
            unoptimized
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />
        </div>

        <CharacterProfile
          name={character.name}
          title={character.title}
          description={character.description}
          faction={character.faction}
          tag={character.tag}
          stats={character.stats}
        />

        <CharacterQuoteSection characterId={character.id} />
      </div>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            Related archive nodes
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.18em]">
            <Link href="/archive" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Archive Hub</Link>
            <Link href="/characters" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Character Archive</Link>
            <Link href="/factions" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Factions</Link>
            <Link href="/locations" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Locations</Link>
            <Link href="/ships" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Ships</Link>
            <Link href="/logs" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Logs</Link>
          </div>
        </div>

        <div className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#120909] to-black/80 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.7)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            Faction context
          </p>
          {faction ? (
            <>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl uppercase tracking-[0.04em] text-[#fecaca]">
                {faction.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{faction.description}</p>
              <Link
                href="/factions"
                className="mt-4 inline-flex rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
              >
                Open faction index
              </Link>
            </>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">No faction record was found for this dossier.</p>
          )}
        </div>
      </section>

      {quotes.length ? (
        <section className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            Related signal lines
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {quotes.map((quote) => (
              <article key={quote.id} className="rounded border border-[#9a3412]/70 bg-black/65 p-4 shadow-[inset_0_0_24px_rgba(0,0,0,0.5)]">
                <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#fb923c]">{quote.style}</p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">“{quote.text}”</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {character.images.length > 0 ? (
        <section className="border-t-[3px] border-[#7f1d1d]/40 pt-8 md:pt-10">
          <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl uppercase tracking-[0.12em] text-[#fecaca] md:text-3xl [text-shadow:0_0_20px_rgba(248,113,113,0.2)]">
            Visual Intel
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {character.images.map((src, i) => (
              <div key={`${src}-${i}`} className="relative aspect-video overflow-hidden rounded-md border-[3px] border-[#9a3412]/70 bg-[#111] shadow-[inset_0_0_24px_rgba(0,0,0,0.6),0_4px_16px_rgba(0,0,0,0.5)]">
                <Image src={src} alt={`${character.name} reference ${i + 1}`} fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" unoptimized />
                <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]" />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
