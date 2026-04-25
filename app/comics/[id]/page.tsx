import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicComicBySlug, publicComics } from "@/lib/publicLore";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return publicComics.map((comic) => ({ id: comic.slug }));
}

export default async function ComicDetailPage({ params }: Props) {
  const { id } = await params;
  const comic = getPublicComicBySlug(id);
  if (!comic) notFound();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#090909] via-black to-[#050505] py-10 text-[#e7e5e4] md:py-14">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-500">
          <Link href="/" className="text-[#fdba74] transition hover:text-[#fecaca]">
            Home
          </Link>
          <span>/</span>
          <Link href="/comics" className="text-[#fdba74] transition hover:text-[#fecaca]">
            Comics
          </Link>
          <span>/</span>
          <span>{comic.title}</span>
        </div>

        <header className="rounded-[28px] border border-[#9a3412]/35 bg-[linear-gradient(135deg,rgba(24,24,27,0.96),rgba(10,10,10,0.92)),radial-gradient(circle_at_top,rgba(20,184,166,0.10),transparent_38%)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.38)] sm:p-8 lg:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#fb923c]">
            {comic.issue}
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl uppercase tracking-[0.05em] text-[#ccfbf1] md:text-5xl">
            {comic.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            {comic.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/characters/${comic.characterSlug}`}
              className="inline-flex items-center justify-center rounded-full border border-[#14b8a6]/40 bg-[#042f2e]/65 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#99f6e4] transition hover:border-[#5eead4] hover:text-[#ecfeff]"
            >
              Open character dossier
            </Link>
            <Link
              href="/comics"
              className="inline-flex items-center justify-center rounded-full border border-[#9a3412]/70 bg-black/55 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#fff7ed]"
            >
              Back to comics
            </Link>
          </div>
        </header>

        <section className="rounded-[28px] border border-[#9a3412]/35 bg-black/35 p-6 sm:p-8">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] border border-white/8 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <Image
              src={comic.image}
              alt={comic.title}
              fill
              className="object-cover object-top"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="rounded-2xl border border-[#14b8a6]/30 bg-black/65 p-4 backdrop-blur-sm">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#99f6e4]">
                  Signal plate
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-200">
                  This issue is linked to {comic.characterName}. As you build more strips, this page can grow into a full comic reader with multiple panels, captions, and sequence navigation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="rounded-[28px] border border-[#9a3412]/35 bg-[linear-gradient(180deg,rgba(15,15,15,0.96),rgba(8,8,8,0.98))] p-6 sm:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#fb923c]">
              About this issue
            </p>
            <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-300 sm:text-base">
              <p>
                This comic page now lives on the new public site, separate from the character dossier pages. That keeps the world cleaner: dossiers explain who someone is, while comics show the scene, the motion, and the mood around them.
              </p>
              <p>
                For now, this issue serves as the first public signal file for the Exiled Lemon Monk. It can later expand into a multi-panel strip, a gallery sequence, or a full chapter page.
              </p>
            </div>
          </article>

          <aside className="rounded-[28px] border border-[#9a3412]/35 bg-black/35 p-6 sm:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#14b8a6]">
              Builder note
            </p>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              If you send a new strip image and a title, Koden can turn this page into a more detailed comic issue while keeping the character dossier linked beside it.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
