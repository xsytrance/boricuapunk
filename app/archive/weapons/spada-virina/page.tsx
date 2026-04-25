import Link from "next/link";
import ArchivePageShell from "@/components/ArchivePageShell";

const beats = [
  {
    title: "The reward",
    note: "Spada Virina enters the saga as something earned, prized, and dangerously loaded.",
  },
  {
    title: "The hollow blade",
    note: "The weapon’s state changes, turning it into a symbolic shell as the story continues.",
  },
  {
    title: "The strike",
    note: "It becomes the blade that Manus uses in a defining act of violence and rupture.",
  },
  {
    title: "The echo",
    note: "It lingers in the archive as a weapon-legend rather than a simple tool.",
  },
];

export default function SpadaVirinaPage() {
  return (
    <ArchivePageShell
      eyebrow="Weapon Detail"
      title="Spada Virina"
      description="A cursed purple-black blade with major narrative weight. The novel treats Spada Virina as both reward and burden, and the archive should present it as a named myth-object rather than just a piece of gear."
      meta={["Weapon myth", "Blade lineage", "Manus-linked artifact"]}
    >
      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            Why it matters
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Spada Virina is one of the clearest examples of a weapon that changes the emotional
            temperature of the story. It is a trophy, a curse, and a turning point.
          </p>
        </div>

        <div className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#160909] to-[#050505] p-5 shadow-[inset_0_0_32px_rgba(0,0,0,0.72)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            Related routes
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/weapons" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Weapons</Link>
            <Link href="/relationships" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Relationships</Link>
            <Link href="/characters/manus-neco" className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]">Manus</Link>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {beats.map((beat) => (
          <article key={beat.title} className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#170909] to-[#050505] p-5 shadow-[inset_0_0_30px_rgba(0,0,0,0.7)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-[#fb923c]">{beat.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{beat.note}</p>
          </article>
        ))}
      </section>

      <section className="mt-12 rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
          Possible next enhancement
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
          The weapons archive can later split into subpages for Planet Weapons, cursed blades,
          and hidden-instrument weapons. This page is a strong starting point for that structure.
        </p>
      </section>
    </ArchivePageShell>
  );
}
