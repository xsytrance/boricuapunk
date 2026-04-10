export type CharacterStats = Record<string, string | number>;

export type CharacterVisual = {
  primary: string;
  gallery: string[];
};

export type Character = {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  faction: string;
  stats?: CharacterStats;
  /** Optional status or tag line shown on profile */
  tag?: string;
  /** Optional curated art paths (e.g. PNG hero + gallery) */
  visual?: CharacterVisual;
};

/** Not listed in grid / featured; used for quotes & lookups only */
export const hiddenCharacters: Character[] = [
  {
    id: "hackermouth",
    name: "Hackermouth",
    title: "Sentient Surveillance System",
    description:
      "A self-aware defensive intelligence manifesting through tape, screens, and signal.",
    faction: "Unknown",
    image: "/ui/hackermouth/hackermouth-core.png",
    images: [],
  },
];

export const characters: Character[] = [
  {
    id: "manus-neco",
    name: "Manus Neco",
    title: "The Flat-Footed Astronaut",
    description:
      "A dark, mysterious anti-hero who walks the neon alleys like they were launch pads. Rumored to have stepped off-world and returned with nothing but grit and a vendetta. The Red Noodle Clan does not forget his name.",
    visual: {
      primary: "/images/manus/manus-hero.png",
      gallery: ["/images/manus/manus-alt.png"],
    },
    image: "/images/manus/manus-hero.png",
    images: ["/images/manus/manus-hero.png", "/images/manus/manus-alt.png"],
    faction: "Red Noodle Clan",
    tag: "CLASSIFIED // WATCHER",
    stats: { grit: 9, mystery: 10, style: 8 },
  },
  {
    id: "vera-cordoba",
    name: "Vera Córdoba",
    title: "The Voltage Saint",
    description:
      "Street oracle wired into half the city’s grid. Speaks in riddles and static. Placeholder dossier—full saga entry pending.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "Neon Independents",
    tag: "DATA FRAGMENT",
  },
  {
    id: "tito-kaiju",
    name: "Tito Kaiju",
    title: "Rumble Baron",
    description:
      "Old-soul brawler with a laugh like thunder. Owes debts all over Old San Juan sprawl. Placeholder dossier.",
    image: "/characters/placeholder-2.svg",
    images: ["/characters/placeholder-2.svg"],
    faction: "Dockside Syndicate",
  },
  {
    id: "la-mofongo",
    name: "La Mofongo",
    title: "Ghost Chef",
    description:
      "Feeds the crew and buries the evidence. Knife skills and street cred in equal measure. Placeholder dossier.",
    image: "/characters/placeholder-3.svg",
    images: ["/characters/placeholder-3.svg"],
    faction: "Red Noodle Clan",
    tag: "SUPPORT UNIT",
  },
  {
    id: "dj-astro",
    name: "DJ Astro",
    title: "Pulse Prophet",
    description:
      "Every set is a battle map. Every drop, a signal flare. Placeholder dossier.",
    image: "/characters/placeholder-4.svg",
    images: ["/characters/placeholder-4.svg"],
    faction: "Skywave Collective",
    tag: "AUDIO THREAT",
  },
];

export function getCharacterById(id: string): Character | undefined {
  return (
    characters.find((c) => c.id === id) ??
    hiddenCharacters.find((c) => c.id === id)
  );
}
