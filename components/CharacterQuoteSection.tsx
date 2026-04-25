"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import QuoteDisplay from "@/components/QuoteDisplay";
import { getCharacterById } from "@/data/characters";
import { getRandomQuote, getRandomQuoteForCharacter, type Quote } from "@/data/quotes";
import { getSagaCharacterById } from "@/types/characters";

type Props = {
  /** Page subject; quotes should prefer this character’s own pool on refresh. */
  characterId: string;
};

export default function CharacterQuoteSection({ characterId }: Props) {
  const pathname = usePathname();
  const quote = useMemo<Quote | null>(() => {
    void pathname;
    return getRandomQuoteForCharacter(characterId) ?? getRandomQuote();
  }, [pathname, characterId]);

  useEffect(() => {
    if (!quote) return;

    let takeoverTimer: number | undefined;

    if (quote.characterId === "hackermouth") {
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
  }, [quote]);

  if (!quote) return null;

  const dossier = getCharacterById(quote.characterId);
  const saga = getSagaCharacterById(quote.characterId);
  const speakerName =
    quote.speakerName ?? dossier?.name ?? saga?.name;
  if (!speakerName) return null;

  return (
    <div
      data-hm-quote-zone
      className="relative z-[30] flex flex-col lg:pt-1"
    >
      <QuoteDisplay
        text={quote.text}
        characterName={speakerName}
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
