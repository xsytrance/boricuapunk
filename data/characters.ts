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
    image: "/images/hackermouth/hackermouth-user-photo.jpg",
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
    image: "/characters/manus-artwork-01.jpg",
    images: ["/images/manus/manus-hero.png", "/images/manus/manus-alt.png"],
    faction: "Red Noodle Clan",
    tag: "CLASSIFIED // WATCHER",
    stats: { grit: 9, mystery: 10, style: 8 },
  },
  {
    id: "koden-bushi-bloodflower",
    name: "Koden Bushi Bloodflower",
    title: "Storyteller of the Red Noodle Clan",
    description:
      "Vagrant narrator who swears to reunite scattered kin. Declares his name like a battle hymn and leads with the Unkept Blade when storms break.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "Red Noodle Clan",
    tag: "UNIFIER",
    stats: { resolve: 10, leadership: 9, ferocity: 8 },
  },
  {
    id: "yulania-friz",
    name: "Yulania Friz",
    title: "Disciple of Sifu Kinoko",
    description:
      "Golden-skinned slayer with chestnut coils, equal parts seduction and ruthlessness. Commands the Neverminds and wields the Shenmi Dagger with merciless precision.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "The Neverminds",
    tag: "UNPREDICTABLE",
    stats: { lethality: 10, charisma: 9, volatility: 9 },
  },
  {
    id: "tang-nia-obing",
    name: "Tang Nia Obing",
    title: "First Jatte Ren",
    description:
      "Rabbit-eared cyberhominid woman-at-arms, awakened from a coffin trunk into Hangetsu City chaos. A self-reliant fighter driven by instincts, visions, and survival.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "Red Noodle Clan",
    tag: "RECKONED DEAD // ALIVE",
    stats: { resilience: 9, instinct: 9, combat: 8 },
  },
  {
    id: "virina-brila",
    name: "Virina Brila",
    title: "The Coveted Blade",
    description:
      "Inky black-haired road synthesizer and modern flute-playing punk from Flower City. Haunted by a dream blade until her true form reveals a purple-black anomaly edge.",
    image: "/characters/placeholder-2.svg",
    images: ["/characters/placeholder-2.svg"],
    faction: "Flower City",
    tag: "SPADA ANOMALY",
    stats: { obsession: 10, aura: 9, anomaly: 10 },
  },
  {
    id: "oranga-danto",
    name: "Oranga Danto",
    title: "Head of State",
    description:
      "Elected handshaker who staged relief theatrics while Borincano suffered. His mocking skycraft spectacle marked him as a corrupt symbol of hollow governance.",
    image: "/characters/placeholder-3.svg",
    images: ["/characters/placeholder-3.svg"],
    faction: "Borincano State",
    tag: "CORRUPT OFFICE",
    stats: { propaganda: 9, compassion: 1, control: 8 },
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
  {
    id: "cacique-de-borinken",
    name: "Cacique de Borinken",
    title: "Leader of the Cacique",
    description:
      "Leader of the Cacique affiliated with The Cacique.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "The Cacique",
  },
  {
    id: "fajro-boza",
    name: "Fajro Boza",
    title: "Lion of Ponce",
    description:
      "Lion of Ponce affiliated with The Cacique.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "The Cacique",
  },
  {
    id: "hermes-davide-fastino-croatto-martinis",
    name: "Hermes Davide Fastino Croatto Martinis",
    title: "Composer",
    description:
      "Composer affiliated with The Piano Factory (Historical).",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "The Piano Factory (Historical)",
  },
  {
    id: "jeleo-fisoi",
    name: "Jeleo Fisoi",
    title: "GRAT",
    description:
      "GRAT affiliated with The GRATS.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "The GRATS",
  },
  {
    id: "ma-boyas",
    name: "Ma Boyas",
    title: "Death Zemi, The Conductor, Godhead of The Burndown",
    description:
      "Tall man, scars of a thousand wars. Crimson hat as wide as a setting sun. Pale hair. Armor reflects many battles. Wicked, ungodly charm, authoritative. Conducts the 88 virtuosos. Mysterious intent.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "The Piano Factory, Death Zemi",
    stats: {"items": 3},
  },
  {
    id: "ma-boyas---the-conductor",
    name: "Ma Boyas / The Conductor",
    title: "Death Zemi, Godhead of The Burndown",
    description:
      "Death Zemi, Godhead of The Burndown affiliated with The Piano Factory.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "The Piano Factory",
  },
  {
    id: "manus",
    name: "Manus",
    title: "Flat-footed Astronaut",
    description:
      "Flat-footed Astronaut affiliated with Borincano Warrior.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "Borincano Warrior",
  },
  {
    id: "mifeng-hachi",
    name: "Mifeng Hachi",
    title: "GRAT",
    description:
      "GRAT affiliated with The GRATS.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "The GRATS",
  },
  {
    id: "nalis-kurogisto",
    name: "Nalis Kurogisto",
    title: "GRAT",
    description:
      "GRAT affiliated with The GRATS.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "The GRATS",
  },
  {
    id: "nokto-bufo",
    name: "Nokto Bufo",
    title: "GRAT",
    description:
      "GRAT affiliated with The GRATS.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "The GRATS",
  },
  {
    id: "occhi",
    name: "Occhi",
    title: "GRAT",
    description:
      "GRAT affiliated with The GRATS.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "The GRATS",
  },
  {
    id: "occhi-spettrali---the-black-ghost",
    name: "Occhi Spettrali / The Black Ghost",
    title: "Investigator, GRAT",
    description:
      "Investigator, GRAT affiliated with The GRATS.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "The GRATS",
  },
  {
    id: "octopus-ninja",
    name: "Octopus Ninja",
    title: "Assassin",
    description:
      "Assassin affiliated with Venom 8 Clan.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "Venom 8 Clan",
  },
  {
    id: "perfect-abuelo",
    name: "Perfect Abuelo",
    title: "Manus' Grandfather, Mentor",
    description:
      "Manus' Grandfather, Mentor affiliated with Manus' Family.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "Manus' Family",
  },
  {
    id: "rano-blua",
    name: "Rano Blua",
    title: "Investigator, GRAT",
    description:
      "Investigator, GRAT affiliated with The GRATS.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "The GRATS",
  },
  {
    id: "roronoa-zoro",
    name: "Roronoa Zoro",
    title: "Unknown",
    description:
      "Tall, heavily muscular young man with short moss-green hair, stern eyes, and a prominent scar over his left eye (kept closed after the timeskip). Usually wears haramaki and carries three swords at his waist, often with a white bandana tied on his left arm until serious battle. Stoic, fiercely dis...",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "Unknown",
    stats: {"items": 6},
  },
  {
    id: "saint-flamingo",
    name: "Saint Flamingo",
    title: "Queer Queen",
    description:
      "Queer Queen affiliated with Disco Patriots.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "Disco Patriots",
  },
  {
    id: "tang-nia-obing---kuniklo-senmorta",
    name: "Tang Nia Obing / Kuniklo Senmorta",
    title: "Sovereign of Rabbit Kings",
    description:
      "Sovereign of Rabbit Kings affiliated with The Rabbit Kings.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "The Rabbit Kings",
  },
  {
    id: "the-exhumerator---roz-kolora",
    name: "The Exhumerator / Roz Kolora",
    title: "Leader of Shield Doncellas, Warrior",
    description:
      "Leader of Shield Doncellas, Warrior affiliated with Shield Doncellas, GRATS.",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "Shield Doncellas, GRATS",
  },
  {
    id: "the-heart-searcher",
    name: "The Heart Searcher",
    title: "Vengeful Specter",
    description:
      "Vengeful Specter affiliated with The Burndown (Roz Kolora).",
    image: "/characters/placeholder-1.svg",
    images: ["/characters/placeholder-1.svg"],
    faction: "The Burndown (Roz Kolora)",
  },
];

export function getCharacterById(id: string): Character | undefined {
  return (
    characters.find((c) => c.id === id) ??
    hiddenCharacters.find((c) => c.id === id)
  );
}
