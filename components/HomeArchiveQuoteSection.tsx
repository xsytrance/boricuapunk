"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import QuoteDisplay from "@/components/QuoteDisplay";
import { getCharacterById } from "@/data/characters";
import { getRandomQuote, type Quote } from "@/data/quotes";
import { getSagaCharacterById } from "@/types/characters";

type EvolvingQuote = Quote & { speakerName?: string };

export default function HomeArchiveQuoteSection() {
  const pathname = usePathname();
  const [quote, setQuote] = useState<EvolvingQuote | null>(null);

  useEffect(() => {
    let takeoverTimer: number | undefined;
    let active = true;

    async function loadQuote() {
      try {
        const response = await fetch("/api/archive/quote-of-day", { cache: "no-store" });
        if (!response.ok) throw new Error("quote fetch failed");

        const payload = (await response.json()) as {
          quote?: { id: string; characterId: string; text: string; style: Quote["style"]; speakerName?: string };
        };

        if (!active || !payload.quote) return;
        setQuote(payload.quote);

        if (payload.quote.characterId === "hackermouth") {
          document.body.classList.add("hm-quote-takeover");
          takeoverTimer = window.setTimeout(() => {
            document.body.classList.remove("hm-quote-takeover");
          }, 2000);
          window.dispatchEvent(new CustomEvent("hackermouth:quote-appear"));
        }
        return;
      } catch {
        const fallback = getRandomQuote();
        if (!active) return;
        setQuote(fallback);

        if (fallback.characterId === "hackermouth") {
          document.body.classList.add("hm-quote-takeover");
          takeoverTimer = window.setTimeout(() => {
            document.body.classList.remove("hm-quote-takeover");
          }, 2000);
          window.dispatchEvent(new CustomEvent("hackermouth:quote-appear"));
        }
      }
    }

    void loadQuote();

    return () => {
      active = false;
      if (takeoverTimer !== undefined) window.clearTimeout(takeoverTimer);
      document.body.classList.remove("hm-quote-takeover");
    };
  }, [pathname]);

  if (!quote) return null;

  const dossier = getCharacterById(quote.characterId);
  const saga = getSagaCharacterById(quote.characterId);
  const speakerName =
    quote.speakerName ?? dossier?.name ?? saga?.name;

  return (
    <section
      data-hm-quote-zone
      className="relative z-[30] border-t-[3px] border-[#7f1d1d]/50 bg-gradient-to-b from-black/60 to-[#050505] px-4 py-16 md:px-8"
    >
      <div className="relative z-[30] mx-auto max-w-3xl rounded-md border-[3px] border-[#9a3412]/60 bg-gradient-to-b from-[#111] to-black/80 p-8 shadow-[inset_0_0_40px_rgba(0,0,0,0.6),0_0_32px_rgba(234,88,12,0.12)] md:p-10">
        <div className="relative z-[30] mb-8 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-[0.12em] text-[#fecaca] md:text-4xl">
            Quote of the Day
          </h2>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
            Session pick — new shuffle when you return
          </p>
        </div>
        {speakerName ? (
          <div className="relative z-10">
            <QuoteDisplay
              text={quote.text}
              characterName={speakerName}
              characterId={quote.characterId}
              style={quote.style}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
