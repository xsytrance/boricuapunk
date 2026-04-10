import type { QuoteStyle } from "@/data/quotes";

type QuoteDisplayProps = {
  text: string;
  characterName: string;
  style: QuoteStyle;
  /** When set, enables Hackermouth-only styling */
  characterId?: string;
  className?: string;
};

export default function QuoteDisplay({
  text,
  characterName,
  style,
  characterId,
  className = "",
}: QuoteDisplayProps) {
  if (characterId === "hackermouth") {
    return (
      <aside
        className={`relative z-10 rounded border border-[#064e3b]/80 bg-[#0a0a0a]/95 px-6 py-8 ${className}`}
      >
        <div className="relative z-10 rounded-md bg-[linear-gradient(to_bottom,rgba(0,0,0,0.75),rgba(0,0,0,0.92))] p-4 font-mono text-sm leading-relaxed tracking-wide text-[#00ff9c] md:text-base">
          <p className="hm-quote-hackermouth-flicker mb-2 text-[10px] uppercase tracking-[0.2em] text-[#00ff9c]/80">
            HACKERMOUTH://
          </p>
          <p className="hm-quote-hackermouth-flicker text-base font-semibold md:text-lg">
            {text}
          </p>
        </div>
        <div className="relative z-10 mt-6 border-t border-[#064e3b]/60 pt-4 text-center">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-[#5eead4]/90">
            {characterName}
          </p>
        </div>
      </aside>
    );
  }

  if (style === "graffiti") {
    return (
      <aside
        className={`relative z-10 overflow-hidden rounded-sm border-[3px] border-dashed border-[#f97316] bg-gradient-to-br from-[#292524] via-[#1c1917] to-[#0c0a09] p-6 shadow-[inset_0_0_50px_rgba(0,0,0,0.75)] ${className}`}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.12]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="relative z-10 rounded-md p-4"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8))",
          }}
        >
          <p
            className="-rotate-[2deg] text-lg font-black uppercase leading-[1.15] tracking-wide text-[#ffe7c2] md:text-2xl"
            style={{
              fontFamily: "Impact, Haettenschweiler, sans-serif",
              textShadow: "0 0 6px rgba(255,120,0,0.4)",
            }}
          >
            {text}
          </p>
        </div>
        <p className="relative z-10 mt-5 font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#fbbf24]">
          — {characterName}
        </p>
      </aside>
    );
  }

  return (
    <aside
      className={`relative z-10 rounded border-[3px] border-[#c2410c] bg-gradient-to-b from-[#1f1f1f] via-[#111] to-[#050505] px-6 py-8 shadow-[inset_0_0_45px_rgba(0,0,0,0.85),inset_0_2px_0_rgba(255,255,255,0.04)] ${className}`}
    >
      <div
        className="relative z-10 rounded-md p-4 tracking-wide"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8))",
          borderRadius: "6px",
        }}
      >
        <p
          className="text-center text-xl font-black uppercase leading-snug tracking-wide text-[#ffe7c2] md:text-2xl lg:text-3xl"
          style={{
            fontFamily: "Impact, Haettenschweiler, sans-serif",
            textShadow: "0 0 6px rgba(255,120,0,0.4)",
          }}
        >
          “{text}”
        </p>
      </div>
      <div className="relative z-10 mt-8 border-t-[2px] border-[#7f1d1d]/90 pt-5 text-center shadow-[inset_0_8px_16px_rgba(0,0,0,0.35)]">
        <p
          className="font-mono text-xs font-bold uppercase tracking-wide text-[#fb923c] md:text-sm"
          style={{ textShadow: "0 0 6px rgba(255,120,0,0.35)" }}
        >
          {characterName}
        </p>
      </div>
    </aside>
  );
}
