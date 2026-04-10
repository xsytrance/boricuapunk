import Link from "next/link";
import ArchivePageShell from "@/components/ArchivePageShell";
import { characters } from "@/types/characters";
import { factions } from "@/types/factions";
import { quotes } from "@/data/quotes";

const pageLinks = [
  { href: "/characters", title: "Character Archive", copy: "Browse the full roster, jump into dossiers, and find the faces behind the saga." },
  { href: "/factions", title: "Faction Index", copy: "See who allies with whom, and where every power bloc stands." },
  { href: "/lore", title: "Lore & Fragments", copy: "Read the stitched-together myth fragments that frame the universe." },
  { href: "/locations", title: "Locations", copy: "Jump between city zones, hidden venues, and iconic story landmarks." },
  { href: "/logs", title: "Signal Logs", copy: "Archive quotes, transmissions, and the system’s latest signal bursts." },
  { href: "/timeline", title: "Timeline", copy: "Trace the archive’s major narrative milestones in order." },
  { href: "/relationships", title: "Relationship Graph", copy: "Follow the important bonds and conflicts between people, groups, and icons." },
  { href: "/about", title: "About the Archive", copy: "A short mission brief for new visitors and future collaborators." },
];

export default function ArchiveHubPage() {
  return (
    <ArchivePageShell
      eyebrow="Archive Hub"
      title="Mission Control"
      description="A central jump-off for the Boricuapunk archive. Use this hub to move through the site like a living dossier system: characters, factions, lore, locations, logs, timeline, and relationship graphs all branch from here."
      meta={[`${characters.length} known figures`, `${factions.length} factions`, `${quotes.length} recorded quotes`]}
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pageLinks.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="group rounded-md border-[3px] border-[#7f1d1d]/80 bg-gradient-to-b from-[#1a0a0a] via-[#0d0d0d] to-[#050505] p-5 shadow-[inset_0_0_32px_rgba(0,0,0,0.7),0_0_24px_rgba(234,88,12,0.12)] transition duration-300 hover:border-[#f97316] hover:shadow-[inset_0_0_40px_rgba(0,0,0,0.76),0_0_32px_rgba(234,88,12,0.2)]"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-[#fb923c]">
              /{page.href.replace(/^\//, "")}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl uppercase tracking-[0.04em] text-[#fecaca] transition group-hover:text-[#ffedd5]">
              {page.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">{page.copy}</p>
          </Link>
        ))}
      </section>

      <section className="mt-12 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            Suggested path
          </p>
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-3xl uppercase tracking-[0.04em] text-[#fecaca]">
            Start with the people, then the places.
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
            If you’re new to the site, the strongest first pass is the character archive, followed
            by factions and locations. Then move into timeline and relationship views to see how
            the archive’s tension lines connect.
          </p>
        </div>

        <div className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#120909] to-black/80 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.7)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            Archive pulse
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-400">
            <li>• Fresh route structure for easier story expansion</li>
            <li>• Cross-links between characters, factions, lore, and timeline</li>
            <li>• Pages built to scale as new manuscript entries appear</li>
            <li>• Works as both a site map and in-world index</li>
          </ul>
        </div>
      </section>
    </ArchivePageShell>
  );
}
