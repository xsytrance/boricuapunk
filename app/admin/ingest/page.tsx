"use client";

import { useEffect, useMemo, useState } from "react";
import ArchivePageShell from "@/components/ArchivePageShell";
import { characters } from "@/types/characters";
import { locations } from "@/types/locations";

type Row = {
  id: string;
  createdAt: string;
  imagePath: string;
  caption?: string;
  card: { id: string; name: string; title: string };
  match: {
    entityType: "character" | "location" | "unknown";
    entityId: string;
    confidence: number;
    reason: string;
    method: string;
    clues?: string[];
  };
  classification: {
    artStyle: string;
    shotKind: string;
    isMain: boolean;
  };
};

type EditState = {
  entityType: "character" | "location" | "unknown";
  entityId: string;
  artStyle: string;
  shotKind: string;
  isMain: boolean;
};

const STYLE_OPTIONS = [
  "unknown",
  "realistic-photo",
  "action-figure",
  "plushie",
  "comic-book",
  "surreal-illustration",
  "anime-illustration",
  "3d-render",
  "location-photography",
  "mixed-media",
];

const SHOT_OPTIONS = ["unknown", "single-character", "group-shot", "location-only", "object-focus"];

export default function IngestAdminPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [styleFilter, setStyleFilter] = useState("any");
  const [entityFilter, setEntityFilter] = useState("any");
  const [edits, setEdits] = useState<Record<string, EditState>>({});
  const [rationale, setRationale] = useState("");

  const entityOptions = useMemo(
    () => ({
      character: characters.map((c) => ({ id: c.id, name: c.name })),
      location: locations.map((l) => ({ id: l.slug, name: l.name })),
    }),
    [],
  );

  async function load() {
    const params = new URLSearchParams({ limit: "180", includeRemoved: "1" });
    if (search.trim()) params.set("search", search.trim());
    if (styleFilter !== "any") params.set("style", styleFilter);
    if (entityFilter !== "any") params.set("entityType", entityFilter);
    const response = await fetch(`/api/archive/sightings?${params.toString()}`, { cache: "no-store" });
    if (!response.ok) return;
    const payload = (await response.json()) as { sightings?: Row[] };
    const list = Array.isArray(payload.sightings) ? payload.sightings : [];
    setRows(list);
    setEdits((prev) => {
      const next = { ...prev };
      for (const row of list) {
        next[row.id] = next[row.id] ?? {
          entityType: row.match.entityType,
          entityId: row.match.entityId,
          artStyle: row.classification.artStyle || "unknown",
          shotKind: row.classification.shotKind || "unknown",
          isMain: !!row.classification.isMain,
        };
      }
      return next;
    });
  }

  async function loadRationale() {
    const response = await fetch("/api/archive/rationale-log?limit=160", { cache: "no-store" });
    if (!response.ok) return;
    const payload = (await response.json()) as { text?: string };
    setRationale(payload.text || "");
  }

  useEffect(() => {
    void load();
    void loadRationale();
  }, []);

  async function saveRow(row: Row) {
    const edit = edits[row.id];
    if (!edit) return;
    setSavingId(row.id);
    setStatus("");
    try {
      const response = await fetch("/api/archive/sightings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sightingId: row.id,
          entityType: edit.entityType,
          entityId: edit.entityType === "unknown" ? "unknown" : edit.entityId,
          artStyle: edit.artStyle,
          shotKind: edit.shotKind,
          isMain: edit.isMain,
        }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        setStatus(payload.error || "Failed to save.");
        return;
      }
      setStatus(`Saved ${row.id}`);
      await load();
      await loadRationale();
    } catch {
      setStatus("Network error while saving.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <ArchivePageShell
      eyebrow="Admin"
      title="Ingest Control"
      description="Review all photo assignments, adjust character/location links, and normalize art-style consistency for the main feed."
      meta={[`${rows.length} rows`, "search/filter/toggle", "live rationale log"]}
    >
      <section className="mb-6 grid gap-3 rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-4 md:grid-cols-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search caption/name/reason"
          className="rounded border border-[#9a3412]/70 bg-black/70 px-3 py-2 text-xs text-zinc-200"
        />
        <select
          value={styleFilter}
          onChange={(e) => setStyleFilter(e.target.value)}
          className="rounded border border-[#9a3412]/70 bg-black/70 px-3 py-2 text-xs text-zinc-200"
        >
          <option value="any">All styles</option>
          {STYLE_OPTIONS.map((style) => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="rounded border border-[#9a3412]/70 bg-black/70 px-3 py-2 text-xs text-zinc-200"
        >
          <option value="any">All entity types</option>
          <option value="character">Character</option>
          <option value="location">Location</option>
          <option value="unknown">Unknown</option>
        </select>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded border border-[#f97316]/70 bg-black/70 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#ffedd5]"
        >
          Apply filters
        </button>
      </section>

      {status ? <p className="mb-4 text-xs text-[#fde68a]">{status}</p> : null}

      <section className="grid gap-4 lg:grid-cols-2">
        {rows.map((row) => {
          const edit = edits[row.id];
          const options = edit?.entityType === "location" ? entityOptions.location : entityOptions.character;
          return (
            <article key={row.id} className="rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-3">
              <div className="flex gap-3">
                <img src={row.imagePath} alt={row.card.name} className="h-28 w-24 rounded object-cover" />
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5eead4]">{row.card.name}</p>
                  <p className="text-[11px] text-zinc-400">{row.match.reason}</p>
                  <p className="text-[10px] text-zinc-500">
                    {row.classification.artStyle} • {row.classification.shotKind} • {(row.match.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <select
                  value={edit?.entityType || "unknown"}
                  onChange={(e) =>
                    setEdits((prev) => ({
                      ...prev,
                      [row.id]: {
                        ...(prev[row.id] || {
                          entityType: "unknown",
                          entityId: "unknown",
                          artStyle: "unknown",
                          shotKind: "unknown",
                          isMain: false,
                        }),
                        entityType: e.target.value as EditState["entityType"],
                        entityId: e.target.value === "location" ? locations[0]?.slug || "unknown" : characters[0]?.id || "unknown",
                      },
                    }))
                  }
                  className="rounded border border-[#9a3412]/70 bg-black/70 px-2 py-1.5 text-xs text-zinc-200"
                >
                  <option value="character">character</option>
                  <option value="location">location</option>
                  <option value="unknown">unknown</option>
                </select>

                <select
                  value={edit?.entityId || "unknown"}
                  onChange={(e) =>
                    setEdits((prev) => ({ ...prev, [row.id]: { ...(prev[row.id] as EditState), entityId: e.target.value } }))
                  }
                  disabled={edit?.entityType === "unknown"}
                  className="rounded border border-[#9a3412]/70 bg-black/70 px-2 py-1.5 text-xs text-zinc-200"
                >
                  {options.map((option) => (
                    <option key={`${row.id}-${option.id}`} value={option.id}>{option.name}</option>
                  ))}
                </select>

                <select
                  value={edit?.artStyle || "unknown"}
                  onChange={(e) =>
                    setEdits((prev) => ({ ...prev, [row.id]: { ...(prev[row.id] as EditState), artStyle: e.target.value } }))
                  }
                  className="rounded border border-[#9a3412]/70 bg-black/70 px-2 py-1.5 text-xs text-zinc-200"
                >
                  {STYLE_OPTIONS.map((style) => (
                    <option key={`${row.id}-style-${style}`} value={style}>{style}</option>
                  ))}
                </select>

                <select
                  value={edit?.shotKind || "unknown"}
                  onChange={(e) =>
                    setEdits((prev) => ({ ...prev, [row.id]: { ...(prev[row.id] as EditState), shotKind: e.target.value } }))
                  }
                  className="rounded border border-[#9a3412]/70 bg-black/70 px-2 py-1.5 text-xs text-zinc-200"
                >
                  {SHOT_OPTIONS.map((shot) => (
                    <option key={`${row.id}-shot-${shot}`} value={shot}>{shot}</option>
                  ))}
                </select>
              </div>
              <label className="mt-2 flex items-center gap-2 text-xs text-zinc-300">
                <input
                  type="checkbox"
                  checked={!!edit?.isMain}
                  onChange={(e) =>
                    setEdits((prev) => ({ ...prev, [row.id]: { ...(prev[row.id] as EditState), isMain: e.target.checked } }))
                  }
                />
                Main feed candidate
              </label>
              <button
                type="button"
                onClick={() => void saveRow(row)}
                disabled={savingId === row.id}
                className="mt-2 rounded border border-[#f97316]/70 bg-black/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#ffedd5] disabled:opacity-60"
              >
                {savingId === row.id ? "Saving..." : "Save"}
              </button>
            </article>
          );
        })}
      </section>

      <section className="mt-8 rounded-md border-[3px] border-[#7f1d1d]/70 bg-black/60 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#fb923c]">Running match rationale log</p>
        <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap text-[11px] leading-relaxed text-zinc-400">
          {rationale || "(No rationale entries yet)"}
        </pre>
      </section>
    </ArchivePageShell>
  );
}
