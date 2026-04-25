"use client";

import Link from "next/link";
import { useState } from "react";
import QuoteDisplay from "@/components/QuoteDisplay";
import { getCharacterById } from "@/data/characters";
import { getRandomQuote, type Quote } from "@/data/quotes";
import { getSagaCharacterById } from "@/types/characters";

const commandCards = [
  {
    title: 'Add a new character',
    prompt:
      'Koden, add a new character. Their name is ____. Their role is ____. Here is their backstory: ____.',
    note: 'Send a name, role, image, and rough backstory. I will help shape the rest.',
  },
  {
    title: 'Update the lore section',
    prompt:
      'Koden, update the lore section with this myth, history, or worldbuilding text: ____.',
    note: 'Raw notes are enough. I can clean the writing and turn it into site-ready copy.',
  },
  {
    title: 'Rebuild the locations atlas',
    prompt:
      'Koden, rebuild the locations atlas. Add these places: ____.',
    note: 'Place names, vibes, and messy notes are fine. I will organize them for you.',
  },
  {
    title: 'Refresh the Quote of the Day',
    prompt:
      'Koden, refresh the Quote of the Day and give me 3 stronger quote options.',
    note: 'Use this when you want new energy on the homepage without changing the whole design.',
  },
];

const sacredSystems = [
  'Keep this homepage as the rebuild command center.',
  'Preserve the old cinematic world as the /archive/ route.',
  'Keep Hackermouth effects alive in the experience.',
  'Keep Quote of the Day as a living ritual on the front page.',
];

export default function Home() {
  const [quote] = useState<Quote>(() => getRandomQuote());
  const dossier = getCharacterById(quote.characterId);
  const saga = getSagaCharacterById(quote.characterId);
  const speakerName = quote.speakerName ?? dossier?.name ?? saga?.name ?? "Unknown Speaker";

  return (
    <main className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="relative overflow-hidden rounded-[28px] border border-[#9a3412]/40 bg-[linear-gradient(135deg,rgba(24,24,27,0.96),rgba(10,10,10,0.92)),radial-gradient(circle_at_top,rgba(234,88,12,0.16),transparent_40%)] p-6 shadow-[0_0_0_1px_rgba(154,52,18,0.1),0_30px_100px_rgba(0,0,0,0.45)] sm:p-8 lg:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#fb923c]/80 to-transparent" />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:items-start">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#14b8a6]/40 bg-[#042f2e]/75 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#99f6e4] shadow-[0_0_24px_rgba(20,184,166,0.18)]">
                  Hackermouth: Watching
                </span>
                <span className="rounded-full border border-[#7f1d1d]/60 bg-black/55 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-[#fdba74]">
                  Rebuild Control Room
                </span>
              </div>

              <div className="space-y-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#fb923c]">
                  Boricuapunk // guided reconstruction
                </p>
                <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl uppercase tracking-[0.04em] text-[#fecaca] md:text-5xl lg:text-6xl">
                  Welcome to Boricuapunk, Jay.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                  I am Koden Bushi Bloodflower, your guide through the rebuild. You send the vision in plain words. I turn it into cleaner prompts, clearer options, and site changes you can actually use.
                </p>
                <p className="max-w-2xl rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-zinc-300">
                  Plain English version: this homepage is the control panel for rebuilding Boricuapunk through Telegram. Send rough ideas there, and I will help turn them into polished changes for the site.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#9a3412]/35 bg-black/35 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#fb923c]">
                    Best way to use me
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Send rough ideas, half-finished lore, screenshots, or references. They do not need to be polished.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#9a3412]/35 bg-black/35 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#fb923c]">
                    What I will return
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Better prompts, layout choices, cleaner writing, and step-by-step help for the parts that feel technical.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://t.me/kodenbushi_bot"
                  className="inline-flex items-center justify-center rounded-full border border-[#f97316]/70 bg-[#180701]/80 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#fff7ed] transition hover:border-[#fdba74] hover:text-[#ffffff]"
                >
                  Open Telegram Bot
                </a>
                <Link
                  href="/archive/"
                  className="inline-flex items-center justify-center rounded-full border border-[#9a3412]/70 bg-black/60 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
                >
                  Enter the Archive
                </Link>
                <Link
                  href="/profile"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-200 transition hover:border-[#fb923c]/60 hover:text-white"
                >
                  Meet Koden
                </Link>
              </div>
            </div>

            <aside className="rounded-[24px] border border-[#9a3412]/40 bg-black/45 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3 border-b border-[#9a3412]/30 pb-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#fb923c]">
                    What stays sacred
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    The bones of the site remain while we rebuild the skin.
                  </p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#14b8a6]">
                  04 vows
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {sacredSystems.map((item, index) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#fb923c]">
                      vow {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-zinc-300">{item}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[28px] border border-[#9a3412]/35 bg-black/35 p-6 sm:p-8">
            <div className="max-w-3xl space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#fb923c]">
                How to rebuild the website
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[0.04em] text-[#fecaca] sm:text-3xl">
                Send rough commands. I will sharpen them.
              </h2>
              <p className="text-sm leading-6 text-zinc-400 sm:text-base">
                Use these as copy-and-send examples in Telegram. Replace the blanks with your own ideas and I will help shape the next version.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {commandCards.map((card, index) => (
                <article
                  key={card.title}
                  className="group rounded-[24px] border border-[#9a3412]/35 bg-[linear-gradient(180deg,rgba(24,24,27,0.88),rgba(8,8,8,0.96))] p-5 transition hover:border-[#f97316]/75 hover:shadow-[0_0_30px_rgba(234,88,12,0.12)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#fb923c]">
                        Command {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-[#fff1f2]">
                        {card.title}
                      </h3>
                    </div>
                    <span className="rounded-full border border-[#14b8a6]/30 bg-[#042f2e]/50 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#99f6e4]">
                      ready
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/6 bg-black/45 p-4 font-mono text-xs leading-6 text-zinc-200">
                    {card.prompt}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-zinc-400">{card.note}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[28px] border border-[#9a3412]/35 bg-black/35 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#fb923c]">
              Quick path
            </p>
            <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl uppercase tracking-[0.04em] text-[#fecaca]">
              If you are not sure what to say
            </h3>
            <ol className="mt-5 space-y-4">
              {[
                "Tell me what part of the site you want to change.",
                "Describe the feeling, color, or vibe you want.",
                "Send any rough text, image, or reference.",
                "I will answer with options instead of computer jargon.",
              ].map((step, index) => (
                <li key={step} className="flex gap-3 rounded-2xl border border-white/6 bg-white/[0.03] p-4">
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#9a3412]/60 bg-black/60 font-mono text-[10px] uppercase tracking-[0.12em] text-[#fde68a]">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-zinc-300">{step}</p>
                </li>
              ))}
            </ol>
          </aside>
        </section>

        <section className="rounded-[28px] border border-[#9a3412]/35 bg-[linear-gradient(180deg,rgba(10,10,10,0.92),rgba(12,10,9,0.98))] p-6 sm:p-8">
          <div className="flex flex-col gap-4 border-b border-[#9a3412]/25 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#14b8a6]">
                Archive pull
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl uppercase tracking-[0.04em] text-[#fecaca] sm:text-3xl">
                Quote of the Day
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-zinc-400">
              A living shard from the archive. Keep this ritual on the front page while the rest of the world is reforged.
            </p>
          </div>

          <div className="mt-6 rounded-[24px] border border-[#9a3412]/30 bg-black/45 p-4 sm:p-6">
            {quote ? (
              <QuoteDisplay
                text={quote.text}
                characterName={speakerName}
                characterId={quote.characterId}
                style={quote.style}
                className="lg:scale-[1.02] lg:shadow-[0_0_48px_rgba(234,88,12,0.24),0_0_1px_rgba(251,146,60,0.55)]"
              />
            ) : (
              <div className="rounded-2xl border border-[#14b8a6]/30 bg-[#031513]/40 px-4 py-6 font-mono text-xs uppercase tracking-[0.22em] text-[#99f6e4]">
                Pulling signal from archive...
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://t.me/kodenbushi_bot"
              className="inline-flex items-center justify-center rounded-full border border-[#14b8a6]/40 bg-[#042f2e]/60 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#99f6e4] transition hover:border-[#5eead4] hover:text-[#ecfeff]"
            >
              Send a command in Telegram
            </a>
            <Link
              href="/archive/"
              className="inline-flex items-center justify-center rounded-full border border-[#9a3412]/70 bg-black/60 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#fde68a] transition hover:border-[#f97316] hover:text-[#ffedd5]"
            >
              Explore the full archive
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
