export type QuoteStyle = "streetfighter" | "graffiti";

export type Quote = {
  id: string;
  /** Dossier id, saga id, or sentinel like "unknown" when using speakerName */
  characterId: string;
  text: string;
  style: QuoteStyle;
  /** When set, shown instead of resolving name from dossier/saga */
  speakerName?: string;
};

/** Primary quote per character is the first quote for that characterId in this array. */
export const quotes: Quote[] = [
  {
    id: "q-manus-1",
    characterId: "manus-neco",
    text: "Gravity is just another cop telling you where to stand.",
    style: "streetfighter",
  },
  {
    id: "q-manus-2",
    characterId: "manus-neco",
    text: "They painted the sky for tourists. I walk the cracks they missed.",
    style: "graffiti",
  },
  {
    id: "q-manus-3",
    characterId: "manus-neco",
    text: "Flat feet, flat lies—only the horizon knows my real name.",
    style: "streetfighter",
  },
  {
    id: "q-vera-1",
    characterId: "vera-cordoba",
    text: "You want a signal? Touch the rail and pray.",
    style: "graffiti",
  },
  {
    id: "q-tito-1",
    characterId: "tito-kaiju",
    text: "You hear that rumble? That’s not weather—it's my schedule.",
    style: "streetfighter",
  },
  {
    id: "q-mofongo-1",
    characterId: "la-mofongo",
    text: "Salt, garlic, pressure—same recipe as survival.",
    style: "streetfighter",
  },
  {
    id: "q-astro-1",
    characterId: "dj-astro",
    text: "Bass is law. Treble is mercy.",
    style: "graffiti",
  },
  {
    id: "hm-1",
    characterId: "hackermouth",
    text: "I see all.",
    style: "streetfighter",
  },
  {
    id: "hm-2",
    characterId: "hackermouth",
    text: "All is Hackermouth.",
    style: "streetfighter",
  },
  {
    id: "hm-3",
    characterId: "hackermouth",
    text: "I kill all.",
    style: "streetfighter",
  },
  {
    id: "hm-4",
    characterId: "hackermouth",
    text: "No one questions the answers.",
    style: "streetfighter",
  },
  {
    id: "q-sifu-1",
    characterId: "sifu-kinoko",
    text: "Combine nine—ascend divine. The theater already bought your ticket.",
    style: "streetfighter",
  },
  {
    id: "q-yulania-1",
    characterId: "yulania-friz",
    text: "Hunt the black until the black thanks you for the company.",
    style: "graffiti",
  },
  {
    id: "q-grats-1",
    characterId: "gratitude-frogs-grats",
    text: "Gratitude is ordnance. We don’t waste shells on shame.",
    style: "streetfighter",
  },
  {
    id: "q-doncellas-1",
    characterId: "shield-doncellas",
    text: "Red smoke remembers who stood still longest.",
    style: "graffiti",
  },
  {
    id: "q-exhumerator-1",
    characterId: "the-exhumerator",
    text: "Three claps. The room forgets what it saw.",
    style: "streetfighter",
  },
  {
    id: "q-tonyo-1",
    characterId: "tonyo-byo",
    text: "Citadels fall like manners—loud, then embarrassing.",
    style: "streetfighter",
  },
  {
    id: "q-saint-1",
    characterId: "saint-flamingo",
    text: "Tyranny wears frippery so you’ll applaud the collar.",
    style: "graffiti",
  },
  {
    id: "q-bloodless-1",
    characterId: "bloodless-visitor",
    text: "Hope arrives in porcelain—handle like a grenade.",
    style: "streetfighter",
  },
  {
    id: "q-azula-1",
    characterId: "azula-sabra",
    text: "My bill is steel. Your tab is breathing.",
    style: "streetfighter",
  },
  {
    id: "q-koden-1",
    characterId: "koden-bushi-bloodflower",
    text: "A gift of revenge still hums if you tune it honest.",
    style: "graffiti",
  },
  {
    id: "q-spada-1",
    characterId: "spada-virina",
    text: "Purple-black doesn’t ask permission—it collects signatures.",
    style: "streetfighter",
  },
  {
    id: "q-yindao-1",
    characterId: "sword-of-yindao",
    text: "Nine edges in the myth; one in your hand. Guess which lies.",
    style: "graffiti",
  },
  {
    id: "q-pisces-1",
    characterId: "people-of-pisces",
    text: "Incongruity is armor when every note refuses the same key.",
    style: "graffiti",
  },
  {
    id: "q-lily-1",
    characterId: "lily-pad-clan",
    text: "We built nine thrones of echo. You heard applause. We heard debt.",
    style: "streetfighter",
  },
  {
    id: "q-rnc-1",
    characterId: "red-noodle-clan",
    text: "Long live the thread—neon in the veins, rice-hat brim like a halo.",
    style: "streetfighter",
  },
  {
    id: "q-raziel-1",
    characterId: "raziel-underwire",
    text: "The grid has a throat. I am the cough you mistook for jazz.",
    style: "graffiti",
  },
  {
    id: "q-choir-1",
    characterId: "glass-lung-choir",
    text: "Tourists hear music. Initiates hear verdicts in ventilation.",
    style: "graffiti",
  },
  {
    id: "q-socket-1",
    characterId: "socket-ghost",
    text: "Between hello and betrayal is a protocol you never authored.",
    style: "streetfighter",
  },
  {
    id: "q-salt-1",
    characterId: "salt-ring-enclave",
    text: "Brine signs treaties rust can’t break.",
    style: "streetfighter",
  },
  {
    id: "q-parade-1",
    characterId: "obsidian-parade",
    text: "We don’t march. We align until the strings confess.",
    style: "graffiti",
  },
  {
    id: "q-unknown-1",
    characterId: "unknown",
    speakerName: "Unknown signal",
    text: "The archive breathes. You mistook static for silence.",
    style: "graffiti",
  },
  {
    id: "q-unknown-2",
    characterId: "unknown",
    speakerName: "Scrubbed source",
    text: "Every file has a pulse. Stop pretending yours is innocent.",
    style: "streetfighter",
  },
  {
    id: "q-faction-neon-1",
    characterId: "neon-independents",
    text: "Independence is voltage with a lawyer’s grin.",
    style: "graffiti",
  },
  {
    id: "q-faction-dock-1",
    characterId: "dockside-syndicate",
    text: "The harbor keeps teeth wet. Debts keep them sharp.",
    style: "streetfighter",
  },
];

export function getQuotesForCharacter(characterId: string): Quote[] {
  return quotes.filter((q) => q.characterId === characterId);
}

function randomUnit(): number {
  const c = globalThis.crypto;
  if (c && typeof c.getRandomValues === "function") {
    const buf = new Uint32Array(1);
    c.getRandomValues(buf);
    return buf[0]! / 2 ** 32;
  }
  return Math.random();
}

export function getRandomQuote(): Quote {
  const rand = randomUnit();

  const hackermouthQuotes = quotes.filter((q) => q.characterId === "hackermouth");
  const normalQuotes = quotes.filter((q) => q.characterId !== "hackermouth");

  const useHackermouth = rand < 0.2;

  let pool = useHackermouth ? hackermouthQuotes : normalQuotes;

  if (!pool.length) {
    pool = useHackermouth ? normalQuotes : hackermouthQuotes;
  }

  if (!pool.length) {
    pool = quotes;
  }

  const index = Math.floor(randomUnit() * pool.length);
  return pool[index]!;
}

/** Random line from Hackermouth-only quotes (e.g. hijack overlay). */
export function getRandomHackermouthQuote(): Quote | undefined {
  const hackermouthQuotes = quotes.filter(
    (q) => q.characterId === "hackermouth",
  );
  if (!hackermouthQuotes.length) return undefined;
  const index = Math.floor(randomUnit() * hackermouthQuotes.length);
  return hackermouthQuotes[index];
}
