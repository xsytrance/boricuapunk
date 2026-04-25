export type PublicComic = {
  slug: string;
  title: string;
  issue: string;
  summary: string;
  image: string;
  characterSlug: string;
  characterName: string;
  ctaLabel: string;
};

export type PublicCharacter = {
  slug: string;
  name: string;
  title: string;
  role: string;
  faction: string;
  tag: string;
  image: string;
  summary: string;
  biography: string[];
  stats: Record<string, string | number>;
  comicSlugs: string[];
};

export const publicComics: PublicComic[] = [
  {
    slug: "exiled-lemon-monk",
    title: "The Exiled Lemon Monk // Memory Flood",
    issue: "Signal Issue 01",
    summary:
      "During the ancestral flood in Neo-Borinken, the Exiled Lemon Monk raises citrus sanctuaries and cuts corruption away from memory without harming the truth inside it.",
    image: "/images/characters/exiled-lemon-monk.jpg",
    characterSlug: "exiled-lemon-monk",
    characterName: "The Exiled Lemon Monk",
    ctaLabel: "Open signal issue",
  },
];

export const publicCharacters: PublicCharacter[] = [
  {
    slug: "exiled-lemon-monk",
    name: "The Exiled Lemon Monk",
    title: "Citrus Heretic // Keeper of the Hongo Codex",
    role: "Memory warden cast out for refusing silence",
    faction: "Red Noodle Clan",
    tag: "FIRST DOSSIER // ACTIVE",
    image: "/images/characters/exiled-lemon-monk.jpg",
    summary:
      "Banished from the Rain Circuit for preserving too much memory, he now stands between Neo-Borinken and the violent flood of ancestral data unleashed by the Hongo Codex.",
    biography: [
      "The books name him clearly in RAIN CIRCUIT: the Exiled Lemon Monk rises during the memory flood with citrus relics shining like suns in rain.",
      "He was banished for preserving too much memory and for refusing to let the Hongo Codex remain sealed. That exile became his authority, not his shame.",
      "When corruption twists memory into a weapon, the Lemon Monk answers with citrus wards, sanctuary spheres, and a blade that peels lies away while preserving the truth beneath them.",
    ],
    stats: {
      wardcraft: 10,
      memory: 10,
      mercy: 8,
      threat: "high",
    },
    comicSlugs: ["exiled-lemon-monk"],
  },
];

export function getPublicCharacterBySlug(slug: string): PublicCharacter | undefined {
  return publicCharacters.find((character) => character.slug === slug);
}

export function getPublicComicBySlug(slug: string): PublicComic | undefined {
  return publicComics.find((comic) => comic.slug === slug);
}

export function getComicsForCharacter(characterSlug: string): PublicComic[] {
  return publicComics.filter((comic) => comic.characterSlug === characterSlug);
}
