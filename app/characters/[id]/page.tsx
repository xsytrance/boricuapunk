import Image from "next/image";
import { notFound } from "next/navigation";
import CharacterProfile from "@/components/CharacterProfile";
import CharacterQuoteSection from "@/components/CharacterQuoteSection";
import { getCharacterById } from "@/data/characters";

type Props = { params: Promise<{ id: string }> };

export default async function CharacterDetailPage({ params }: Props) {
  const { id } = await params;
  const character = getCharacterById(id);
  if (!character) notFound();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-14 px-4 py-12 md:gap-16 md:px-8 lg:gap-20">
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

      {character.images.length > 0 ? (
        <section className="border-t-[3px] border-[#7f1d1d]/40 pt-12">
          <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl uppercase tracking-[0.12em] text-[#fecaca] md:text-3xl [text-shadow:0_0_20px_rgba(248,113,113,0.2)]">
            Visual Intel
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {character.images.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative aspect-video overflow-hidden rounded-md border-[3px] border-[#9a3412]/70 bg-[#111] shadow-[inset_0_0_24px_rgba(0,0,0,0.6),0_4px_16px_rgba(0,0,0,0.5)]"
              >
                <Image
                  src={src}
                  alt={`${character.name} reference ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 50vw, 25vw"
                  unoptimized
                />
                <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]" />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
