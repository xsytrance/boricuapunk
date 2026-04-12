"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ArchivePageShell from "@/components/ArchivePageShell";

type FigurineSighting = {
  id: string;
  imagePath: string;
  shotType: "single" | "group";
  caption?: string;
  card: {
    id: string;
    name: string;
    title: string;
  };
  match: {
    confidence: number;
    method: string;
    reason: string;
  };
  candidates: Array<{
    characterId: string;
    characterName: string;
    score: number;
  }>;
};

export default function FigurinesPage() {
  const [rows, setRows] = useState<FigurineSighting[]>([]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await fetch("/api/archive/figurines?limit=40", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as { sightings?: FigurineSighting[] };
        if (active && Array.isArray(payload.sightings)) {
          setRows(payload.sightings);
        }
      } catch {
        // no-op
      }
    }
    void load();
    const timer = window.setInterval(load, 20000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <ArchivePageShell
      eyebrow="Figurines"
      title="Shelf Intel"
      description="Drop figurine photos (single or group) and the archive will attempt character identification from manuscript descriptors."
      meta={[
        `${rows.length} ingested`,
        "Single + group shot support",
        "Low-confidence auto-review",
      ]}
    >
      <section className="mb-8 rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-5 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">Upload guidance</p>
        <ul className="mt-4 space-y-2 text-sm text-zinc-400">
          <li>• Best match accuracy: one figurine per photo, front shot + clear lighting.</li>
          <li>• Group shots are supported and intentionally routed to review more aggressively.</li>
          <li>• Add caption guesses like “likely GRATS” to improve ranking quality.</li>
        </ul>
        <Link
          href="/figurines/review"
          className="mt-4 inline-flex rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
        >
          Open figurine review queue
        </Link>
      </section>

      {rows.length === 0 ? (
        <section className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-6 text-sm text-zinc-400 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)]">
          No figurine sightings yet.
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((row) => (
            <article
              key={row.id}
              className="overflow-hidden rounded-md border-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-[#160909] via-[#0d0d0d] to-[#050505] shadow-[inset_0_0_32px_rgba(0,0,0,0.72)]"
            >
              <div className="relative aspect-[4/5] bg-black">
                <img src={row.imagePath} alt={row.card.name} className="h-full w-full object-cover object-top" />
              </div>
              <div className="space-y-2 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#5eead4]">{row.card.name}</p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#fdba74]">
                  {row.shotType} • {(row.match.confidence * 100).toFixed(0)}% • {row.match.method}
                </p>
                <p className="text-xs text-zinc-500 line-clamp-2">{row.match.reason}</p>
                {row.candidates.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {row.candidates.slice(0, 3).map((candidate) => (
                      <span
                        key={`${row.id}-${candidate.characterId}`}
                        className="rounded border border-[#9a3412]/60 bg-black/65 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-zinc-400"
                      >
                        {candidate.characterName}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      )}
    </ArchivePageShell>
  );
}