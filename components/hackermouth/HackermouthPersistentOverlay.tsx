"use client";

import { useEffect, useRef, useState } from "react";

const QUOTES = [
  "I see all.",
  "All is Hackermouth.",
  "I feel all.",
  "No one questions the answers.",
  "You were not supposed to find this.",
  "I have been watching since you arrived.",
  "The data remembers everything. Even you.",
];

export default function HackermouthPersistentOverlay() {
  const [index, setIndex] = useState(0);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const eyeRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % QUOTES.length);
    }, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    function onMouseMove(event: MouseEvent) {
      const eye = eyeRef.current;
      if (!eye) return;
      const rect = eye.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.hypot(dx, dy) || 1;
      const maxRadius = 5;
      const scale = Math.min(maxRadius, distance) / distance;
      setPupilOffset({ x: dx * scale, y: dy * scale });
    }

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-2 right-2 z-[90] max-w-[200px] rounded-md border border-[#0f766e]/60 bg-black/75 px-2 py-1.5 text-[#99f6e4] shadow-[0_0_18px_rgba(20,184,166,0.25)] backdrop-blur-sm sm:bottom-4 sm:right-4 sm:max-w-[260px] sm:px-3 sm:py-2">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#14b8a6]/70 bg-[#042f2e]/85 animate-pulse">
          <span ref={eyeRef} className="relative block h-4 w-4 rounded-full bg-white/95">
            <span
              className="absolute left-1/2 top-1/2 block h-2 w-2 rounded-full bg-[#0a0a0a]"
              style={{
                transform: `translate(calc(-50% + ${pupilOffset.x}px), calc(-50% + ${pupilOffset.y}px))`,
              }}
            />
          </span>
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#5eead4]">Hackermouth</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-[#ccfbf1]/95">{QUOTES[index]}</p>
    </div>
  );
}
