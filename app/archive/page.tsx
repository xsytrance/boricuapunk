import ArchivePageShell from "@/components/ArchivePageShell";
import { characters } from "@/types/characters";
import { factions } from "@/types/factions";
import { quotes } from "@/data/quotes";
import ArchiveRouteFinder from "@/components/ArchiveRouteFinder";

const pageLinks = [
  {
    href: "/characters",
    title: "Character Archive",
    copy: "Browse the full roster, jump into dossiers, and find the faces behind the saga.",
    category: "people",
    tags: ["roster", "profiles", "dossiers"],
  },
  {
    href: "/factions",
    title: "Faction Index",
    copy: "See who allies with whom, and where every power bloc stands.",
    category: "power",
    tags: ["alliances", "groups", "politics"],
  },
  {
    href: "/lore",
    title: "Lore & Fragments",
    copy: "Read the stitched-together myth fragments that frame the universe.",
    category: "story",
    tags: ["myth", "canon", "fragments"],
  },
  {
    href: "/locations",
    title: "Locations",
    copy: "Jump between city zones, hidden venues, and iconic story landmarks.",
    category: "world",
    tags: ["map", "districts", "landmarks"],
  },
  {
    href: "/logs",
    title: "Signal Logs",
    copy: "Archive quotes, transmissions, and the system’s latest signal bursts.",
    category: "signals",
    tags: ["quotes", "transmissions", "logs"],
  },
  {
    href: "/figurines",
    title: "Figurines",
    copy: "Ingest shelf photos (single or group) and classify figurines against canon descriptors.",
    category: "signals",
    tags: ["collectibles", "shelf intel", "group shot", "review queue"],
  },
  {
    href: "/ships",
    title: "Ships & Skycraft",
    copy: "Track the Jibaro and the other vessels that keep the saga in motion.",
    category: "arsenal",
    tags: ["jibaro", "vehicles", "transport"],
  },
  {
    href: "/weapons",
    title: "Weapons",
    copy: "Study the Cuatroblade, Spada Virina, Planet Weapons, and the rest of the armory.",
    category: "arsenal",
    tags: ["spada virina", "armory", "combat"],
  },
  {
    href: "/timeline",
    title: "Timeline",
    copy: "Trace the archive’s major narrative milestones in order.",
    category: "story",
    tags: ["chronology", "milestones", "events"],
  },
  {
    href: "/relationships",
    title: "Power Map",
    copy: "Follow the important bonds and conflicts between people, groups, and icons.",
    category: "people",
    tags: ["connections", "rivalries", "alliances", "relationship graph"],
  },
  {
    href: "/about",
    title: "About the Archive",
    copy: "A short mission brief for new visitors and future collaborators.",
    category: "world",
    tags: ["mission", "overview", "guide"],
  },
  {
    href: "/review",
    title: "Review Queue",
    copy: "Human-review queue for low-confidence or unknown image matches.",
    category: "signals",
    tags: ["quality control", "reassign", "ingest review"],
  },
];

export default function ArchiveHubPage() {
  return (
    <ArchivePageShell
      eyebrow="Archive Hub"
      title="Mission Control"
      description="A central jump-off for the Boricuapunk archive. Use this hub to move through the site like a living dossier system: characters, factions, lore, locations, logs, ships, weapons, timeline, and relationship graphs all branch from here."
      meta={[`${characters.length} known figures`, `${factions.length} factions`, `${quotes.length} recorded quotes`]}
    >
      <ArchiveRouteFinder routes={pageLinks} />

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
            by factions and locations. Then move into timeline, ships, weapons, and relationship
            views to see how the archive’s tension lines connect.
          </p>
        </div>

        <div className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#120909] to-black/80 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.7)] md:p-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
            Archive pulse
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-400">
            <li>• Fresh route structure for easier story expansion</li>
            <li>• Cross-links between characters, factions, lore, timeline, ships, and weapons</li>
            <li>• Pages built to scale as new manuscript entries appear</li>
            <li>• Works as both a site map and in-world index</li>
          </ul>
        </div>
      </section>
    </ArchivePageShell>
  );
}
