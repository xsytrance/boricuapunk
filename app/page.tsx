"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getRandomQuote, type Quote } from "@/data/quotes";
import QuoteDisplay from "@/components/QuoteDisplay";

export default function Home() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      const q = getRandomQuote();
      setQuote(q);
    };
    fetchQuote();
  }, []);

  return (
    <main className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
      {/* Header with site title */}
      <header className="border-b border-[#9a3412]/30 bg-black/50 px-4 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="font-mono text-[10px] text-[#fb923c] uppercase tracking-[0.18em]">
            Boricuapunk
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="/archive/"
              className="rounded border border-[#9a3412]/70 bg-black/65 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
            >
              View Archived Site
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex min-h-[calc(100vh-4rem)] w-full flex-1 flex-col px-4 py-8 sm:px-6">
        <div className="max-w-4xl w-full mx-auto space-y-12">
          {/* Welcome section */}
          <section className="text-center space-y-6">
            <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-[0.04em] text-[#fecaca] md:text-5xl">
              Welcome to BoricuaPunk, Jay.
            </h1>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
              I Koden Bushi Bloodflower, am your guide for designing this website.
            </p>
            <p className="max-w-xl text-sm leading-relaxed text-zinc-400">
              Use Telegram to send me commands to rebuild this site step by step.
            </p>
          </section>

          {/* Tutorial prompt examples */}
          <section className="space-y-8">
            <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[0.04em] text-[#fecaca]">
              How to Rebuild the Website
            </h2>
            <p className="text-sm text-zinc-400 mb-4">
              Send these prompts via Telegram to guide the redesign:
            </p>
            <div className="space-y-4">
              {/* Example 1 */}
              <div className="flex items-start space-x-3 bg-black/40 rounded-md p-4">
                <div className="flex-shrink-0">
                  <span className="font-mono text-[10px] text-[#fb923c]">•</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-mono text-[10px] text-[#fb923c]">“Add a new character”</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Provide a character photo, name, and backstory. I will create a character card,
                    add them to the archive, and generate a quote for them.
                  </p>
                </div>
              </div>
              {/* Example 2 */}
              <div className="flex items-start space-x-3 bg-black/40 rounded-md p-4">
                <div className="flex-shrink-0">
                  <span className="font-mono text-[10px] text-[#fb923c]">•</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-mono text-[10px] text-[#fb923c]">“Update the lore section”</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Share new lore fragments or myths. I will format them and add to the /lore page.
                  </p>
                </div>
              </div>
              {/* Example 3 */}
              <div className="flex items-start space-x-3 bg-black/40 rounded-md p-4">
                <div className="flex-shrink-0">
                  <span className="font-mono text-[10px] text-[#fb923c]">•</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-mono text-[10px] text-[#fb923c]">“Rebuild the locations atlas”</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Give me location names, descriptions, and any associated media. I will create
                    location entries with proper formatting.
                  </p>
                </div>
              </div>
              {/* Example 4 */}
              <div className="flex items-start space-x-3 bg-black/40 rounded-md p-4">
                <div className="flex-shrink-0">
                  <span className="font-mono text-[10px] text-[#fb923c]">•</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-mono text-[10px] text-[#fb923c]">“Refresh the quote of the day”</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    I will pull a new quote from the archive and display it with the classic Hackermouth effect.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Quote of the Day */}
          <section className="border-t border-[#9a3412]/30 pt-8">
            <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[0.04em] text-[#fecaca] mb-4">
              Quote of the Day
            </h2>
            {quote ? (
              <QuoteDisplay
                text={quote.text}
                characterName={quote.speakerName}
                characterId={quote.characterId}
                style={quote.style}
                className="lg:scale-[1.03] lg:shadow-[0_0_48px_rgba(234,88,12,0.28),0_0_1px_rgba(251,146,60,0.6)]"
              />
            ) : (
              <p className="text-sm text-zinc-400">Loading quote...</p>
            )}
          </section>

          {/* Call to action */}
          <div className="mt-12 text-center">
            <Link
              href="/archive/"
              className="rounded border border-[#9a3412]/70 bg-black/65 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
            >
              Explore the Full Archive
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
