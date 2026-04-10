import CharacterCard from "@/components/CharacterCard";
import { characters as legacyDossierIds } from "@/data/characters";
import { characters as sagaCharacters } from "@/types/characters";

const DOSSIER_IDS = new Set(legacyDossierIds.map((c) => c.id));

export default function CharactersPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-12 md:px-8">
      <header className="mb-12 border-b-[3px] border-[#7f1d1d]/50 pb-8 shadow-[inset_0_-12px_24px_rgba(0,0,0,0.25)]">
        <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-[0.04em] text-[#fecaca] [text-shadow:0_0_28px_rgba(248,113,113,0.25)] md:text-6xl md:tracking-[0.03em]">
          Character Archive
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500 md:text-base">
          Full roster of known figures in the Poetic Saga of the Red Noodle Clan—manuscript,
          expanded threads, and archive continuities. Dossier links unlock where intel files
          exist; others glow for signal only.
        </p>
      </header>

      <div className="character-grid grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {sagaCharacters.map((c) => (
          <CharacterCard
            key={c.id}
            id={c.id}
            name={c.name}
            title={c.role}
            image={c.image}
            href={
              DOSSIER_IDS.has(c.id) ? `/characters/${c.id}` : undefined
            }
            tags={c.tags}
            factionId={c.faction}
            threatLevel={c.threatLevel}
          />
        ))}
      </div>
    </main>
  );
}
