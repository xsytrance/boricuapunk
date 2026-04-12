"use client";

import Link from "next/link";
import { hackermouthSay } from "@/lib/hackermouthSay";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type ReactNode } from "react";

const NAV_DELAY_MS = 1000;
const SUBLINE_DELAY_MS = 200;

type ArchiveAccessPanelProps = {
  children: ReactNode;
  dossierHref?: string;
};

export default function ArchiveAccessPanel({
  children,
  dossierHref = "/characters/manus-neco",
}: ArchiveAccessPanelProps) {
  const router = useRouter();
  const navigatedRef = useRef(false);
  const [isAccessing, setIsAccessing] = useState(false);
  const [showSubline, setShowSubline] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAccessing) return;

    const subTimer = window.setTimeout(() => {
      setShowSubline(true);
    }, SUBLINE_DELAY_MS);

    const navTimer = window.setTimeout(() => {
      if (navigatedRef.current) return;
      navigatedRef.current = true;
      console.log("Navigating to character page");
      router.push(dossierHref);
    }, NAV_DELAY_MS);

    return () => {
      window.clearTimeout(subTimer);
      window.clearTimeout(navTimer);
    };
  }, [isAccessing, dossierHref, router]);

  useEffect(() => {
    if (!isAccessing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isAccessing]);

  function handleActivate(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (isAccessing) return;
    console.log("Hackermouth triggered");
    setShowSubline(false);
    navigatedRef.current = false;
    setIsAccessing(true);
  }

  const interrupt =
    mounted && isAccessing ? (
      <div
        className="hm-fs-interrupt-root fixed inset-0 flex flex-col items-center justify-center overflow-hidden px-6 text-center"
        style={{ zIndex: 9998 }}
        role="alertdialog"
        aria-modal="true"
        aria-live="assertive"
        aria-busy="true"
        aria-label="Hackermouth system interrupt"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_40%,rgba(5,40,21,0.5)_0%,transparent_55%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-soft-light"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15] hm-fs-scanlines"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,197,94,0.1) 2px, rgba(34,197,94,0.1) 3px)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 backdrop-blur-[4px]" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="hm-fs-sweep absolute left-0 right-0 h-[4px] bg-gradient-to-r from-transparent via-[#22d3ee]/60 to-transparent opacity-80 shadow-[0_0_20px_rgba(34,211,238,0.4)]" />
        </div>
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_100px_40px_rgba(0,0,0,0.5)]" />

        <div className="relative z-[100] flex max-w-[min(100%,36rem)] flex-col items-center gap-6">
          <p className="hm-fs-flicker relative font-mono text-lg font-bold uppercase leading-tight tracking-[0.12em] text-[#4ade80] sm:text-2xl md:text-3xl md:tracking-[0.14em] [text-shadow:0_0_24px_rgba(74,222,128,0.95),0_0_48px_rgba(34,211,238,0.45),2px_0_0_rgba(239,68,68,0.3)]">
            <span className="absolute left-0 top-0 -translate-x-[2px] text-[#22c55e]/40 blur-[0.5px]">
              {hackermouthSay("ACCESSING DOSSIER")}
            </span>
            <span className="relative">
              {hackermouthSay("ACCESSING DOSSIER")}
            </span>
          </p>
          <p
            className={`max-w-lg font-mono text-base leading-relaxed tracking-[0.12em] text-[#67e8f9] transition-opacity duration-300 ease-out sm:text-lg [text-shadow:0_0_16px_rgba(103,232,249,0.6)] ${
              showSubline ? "opacity-100" : "opacity-0"
            }`}
          >
            {hackermouthSay("…watch closely.")}
          </p>
        </div>
      </div>
    ) : null;

  return (
    <>
      <Link
        href={dossierHref}
        onClick={handleActivate}
        aria-label="Open Manus Neco character dossier"
        aria-busy={isAccessing}
        aria-disabled={isAccessing}
        scroll={false}
        className={`group relative isolate z-[30] block w-full cursor-pointer overflow-visible rounded-md text-left outline-none transition duration-300 ease-out will-change-transform hover:scale-[1.02] hover:shadow-[0_0_64px_rgba(234,88,12,0.5),12px_18px_0_rgba(0,0,0,0.72)] focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] ${
          isAccessing
            ? "pointer-events-none cursor-wait scale-[1.03] shadow-[0_0_72px_rgba(234,88,12,0.55),12px_18px_0_rgba(0,0,0,0.72)] animate-hm-panel-access"
            : ""
        }`}
      >
        {children}
      </Link>
      {mounted && interrupt
        ? createPortal(interrupt, document.body)
        : null}
    </>
  );
}
