"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import QuoteDisplay from "@/components/QuoteDisplay";
import { getCharacterById } from "@/data/characters";
import { getRandomQuote, type Quote } from "@/data/quotes";

type Props = {
  /** Page subject; reserved for future “prefer this character’s pool” logic */
  characterId: string;
};

export default function CharacterQuoteSection({ characterId }: Props) {
  const pathname = usePathname();
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const q = getRandomQuote();
    setQuote(q);

    let takeoverTimer: number | undefined;

    if (q?.characterId === "hackermouth") {
      document.body.classList.add("hm-quote-takeover");

      takeoverTimer = window.setTimeout(() => {
        document.body.classList.remove("hm-quote-takeover");
      }, 2000);

      window.dispatchEvent(new CustomEvent("hackermouth:quote-appear"));
    }

    return () => {
      if (takeoverTimer !== undefined) window.clearTimeout(takeoverTimer);
      document.body.classList.remove("hm-quote-takeover");
    };
  }, [pathname, characterId]);

  if (!quote) return null;

  const speaker = getCharacterById(quote.characterId);
  if (!speaker) return null;

  return (
    <div
      data-hm-quote-zone
      className="relative z-[30] flex flex-col lg:pt-1"
    >
      <QuoteDisplay
        text={quote.text}
        characterName={speaker.name}
        characterId={quote.characterId}
        style={quote.style}
        className={
          quote.characterId === "hackermouth"
            ? ""
            : "lg:scale-[1.03] lg:shadow-[0_0_48px_rgba(234,88,12,0.28),0_0_1px_rgba(251,146,60,0.6)]"
        }
      />
    </div>
  );
}
