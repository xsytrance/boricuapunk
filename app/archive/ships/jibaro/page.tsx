import Link from "next/link";
import ArchivePageShell from "@/components/ArchivePageShell";

const highlights = [
  "Manus’s primary vessel and the saga’s cosmic ark",
  "Repairs, pursuit, and rest are all part of its story",
  "Its parts propagate into later vehicles like Asopao",
  "The ship appears across travel, return, rescue, and escape beats",
];

const scenes = [
  {
    title: "Departure",
    note: "The Jibaro frames Manus as a figure who moves with a home, not just a weapon.",
  },
  {
    title: "Pursuit",
    note: "The Bloom and the Neverminds turn the ship into a target and a symbol of resistance.",
  },
  {
    title: "Repair",
    note: "The Jibaro’s parts live on in later craft, making maintenance part of the myth.",
  },
  {
    title: "Return",
    note: "The vessel is a way back to Flower City, to the clan, and to the archive’s emotional center.",
  },
];

export default function JibaroDetailPage() {
  return (
    <ArchivePageShell
      eyebrow="Ship Detail"
      title="Jibaro"
      description="The Jibaro is the saga’s core skycraft: a 34.52-meter cosmic vessel, a home in motion, and one of the strongest recurring images in the novel. It is both transport and myth, and the archive treats it like a major character.
      "
      meta={["Cosmic ark", "Manus Neco’s vessel", "Ship lineage"]}
    >
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            Why it matters
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            The novel treats the Jibaro as an ark, a return path, and a source of continuity.
            When it appears, the story is usually shifting from one phase to another.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {highlights.map((item) => (
              <span
                key={item}
                className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#fde68a]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#160909] to-[#050505] p-5 shadow-[inset_0_0_32px_rgba(0,0,0,0.72)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            Archive links
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/ships" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Ships</Link>
            <Link href="/relationships" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Relationships</Link>
            <Link href="/timeline" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Timeline</Link>
            <Link href="/characters/manus-neco" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Manus</Link>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {scenes.map((scene) => (
          <article key={scene.title} className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#170909] to-[#050505] p-5 shadow-[inset_0_0_30px_rgba(0,0,0,0.7)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-[#fb923c]">{scene.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{scene.note}</p>
          </article>
        ))}
      </section>

      <section className="mt-12 rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
          Possible next enhancement
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
          If you want to go deeper later, this page can become a full vessel dossier with repair
          history, crew roll, flight beats, and art or diagram assets.
        </p>
      </section>
    </ArchivePageShell>
  );
}
