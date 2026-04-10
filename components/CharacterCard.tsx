"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, type CSSProperties } from "react";
import {
  archiveSignalHover,
  type ArchiveHoverPayload,
} from "@/lib/hackermouthArchive";
import { nextSessionUnit } from "@/lib/sessionRandom";
import type { CharacterTag, ThreatLevel } from "@/types/characters";

const FACTION_GLOW: Record<string, string> = {
  "red-noodle-clan": "rgba(248, 113, 113, 0.55)",
  "lily-pad-clan": "rgba(147, 51, 234, 0.5)",
  "neon-independents": "rgba(56, 189, 248, 0.5)",
  "dockside-syndicate": "rgba(34, 197, 94, 0.45)",
  "skywave-collective": "rgba(251, 191, 36, 0.5)",
  "venom-8-clan": "rgba(59, 130, 246, 0.55)",
  "neverminds-faction": "rgba(244, 63, 94, 0.5)",
  "people-of-pisces": "rgba(251, 146, 60, 0.45)",
  "flower-city-court": "rgba(192, 132, 252, 0.45)",
  "house-of-yabu": "rgba(74, 222, 128, 0.4)",
  "grubbergelt-corp": "rgba(250, 204, 21, 0.5)",
  "salt-ring-enclave": "rgba(165, 243, 252, 0.4)",
};

let archiveSignalDepth = 0;

function pushArchiveSignal() {
  archiveSignalDepth += 1;
  document.body.classList.add("hm-archive-signal");
}

function popArchiveSignal() {
  archiveSignalDepth = Math.max(0, archiveSignalDepth - 1);
  if (archiveSignalDepth === 0) {
    document.body.classList.remove("hm-archive-signal");
  }
}

export type CharacterCardProps = {
  id: string;
  name: string;
  title: string;
  image: string;
  href?: string;
  tags?: CharacterTag[];
  factionId?: string;
  threatLevel?: ThreatLevel;
};

export default function CharacterCard({
  id,
  name,
  title,
  image,
  href,
  tags = [],
  factionId,
  threatLevel,
}: CharacterCardProps) {
  const throttleRef = useRef(0);
  const signalActiveRef = useRef(false);

  const glow =
    (factionId && FACTION_GLOW[factionId]) || "rgba(234, 88, 12, 0.45)";

  const dispatchArchive = useCallback(() => {
    const now = Date.now();
    if (now - throttleRef.current < 480) return;
    throttleRef.current = now;
    const detail: ArchiveHoverPayload = {
      characterId: id,
      tags,
      threatLevel,
      factionId,
    };
    window.dispatchEvent(
      new CustomEvent("hackermouth:archive-hover", { detail }),
    );
    if (archiveSignalHover(tags)) {
      if (!signalActiveRef.current) {
        signalActiveRef.current = true;
        pushArchiveSignal();
      }
      if (nextSessionUnit() < 0.32) {
        window.dispatchEvent(new CustomEvent("hackermouth:node-expansion"));
      }
    }
  }, [id, tags, threatLevel, factionId]);

  const clearArchive = useCallback(() => {
    window.dispatchEvent(new CustomEvent("hackermouth:archive-leave"));
    if (signalActiveRef.current) {
      signalActiveRef.current = false;
      popArchiveSignal();
    }
  }, []);

  const badgeTags = tags.slice(0, 2);

  const article = (
    <article
      className="archive-card-sheen group/card relative block overflow-hidden rounded border-[3px] border-[#9a3412]/90 bg-[#0a0a0a] shadow-[inset_0_0_40px_rgba(0,0,0,0.65),0_0_0_1px_rgba(0,0,0,0.9),0_4px_20px_rgba(0,0,0,0.8)] transition duration-300 ease-out will-change-transform hover:scale-[1.04] hover:border-[#f97316]"
      style={
        {
          ["--archive-glow" as string]: glow,
        } as CSSProperties
      }
      onMouseEnter={dispatchArchive}
      onMouseLeave={clearArchive}
      onFocus={dispatchArchive}
      onBlur={clearArchive}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition duration-500 group-hover/card:opacity-[0.22]"
        style={{
          background: `radial-gradient(ellipse 90% 70% at 50% 0%, var(--archive-glow), transparent 65%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.14] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="archive-card-pulse pointer-events-none absolute inset-0 z-[0] opacity-0 group-hover/card:opacity-[0.12]" />
      <div className="relative aspect-[4/5] w-full bg-gradient-to-b from-[#1c1917] to-[#0a0a0a]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover object-top opacity-90 transition duration-300 group-hover/card:opacity-100"
          sizes="(max-width:768px) 50vw, 25vw"
          unoptimized
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]" />
        {badgeTags.length > 0 ? (
          <div className="pointer-events-none absolute left-2 top-2 z-[3] flex flex-wrap gap-1">
            {badgeTags.map((t) => (
              <span
                key={t}
                className="rounded border border-[#ea580c]/50 bg-black/75 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-[#fed7aa] shadow-[0_0_12px_rgba(234,88,12,0.25)] md:text-[9px]"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="relative z-[2] border-t-[3px] border-[#7f1d1d]/70 bg-gradient-to-b from-black/95 to-[#050505] px-3 py-3.5 shadow-[inset_0_2px_12px_rgba(0,0,0,0.6)]">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#fde68a] md:text-sm md:tracking-wide">
          {name}
        </h2>
        <p className="mt-1.5 text-[10px] font-bold uppercase leading-tight tracking-[0.15em] text-[#fb923c]/95 md:text-xs">
          {title}
        </p>
      </div>
    </article>
  );

  const focusRing =
    "block rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

  if (href) {
    return (
      <Link href={href} className={focusRing} data-hoverable="">
        {article}
      </Link>
    );
  }

  return (
    <div
      className={`${focusRing} cursor-default`}
      data-hoverable=""
      role="group"
      aria-label={`${name} — archive only`}
    >
      {article}
    </div>
  );
}
