import Link from "next/link";
import ArchivePageShell from "@/components/ArchivePageShell";

const shortcuts = [
  { href: "/characters", label: "Characters" },
  { href: "/factions", label: "Factions" },
  { href: "/lore", label: "Lore" },
  { href: "/locations", label: "Locations" },
  { href: "/logs", label: "Logs" },
];

export default function AboutPage() {
  return (
    <ArchivePageShell
      eyebrow="About the Archive"
      title="What This Site Is"
      description="Boricuapunk is being built as a living archive for the Red Noodle Clan universe: character dossiers, faction maps, lore fragments, location nodes, and signal logs all sharing the same visual language."
      meta={["Living archive", "Story-first structure", "Mobile-first presentation"]}
    >
      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            Mission
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            The goal is to make the universe feel browseable, not just decorative. That means
            more pages, clearer structure, stronger cross-linking, and a site that can keep growing
            without turning into a single overloaded homepage.
          </p>
        </section>

        <section className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#120909] to-black/80 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.7)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            Quick start
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {shortcuts.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-12 rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
          Next step
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
          If you want, the next wave can go deeper into chapter pages, map art, faction timelines,
          or dedicated story collections. This structure is ready for that kind of expansion.
        </p>
      </section>
    </ArchivePageShell>
  );
}
