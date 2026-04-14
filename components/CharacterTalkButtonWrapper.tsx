"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CharacterTalkButton = dynamic(() => import("@/components/CharacterTalkButton"), {
  ssr: false,
});

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789△□◇/\\|*";
const HAUNT_QUOTES = ["I see all.", "All is Hackermouth.", "01001001", "You are observed."];

type Phase = 1 | 2 | 3 | 4;

type Props = {
  characterId: string;
};

function ScrambleOverlay() {
  const [text, setText] = useState("");

  useEffect(() => {
    const rows = 16;
    const cols = 56;
    const tick = () => {
      let s = "";
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          s += GLYPHS[(Math.random() * GLYPHS.length) | 0]!;
        }
        s += "\n";
      }
      setText(s);
    };
    tick();
    const id = window.setInterval(tick, 85);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-auto fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[1px]">
      <pre className="max-h-[78vh] w-full max-w-6xl overflow-hidden whitespace-pre-wrap font-mono text-[8px] leading-[1.05] tracking-tight text-[#fb923c]/85 [text-shadow:0_0_6px_rgba(194,65,12,0.85)] md:text-[9px]">
        {text}
      </pre>
      <div className="pointer-events-none absolute inset-0 animate-pulse bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(127,29,29,0.25)_100%)]" />
    </div>
  );
}

function QuotesBleedOverlay() {
  return (
    <div className="pointer-events-auto fixed inset-0 z-[120] flex flex-col items-center justify-end bg-gradient-to-t from-black via-black/55 to-black/25 px-4 pb-[22vh]">
      <div className="flex max-w-lg flex-col gap-3 font-mono text-center">
        {HAUNT_QUOTES.map((line, i) => (
          <p
            key={line}
            className="pob-quote-flicker-line text-sm text-[#5eead4] opacity-90 [text-shadow:0_0_14px_rgba(20,184,166,0.55)] md:text-base"
            style={{ animationDelay: `${i * 0.22}s` }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function VhsStaticOverlay() {
  return (
    <div className="pointer-events-auto fixed inset-0 z-[125] bg-black/85">
      <div
        className="hm-fs-scanlines hm-fs-flicker absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)",
        }}
      />
      <div className="absolute inset-0 animate-pulse bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.12%22/%3E%3C/svg%3E')] opacity-50 mix-blend-mode-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(0,0,0,0.55)_70%)]" />
    </div>
  );
}

export default function CharacterTalkButtonWrapper({ characterId }: Props) {
  const [phase, setPhase] = useState<Phase>(1);
  const [chatOpaque, setChatOpaque] = useState(false);

  useEffect(() => {
    const t2 = window.setTimeout(() => setPhase(2), 5000);
    const t3 = window.setTimeout(() => setPhase(3), 8000);
    const t4 = window.setTimeout(() => setPhase(4), 10000);
    return () => {
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, []);

  useEffect(() => {
    if (phase !== 4) {
      setChatOpaque(false);
      return;
    }
    const id = window.requestAnimationFrame(() => {
      setChatOpaque(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, [phase]);

  return (
    <div className="relative min-h-[520px] w-full">
      {phase === 1 ? <ScrambleOverlay /> : null}
      {phase === 2 ? <QuotesBleedOverlay /> : null}
      {phase === 3 ? <VhsStaticOverlay /> : null}

      {phase >= 4 ? (
        <div
          className={`transition-opacity duration-1000 ease-out ${chatOpaque ? "opacity-100" : "opacity-0"}`}
        >
          <CharacterTalkButton
            characterId={characterId}
            typedPlaceholderOnMount
            showFullExperienceLink
          />
        </div>
      ) : (
        <div
          className="pointer-events-none rounded-md border-[3px] border-[#7f1d1d]/30 bg-black/40 p-5 font-mono opacity-40 shadow-[inset_0_0_34px_rgba(0,0,0,0.65)] md:p-6"
          aria-hidden
        >
          <div className="flex items-center justify-between border-b border-[#9a3412]/40 pb-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]/50">Character Chat</p>
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#fde68a]/40">signal pending</span>
          </div>
          <div className="mt-4 min-h-[400px] rounded border border-[#9a3412]/40 bg-black/50 p-4" />
        </div>
      )}
    </div>
  );
}
