"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

type ManusHeroPortraitProps = {
  src: string;
  alt: string;
};

const MAX_OFFSET = 6;

export default function ManusHeroPortrait({ src, alt }: ManusHeroPortraitProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
    setParallax({
      x: Math.max(-1, Math.min(1, nx)) * -MAX_OFFSET,
      y: Math.max(-1, Math.min(1, ny)) * -MAX_OFFSET,
    });
  }, []);

  const onLeave = useCallback(() => {
    setParallax({ x: 0, y: 0 });
    setHover(false);
  }, []);

  return (
    <div
      ref={wrapRef}
      role="presentation"
      className="group relative aspect-[3/4] w-full overflow-hidden rounded-md border-[3px] border-[#ea580c] shadow-[8px_12px_0_rgba(0,0,0,0.85),0_0_60px_rgba(234,88,12,0.45),inset_0_0_45px_rgba(0,0,0,0.55)] transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:-translate-y-[2px] hover:shadow-[8px_12px_0_rgba(0,0,0,0.85),0_0_88px_rgba(234,88,12,0.55),0_0_120px_rgba(234,88,12,0.2),inset_0_0_45px_rgba(0,0,0,0.55)]"
      onMouseEnter={() => setHover(true)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="absolute inset-0 transition-transform duration-150 ease-out will-change-transform"
        style={{
          transform: hover
            ? `translate3d(${parallax.x}px, ${parallax.y}px, 0) scale(1.02)`
            : `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-top"
          priority
          unoptimized
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 rounded-md opacity-0 shadow-[0_0_56px_rgba(234,88,12,0.5)] transition-opacity duration-300 group-hover:opacity-90"
        style={{ animation: "hm-manus-pulse 2.2s ease-in-out infinite" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/92 via-black/20 to-black/35" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(0,0,0,0.5)_0%,transparent_45%,rgba(234,88,12,0.08)_100%)]" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_70px_rgba(0,0,0,0.65)]" />
    </div>
  );
}
