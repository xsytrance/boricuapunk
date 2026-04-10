"use client";

type HackermouthToastProps = {
  message: string;
  visible: boolean;
};

export default function HackermouthToast({
  message,
  visible,
}: HackermouthToastProps) {
  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-5 left-1/2 z-[45] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#4ade80] sm:bottom-auto sm:left-auto sm:right-5 sm:top-5 sm:w-max sm:max-w-sm sm:translate-x-0 md:text-[11px]"
      role="status"
      aria-live="polite"
    >
      <div className="rounded-2xl border border-[#166534]/70 bg-black/95 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.65)] [text-shadow:0_0_8px_rgba(74,222,128,0.45)] sm:rounded-sm sm:border-[#14532d] sm:bg-black/80 sm:px-4 sm:py-2.5 sm:shadow-[0_0_24px_rgba(34,197,94,0.2)] sm:backdrop-blur-sm sm:[text-shadow:0_0_10px_rgba(74,222,128,0.5)]">
        {message}
      </div>
    </div>
  );
}
