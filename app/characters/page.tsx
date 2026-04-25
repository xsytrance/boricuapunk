import Link from "next/link";
import Image from "next/image";
import { publicCharacters, getComicsForCharacter } from "@/lib/publicLore";

export default function CharactersPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#090909] via-black to-[#050505] py-10 text-[#e7e5e4] md:py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <section className="rounded-[28px] border border-[#9a3412]/35 bg-[linear-gradient(135deg,rgba(24,24,27,0.96),rgba(10,10,10,0.92)),radial-gradient(circle_at_top,rgba(234,88,12,0.12),transparent_42%)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.38)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4 lg:max-w-4xl">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.34em] text-[#fb923c]">
              Character dossiers // new public site
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-[0.05em] text-[#fecaca] md:text-5xl">
              Meet the people behind the signal.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
              This is the new public character section for Boricuapunk. Each dossier is separate from the comics section, but every dossier can point you to the comic strips where that character appears.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/comics"
                className="inline-flex items-center justify-center rounded-full border border-[#14b8a6]/40 bg-[#042f2e]/65 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#99f6e4] transition hover:border-[#5eead4] hover:text-[#ecfeff]"
              >
                Open comics section
              </Link>
              <a
                href="https://t.me/kodenbushi_bot"
                className="inline-flex items-center justify-center rounded-full border border-[#9a3412]/70 bg-black/55 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#fff7ed]"
              >
                Ask Koden to add another character
              </a>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {publicCharacters.map((character) => {
            const comics = getComicsForCharacter(character.slug);
            return (
              <Link
                key={character.slug}
                href={`/characters/${character.slug}`}
                className="group block"
              >
                <article className="overflow-hidden rounded-[28px] border border-[#9a3412]/35 bg-[linear-gradient(180deg,rgba(15,15,15,0.94),rgba(7,7,7,0.98))] shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition hover:border-[#f97316]/75 hover:shadow-[0_0_32px_rgba(234,88,12,0.16)]">
                  <div className="relative aspect-[4/5] overflow-hidden bg-black">
                    <Image
                      src={character.image}
                      alt={character.name}
                      fill
                      className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full border border-[#14b8a6]/35 bg-[#042f2e]/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#99f6e4]">
                      {character.tag}
                    </div>
                  </div>
                  <div className="space-y-4 p-5">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#fb923c]">
                        {character.faction}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-[#fff1f2]">
                        {character.name}
                      </h2>
                      <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[#fde68a]">
                        {character.role}
                      </p>
                    </div>
                    <p className="text-sm leading-6 text-zinc-400">
                      {character.summary}
                    </p>
                    <div className="flex items-center justify-between gap-3 border-t border-white/8 pt-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                        {comics.length} linked comic{comics.length === 1 ? "" : "s"}
                      </span>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#fb923c]">
                        Open dossier →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
