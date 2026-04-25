import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CharacterQuoteSection from "@/components/CharacterQuoteSection";
import { getPublicCharacterBySlug, getComicsForCharacter, publicCharacters } from "@/lib/publicLore";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return publicCharacters.map((character) => ({ id: character.slug }));
}

export default async function CharacterDetailPage({ params }: Props) {
  const { id } = await params;
  const character = getPublicCharacterBySlug(id);
  if (!character) notFound();

  const comics = getComicsForCharacter(character.slug);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#090909] via-black to-[#050505] py-10 text-[#e7e5e4] md:py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-500">
          <Link href="/" className="text-[#fdba74] transition hover:text-[#fecaca]">
            Home
          </Link>
          <span>/</span>
          <Link href="/characters" className="text-[#fdba74] transition hover:text-[#fecaca]">
            Characters
          </Link>
          <span>/</span>
          <span>{character.name}</span>
        </div>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="overflow-hidden rounded-[28px] border border-[#9a3412]/35 bg-black/65 shadow-[0_30px_80px_rgba(0,0,0,0.38)]">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={character.image}
                alt={character.name}
                fill
                className="object-cover object-top"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
              <div className="absolute left-4 top-4 rounded-full border border-[#14b8a6]/35 bg-[#042f2e]/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#99f6e4]">
                {character.tag}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <section className="rounded-[28px] border border-[#9a3412]/35 bg-[linear-gradient(180deg,rgba(15,15,15,0.96),rgba(8,8,8,0.98))] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.32)] sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#fb923c]">
                Character dossier
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl uppercase tracking-[0.04em] text-[#fecaca] md:text-5xl">
                {character.name}
              </h1>
              <p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-[#fde68a]">
                {character.title}
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">Faction</p>
                  <p className="mt-2 text-sm text-zinc-200">{character.faction}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">Role</p>
                  <p className="mt-2 text-sm text-zinc-200">{character.role}</p>
                </div>
              </div>
              <p className="mt-5 text-base leading-7 text-zinc-300">
                {character.summary}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {Object.entries(character.stats).map(([key, value]) => (
                  <div key={key} className="rounded-2xl border border-[#9a3412]/25 bg-black/35 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">{key}</p>
                    <p className="mt-2 text-lg font-semibold uppercase text-[#fb923c]">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <CharacterQuoteSection characterId={character.slug} />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <article className="rounded-[28px] border border-[#9a3412]/35 bg-black/35 p-6 sm:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#fb923c]">
              Lore dossier
            </p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-300 sm:text-base">
              {character.biography.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <aside className="rounded-[28px] border border-[#9a3412]/35 bg-[linear-gradient(180deg,rgba(18,9,9,0.96),rgba(7,7,7,0.98))] p-6 sm:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#14b8a6]">
              Linked comic strips
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl uppercase tracking-[0.04em] text-[#fecaca]">
              Read the signal files.
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Dossiers explain who a character is. Comics show them in motion. Every character page on the new site can point to its comic strip pages here.
            </p>
            <div className="mt-6 space-y-4">
              {comics.map((comic) => (
                <Link
                  key={comic.slug}
                  href={`/comics/${comic.slug}`}
                  className="block rounded-[24px] border border-white/8 bg-white/[0.03] p-4 transition hover:border-[#f97316]/60 hover:bg-white/[0.05]"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#fb923c]">
                    {comic.issue}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-[#fff1f2]">{comic.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{comic.summary}</p>
                  <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#99f6e4]">
                    {comic.ctaLabel} →
                  </p>
                </Link>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
