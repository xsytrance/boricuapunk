"use client";

import { useEffect, useMemo, useState } from "react";
import ArchivePageShell from "@/components/ArchivePageShell";
import { characters } from "@/types/characters";

type Sighting = {
  id: string;
  createdAt: string;
  imagePath: string;
  caption?: string;
  card: {
    id: string;
    name: string;
    title: string;
  };
  match: {
    confidence: number;
    reason: string;
    method: string;
  };
};

const REVIEW_THRESHOLD = 0.6;

export default function ReviewQueuePage() {
  const [rows, setRows] = useState<Sighting[]>([]);
  const [selectedById, setSelectedById] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const options = useMemo(
    () => [
      { id: "unknown", name: "Unknown Signal" },
      ...characters.map((character) => ({ id: character.id, name: character.name })),
    ],
    [],
  );

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await fetch(
          `/api/archive/sightings?needsReview=1&threshold=${REVIEW_THRESHOLD}&limit=80`,
          { cache: "no-store" },
        );
        if (!response.ok) return;
        const payload = (await response.json()) as { sightings?: Sighting[] };
        if (!active || !Array.isArray(payload.sightings)) return;
        setRows(payload.sightings);
        setSelectedById((prev) => {
          const next = { ...prev };
          for (const row of payload.sightings ?? []) {
            next[row.id] = next[row.id] ?? row.card.id;
          }
          return next;
        });
      } catch {
        // keep page usable
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  async function assign(row: Sighting) {
    const targetCharacterId = selectedById[row.id] ?? row.card.id;
    setSavingId(row.id);
    setStatus("");
    try {
      const response = await fetch("/api/archive/sightings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sightingId: row.id, characterId: targetCharacterId }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        setStatus(payload.error || "Failed to save review assignment.");
        return;
      }

      setRows((prev) => prev.filter((item) => item.id !== row.id));
      setStatus(`Saved: ${row.card.name} review updated.`);
    } catch {
      setStatus("Network error while saving review assignment.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <ArchivePageShell
      eyebrow="Review Queue"
      title="Needs Review"
      description="Low-confidence or unknown ingest matches land here so you can reassign them in one click."
      meta={[`Threshold ${(REVIEW_THRESHOLD * 100).toFixed(0)}%`, `${rows.length} pending`]}
    >
      {status ? (
        <p className="mb-4 rounded border border-[#9a3412]/70 bg-black/60 px-3 py-2 text-xs text-[#fde68a]">
          {status}
        </p>
      ) : null}

      {rows.length === 0 ? (
        <section className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-6 text-sm text-zinc-400 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)]">
          No sightings currently need review.
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
              <div className="space-y-3 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#5eead4]">{row.card.name}</p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#fdba74]">
                  Match {(row.match.confidence * 100).toFixed(0)}% • {row.match.method}
                </p>
                <p className="text-xs leading-relaxed text-zinc-500">{row.match.reason}</p>
                {row.caption ? <p className="text-xs text-zinc-600">Caption: {row.caption}</p> : null}

                <div className="flex flex-col gap-2">
                  <select
                    value={selectedById[row.id] ?? row.card.id}
                    onChange={(event) =>
                      setSelectedById((prev) => ({
                        ...prev,
                        [row.id]: event.target.value,
                      }))
                    }
                    className="w-full rounded border border-[#9a3412]/70 bg-black/70 px-2.5 py-2 text-xs text-[#fde68a] focus:border-[#f97316] focus:outline-none"
                  >
                    {options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    disabled={savingId === row.id}
                    onClick={() => void assign(row)}
                    className="rounded border border-[#f97316]/70 bg-black/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#ffedd5] transition hover:border-[#fb923c] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {savingId === row.id ? "Saving..." : "Assign"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </ArchivePageShell>
  );
}