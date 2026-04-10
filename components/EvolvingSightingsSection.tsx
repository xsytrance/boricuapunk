"use client";

import { useEffect, useState } from "react";

type Sighting = {
  id: string;
  createdAt: string;
  imagePath: string;
  card: {
    id: string;
    name: string;
    title: string;
    description: string;
  };
  match: {
    confidence: number;
    reason: string;
    method: string;
  };
  hackermouthEffects: string[];
};

export default function EvolvingSightingsSection({ mobile }: { mobile: boolean }) {
  const [sightings, setSightings] = useState<Sighting[]>([]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch("/api/archive/sightings?limit=8", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as { sightings?: Sighting[] };
        if (active && Array.isArray(payload.sightings)) {
          setSightings(payload.sightings);
        }
      } catch {
        // ignore and keep section hidden
      }
    }

    void load();
    const timer = window.setInterval(load, 25000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  if (sightings.length === 0) return null;

  return (
    <section className={`mx-auto w-full max-w-6xl ${mobile ? "px-4 py-8" : "px-4 py-14 md:px-8"}`}>
      <div className="mb-6 border-l-[4px] border-[#14b8a6] pl-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#5eead4]">
          Live Telegram character ingestion
        </p>
        <h2 className={`mt-2 font-[family-name:var(--font-display)] uppercase tracking-[0.05em] text-[#ccfbf1] ${mobile ? "text-2xl" : "text-4xl"}`}>
          Evolving Character Field Sightings
        </h2>
      </div>

      <div className={`grid gap-4 ${mobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"}`}>
        {sightings.map((sighting) => (
          <article
            key={sighting.id}
            className="overflow-hidden rounded-md border-[2px] border-[#0f766e]/60 bg-gradient-to-b from-[#041514] via-black to-[#020202] shadow-[0_0_24px_rgba(20,184,166,0.18),inset_0_0_26px_rgba(0,0,0,0.75)]"
          >
            <div className="relative aspect-[4/5] w-full bg-black">
              <img src={sighting.imagePath} alt={sighting.card.name} className="h-full w-full object-cover object-top" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            </div>
            <div className="space-y-2 px-3 py-3.5">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#5eead4]">
                {sighting.card.name}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#fdba74]">{sighting.card.title}</p>
              <p className="text-xs leading-relaxed text-zinc-400 line-clamp-3">{sighting.card.description}</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#99f6e4]/80">
                Match {(sighting.match.confidence * 100).toFixed(0)}% • {sighting.match.method}
              </p>
              <p className="text-[10px] text-zinc-500 line-clamp-2">{sighting.hackermouthEffects[0]}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
