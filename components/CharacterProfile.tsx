import type { CharacterStats } from "@/data/characters";

type CharacterProfileProps = {
  name: string;
  title: string;
  description: string;
  faction: string;
  tag?: string;
  stats?: CharacterStats;
};

export default function CharacterProfile({
  name,
  title,
  description,
  faction,
  tag,
  stats,
}: CharacterProfileProps) {
  return (
    <div className="flex flex-col gap-5 border-[3px] border-[#b91c1c]/80 bg-gradient-to-b from-[#1a0a0a] via-[#0f0f0f] to-[#050505] p-7 shadow-[inset_0_0_50px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.04),0_0_28px_rgba(185,28,28,0.15)]">
      <div className="border-b border-[#7f1d1d]/50 pb-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.45em] text-[#fb923c]">
          Dossier
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl uppercase leading-none tracking-[0.06em] text-[#fecaca] [text-shadow:0_0_28px_rgba(248,113,113,0.35),0_2px_0_rgba(0,0,0,0.8)] md:text-4xl md:tracking-[0.04em]">
          {name}
        </h1>
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-[#fde68a] md:text-sm md:tracking-[0.25em]">
          {title}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-y border-[#451a1a]/90 py-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
            Faction
          </p>
          <p className="mt-0.5 font-semibold tracking-wide text-[#fca5a5]">{faction}</p>
        </div>
        {tag ? (
          <span className="ml-auto rounded-sm border-[2px] border-[#ea580c]/70 bg-[#431407]/60 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#ffedd5] shadow-[0_0_12px_rgba(234,88,12,0.25)]">
            {tag}
          </span>
        ) : null}
      </div>

      <p className="text-sm leading-relaxed text-zinc-400">{description}</p>

      {stats && Object.keys(stats).length > 0 ? (
        <dl className="grid grid-cols-2 gap-3 border-t border-[#451a1a]/70 pt-5 font-mono text-xs shadow-[inset_0_8px_16px_rgba(0,0,0,0.25)]">
          {Object.entries(stats).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2 border-b border-[#292524]/80 pb-2">
              <dt className="uppercase tracking-wider text-zinc-600">{k}</dt>
              <dd className="font-bold text-[#fb923c] [text-shadow:0_0_8px_rgba(251,146,60,0.35)]">
                {v}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}
