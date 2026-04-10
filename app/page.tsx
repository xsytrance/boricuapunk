import ArchiveAccessPanel from "@/components/ArchiveAccessPanel";
import ManusHeroPortrait from "@/components/ManusHeroPortrait";
import CharacterCard from "@/components/CharacterCard";
import HomeArchiveQuoteSection from "@/components/HomeArchiveQuoteSection";
import { characters } from "@/data/characters";
import { getSagaCharacterById } from "@/types/characters";

const manus = characters.find((c) => c.id === "manus-neco")!;

export default function Home() {
  return (
    <main className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
      {/* Hero — cinematic intro: bg → character overlaps → HUD (unboxed) */}
      <section className="relative min-h-[100dvh] w-full overflow-x-hidden overflow-y-visible border-b-[3px] border-[#7f1d1d]/70">
        {/* Layer 0: Boricuapunk city — lowest; cover + center */}
        <div
          className="absolute inset-0 min-h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/ui/backgrounds/boricuapunk-city-bg.png')",
          }}
        />
        {/* Layer 1: Dark gradient overlay (black → transparent) for readability */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.5)_28%,rgba(0,0,0,0.15)_52%,rgba(0,0,0,0.35)_72%,rgba(0,0,0,0.82)_100%)]" />
        {/* Atmospheric grade + left→right flow (preserved) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#2d0a12]/75 via-[#0a0505]/50 to-[#020202]/80" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(0,0,0,0.45)_0%,transparent_35%,rgba(234,88,12,0.1)_55%,transparent_78%,rgba(127,29,29,0.12)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_65%_at_72%_28%,rgba(234,88,12,0.22),transparent_58%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_18%_78%,rgba(127,29,29,0.18),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,transparent_38%,rgba(0,0,0,0.82)_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.1] mix-blend-soft-light">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_160px_55px_rgba(0,0,0,0.78)]" />

        <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-6xl flex-col-reverse items-center justify-center gap-12 px-4 py-16 md:flex-row md:items-center md:justify-center md:gap-0 md:px-6 md:py-12 lg:px-10">
          {/* Character layer — overlaps HUD on md+ */}
          <div className="relative z-[25] flex w-full min-w-0 flex-1 justify-center md:-mr-10 md:flex-[1.08] md:justify-end lg:-mr-14">
            <div className="relative w-full max-w-sm translate-x-1 md:max-w-md md:translate-x-4 md:translate-y-2 lg:max-w-lg lg:translate-x-6">
              <div className="pointer-events-none absolute -inset-5 rounded-md border border-[#ea580c]/30 bg-[#ea580c]/[0.08] blur-md" />
              <div className="pointer-events-none absolute -inset-1 rounded-md bg-gradient-to-br from-[#ea580c]/25 via-transparent to-[#7f1d1d]/35 opacity-90 blur-sm" />
              <ManusHeroPortrait src={manus.image} alt={manus.name} />
            </div>
          </div>

          {/* HUD stack — lower z so portrait reads in front at overlap; edge-breaking accents */}
          <div className="relative z-[15] flex w-full flex-1 flex-col justify-center md:-ml-6 md:max-w-xl lg:-ml-10 lg:max-w-[32rem]">
            {/* System rail — breaks panel edge */}
            <div className="relative -mb-2 md:absolute md:-left-2 md:top-6 md:z-20 md:mb-0 lg:-left-5">
              <div className="space-y-2 border-l-2 border-[#22c55e]/70 pl-3 font-mono text-[9px] font-semibold uppercase leading-tight tracking-[0.22em] text-[#4ade80]/90 shadow-[8px_0_24px_rgba(34,197,94,0.12)] md:text-[10px] md:tracking-[0.26em]">
                <p className="[text-shadow:0_0_12px_rgba(74,222,128,0.45)]">
                  System online
                </p>
                <p className="text-[#86efac]/95 [text-shadow:0_0_10px_rgba(134,239,172,0.35)]">
                  Archive status: Active
                </p>
                <p className="text-[#fdba74]/90 [text-shadow:0_0_12px_rgba(251,191,36,0.25)]">
                  Subject: {manus.name.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="relative isolate overflow-visible pt-2 md:pt-0">
              <ArchiveAccessPanel dossierHref="/characters/manus-neco">
                {/* Decorative layers — below content, never capture clicks */}
                <div className="pointer-events-none absolute -inset-[2px] z-[0] rounded-md bg-[linear-gradient(118deg,rgba(234,88,12,0)_0%,rgba(234,88,12,0.15)_42%,rgba(251,191,36,0.08)_50%,rgba(234,88,12,0)_68%)] opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="pointer-events-none absolute -inset-1 z-[0] rounded-md shadow-[0_0_0_1px_rgba(234,88,12,0.35),0_0_40px_rgba(234,88,12,0.25),0_0_80px_rgba(185,28,28,0.2)] transition-shadow duration-300 group-hover:shadow-[0_0_0_1px_rgba(251,146,60,0.55),0_0_48px_rgba(234,88,12,0.45),0_0_96px_rgba(185,28,28,0.35)]" />

                <div className="relative isolate overflow-visible border-[3px] border-[#f97316]/90 bg-gradient-to-b from-[#231010] via-[#0a0a0a] to-[#020202] shadow-[12px_16px_0_rgba(0,0,0,0.75),0_0_56px_rgba(234,88,12,0.45),inset_0_0_80px_rgba(0,0,0,0.82),inset_0_1px_0_rgba(255,255,255,0.06)] transition-shadow duration-300 group-hover:shadow-[12px_16px_0_rgba(0,0,0,0.75),0_0_72px_rgba(234,88,12,0.55),inset_0_0_80px_rgba(0,0,0,0.82),inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <div className="pointer-events-none absolute inset-0 z-[5] overflow-visible rounded-sm opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-pulse">
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,transparent_35%,rgba(234,88,12,0.04)_70%,transparent_100%)]" />
                    <div className="absolute left-[8%] right-[8%] top-[22%] h-px bg-gradient-to-r from-transparent via-[#fed7aa]/50 to-transparent blur-[0.5px]" />
                  </div>
                <div className="relative z-[20] border border-[#7f1d1d] bg-[#050505]/95 px-5 py-7 shadow-[inset_0_0_50px_rgba(0,0,0,0.9)] md:px-8 md:py-9">
                  {/* Top bar — bleeds past inner padding with corner tick */}
                  <div className="relative mb-4 flex items-center justify-between gap-3 md:mb-5">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.42em] text-[#fb923c] [text-shadow:0_0_14px_rgba(251,146,60,0.5)]">
                      System // Archive
                    </span>
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#22c55e] shadow-[0_0_14px_#22c55e,0_0_28px_rgba(34,197,94,0.35)]" />
                    <span className="pointer-events-none absolute -right-5 top-1/2 hidden h-px w-10 -translate-y-1/2 bg-gradient-to-r from-[#ea580c] to-transparent md:block" />
                  </div>

                  {/* Layered title — larger, tighter, stacked depth */}
                  <div className="relative -mx-1">
                    <h1 className="font-[family-name:var(--font-display)] uppercase leading-[0.82] tracking-[0.01em] md:leading-[0.8]">
                      <span
                        aria-hidden
                        className="absolute left-0 top-0 block w-full select-none font-[family-name:var(--font-display)] text-5xl text-[#450a0a] opacity-90 sm:text-6xl md:text-7xl md:leading-[0.8] lg:text-8xl lg:leading-[0.78]"
                        style={{
                          transform: "translate(5px, 6px)",
                          textShadow: "2px 2px 0 rgba(0,0,0,0.85)",
                        }}
                      >
                        The Boricuapunk Archive
                      </span>
                      <span className="relative block bg-gradient-to-b from-[#fffbeb] via-[#fed7aa] to-[#fb923c] bg-clip-text text-5xl text-transparent sm:text-6xl md:text-7xl lg:text-8xl [filter:drop-shadow(0_0_36px_rgba(251,146,60,0.55))_drop-shadow(2px_4px_0_rgba(127,29,29,0.9))]">
                        The Boricuapunk Archive
                      </span>
                    </h1>
                  </div>

                  <p className="mt-3 max-w-[22rem] font-mono text-[11px] font-semibold uppercase leading-tight tracking-[0.22em] text-[#fde68a] md:mt-4 md:text-xs md:tracking-[0.26em]">
                    Enter the world of the Red Noodle Clan
                  </p>

                  {/* Subject block — offset downward, breaks visual box */}
                  <div className="relative mt-7 border-l-4 border-[#ea580c] bg-gradient-to-r from-[#1a0a0a]/95 to-transparent py-4 pl-4 pr-3 shadow-[8px_10px_0_rgba(0,0,0,0.65),inset_0_0_35px_rgba(0,0,0,0.75)] md:mt-9 md:-mr-4 md:translate-x-2 md:pl-5">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">
                      Active Subject
                    </p>
                    <p className="mt-1.5 font-[family-name:var(--font-display)] text-3xl uppercase leading-[0.95] tracking-[0.05em] text-[#fecaca] [text-shadow:0_0_24px_rgba(248,113,113,0.4),3px_3px_0_rgba(0,0,0,0.85)] md:text-4xl">
                      {manus.name}
                    </p>
                    <p className="mt-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#fb923c] [text-shadow:0_0_12px_rgba(251,146,60,0.35)] md:text-sm">
                      {manus.title}
                    </p>
                  </div>

                  {/* Edge brackets — extend past panel */}
                  <span className="pointer-events-none absolute -bottom-3 -left-3 h-8 w-8 border-b-2 border-l-2 border-[#ea580c]/80 shadow-[-4px_4px_12px_rgba(234,88,12,0.25)]" />
                  <span className="pointer-events-none absolute -right-3 -top-3 h-8 w-8 border-r-2 border-t-2 border-[#ea580c]/80 shadow-[4px_-4px_12px_rgba(234,88,12,0.25)]" />
                </div>
                </div>
              </ArchiveAccessPanel>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8">
        <div className="mb-10 border-l-[4px] border-[#ea580c] pl-5 shadow-[inset_8px_0_24px_rgba(234,88,12,0.08)]">
          <h2 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-[0.04em] text-[#fecaca] [text-shadow:0_0_24px_rgba(248,113,113,0.2)] md:text-5xl">
            Featured Characters
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-500">
            Select a dossier. Every silhouette hides a saga beat.
          </p>
        </div>
        <div className="character-grid grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {characters.map((c) => {
            const saga = getSagaCharacterById(c.id);
            return (
              <CharacterCard
                key={c.id}
                id={c.id}
                name={c.name}
                title={c.title}
                image={c.image}
                href={`/characters/${c.id}`}
                tags={saga?.tags}
                factionId={saga?.faction}
                threatLevel={saga?.threatLevel}
              />
            );
          })}
        </div>
      </section>

      <HomeArchiveQuoteSection />
    </main>
  );
}
