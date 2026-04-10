export type QuoteStyle = "streetfighter" | "graffiti";

export type Quote = {
  id: string;
  characterId: string;
  text: string;
  style: QuoteStyle;
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
