"use client";

import { useMemo, useState } from "react";
import CharacterCard from "@/components/CharacterCard";
import { characters as legacyDossierIds } from "@/data/characters";
import { characters as sagaCharacters } from "@/types/characters";

const DOSSIER_IDS = new Set(legacyDossierIds.map((c) => c.id));
const ALL_FACTION = "all";
const MANUSCRIPT_PRIORITY = [
  "hackermouth",
  "manus-neco",
  "the-jibaro",
  "spada-virina",
  "gratitude-frogs-grats",
  "yulania-friz",
  "saint-flamingo",
  "bloodless-visitor",
  "sifu-bamboo",
  "perfect-abuelo",
  "the-exhumerator",
] as const;

const PRIORITY_INDEX = new Map<string, number>(
  MANUSCRIPT_PRIORITY.map((id, index) => [id, index]),
);

function formatFactionLabel(faction: string) {
  if (faction === ALL_FACTION) return "All";
  return faction
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function CharactersPage() {
  const [query, setQuery] = useState("");
  const [faction, setFaction] = useState(ALL_FACTION);

  const factions = useMemo(
    () => [
      ALL_FACTION,
      ...Array.from(
        new Set(
          sagaCharacters
            .map((c) => c.faction)
            .filter((f): f is string => Boolean(f)),
        ),
      ).sort(),
    ],
    [],
  );

  const filteredCharacters = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sagaCharacters
      .filter((character) => {
      const matchesFaction = faction === ALL_FACTION || character.faction === faction;
      const haystack = [
        character.name,
        character.role,
        character.description,
        character.tags.join(" "),
        character.faction ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return matchesFaction && (normalizedQuery.length === 0 || haystack.includes(normalizedQuery));
    })
      .sort((a, b) => {
        const aScore = PRIORITY_INDEX.get(a.id) ?? Number.MAX_SAFE_INTEGER;
        const bScore = PRIORITY_INDEX.get(b.id) ?? Number.MAX_SAFE_INTEGER;
        if (aScore !== bScore) return aScore - bScore;
        return a.name.localeCompare(b.name);
      });
  }, [faction, query]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-12 md:px-8">
      <header className="mb-10 border-b-[3px] border-[#7f1d1d]/50 pb-8 shadow-[inset_0_-12px_24px_rgba(0,0,0,0.25)] md:mb-12">
        <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-[0.04em] text-[#fecaca] [text-shadow:0_0_28px_rgba(248,113,113,0.25)] md:text-6xl md:tracking-[0.03em]">
          Character Archive
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500 md:text-base">
          Full roster of known figures in the Poetic Saga of the Red Noodle Clan—manuscript,
          expanded threads, and archive continuities. Dossier links unlock where intel files
          exist; others glow for signal only.
        </p>
      </header>

      <section className="mb-10 rounded-md border border-[#7f1d1d]/50 bg-black/35 p-4 shadow-[inset_0_0_30px_rgba(0,0,0,0.35)] md:mb-12 md:p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <label className="block">
            <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#fdba74]">
              Search the archive
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, role, faction, tag..."
              className="w-full rounded border border-[#7f1d1d]/70 bg-[#090909] px-3 py-3 font-mono text-sm text-[#fee2e2] outline-none transition placeholder:text-zinc-600 focus:border-[#fb923c] focus:ring-2 focus:ring-[#ea580c]/40"
            />
          </label>
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
            <span>{filteredCharacters.length} / {sagaCharacters.length} dossiers</span>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFaction(ALL_FACTION);
              }}
              className="rounded border border-[#7f1d1d]/70 px-3 py-2 text-[#fdba74] transition hover:border-[#fb923c] hover:text-[#fee2e2]"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {factions.map((value) => {
            const active = faction === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFaction(value)}
                className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] transition md:text-xs ${
                  active
                    ? "border-[#fb923c] bg-[#fb923c]/15 text-[#fee2e2] shadow-[0_0_18px_rgba(234,88,12,0.22)]"
                    : "border-[#7f1d1d]/70 bg-black/50 text-zinc-500 hover:border-[#fb923c]/70 hover:text-[#fdba74]"
                }`}
              >
                {formatFactionLabel(value)}
              </button>
            );
          })}
        </div>
      </section>

      <div className="character-grid grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {filteredCharacters.map((c) => (
          <CharacterCard
            key={c.id}
            id={c.id}
            name={c.name}
            title={c.role}
            image={c.image}
            href={DOSSIER_IDS.has(c.id) ? `/characters/${c.id}` : undefined}
            tags={c.tags}
            factionId={c.faction}
            threatLevel={c.threatLevel}
          />
        ))}
      </div>

      {filteredCharacters.length === 0 ? (
        <div className="mt-12 rounded-md border border-[#7f1d1d]/50 bg-black/40 px-5 py-8 text-center text-sm text-zinc-500">
          No dossiers match this combination. Clear the filters or try a broader search.
        </div>
      ) : null}
    </main>
  );
}
