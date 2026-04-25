export type CharacterTag =
  | "human"
  | "warrior"
  | "mystery"
  | "entity"
  | "spiritual"
  | "artifact"
  | "enemy"
  | "ally"
  | "unknown"
  | "legend"
  | "corrupt"
  | "observer";

export type ThreatLevel = "low" | "medium" | "high" | "unknown";

export type PresenceKind = "physical" | "digital" | "myth" | "unknown";

export type Character = {
  id: string;
  name: string;
  role: string;
  description: string;
  tags: CharacterTag[];
  image: string;
  faction?: string;
  threatLevel?: ThreatLevel;
  presence?: PresenceKind;
};

/** Archive roster: manuscript + expanded-saga + archive continuities. */
export const characters: Character[] = [
  {
    id: "exiled-lemon-monk",
    name: "The Exiled Lemon Monk",
    role: "Citrus heretic and Hongo Codex warden",
    description:
      "Banished for preserving too much memory; steadies Neo-Borinken with citrus wards, sanctuary spheres, and a blade that cuts corruption while preserving truth.",
    tags: ["human", "warrior", "spiritual", "legend", "ally", "mystery"],
    image: "/images/characters/exiled-lemon-monk.jpg",
    faction: "red-noodle-clan",
    threatLevel: "high",
    presence: "physical",
  },
  {
    id: "manus-neco",
    name: "Manus Neco",
    role: "The flat-footed astronaut",
    description:
      "Polymath borincano warrior—Cuatro and hidden blade, spacefaring grit, gratitude sharpened into revolution.",
    tags: ["human", "warrior", "legend", "mystery", "ally"],
    image: "/images/manus/manus-hero.png",
    faction: "red-noodle-clan",
    threatLevel: "high",
    presence: "physical",
  },
  {
    id: "vera-cordoba",
    name: "Vera Córdoba",
    role: "The voltage saint",
    description:
      "Street oracle wired into half the city’s grid; riddles, static, and the rail as confession booth.",
    tags: ["human", "mystery", "spiritual", "ally", "observer"],
    image: "/characters/placeholder-1.svg",
    faction: "neon-independents",
    threatLevel: "medium",
    presence: "digital",
  },
  {
    id: "tito-kaiju",
    name: "Tito Kaiju",
    role: "Rumble baron",
    description:
      "Old-soul brawler; laugh like thunder, debts like anchors across the sprawl.",
    tags: ["human", "warrior", "mystery"],
    image: "/characters/placeholder-2.svg",
    faction: "dockside-syndicate",
    threatLevel: "medium",
    presence: "physical",
  },
  {
    id: "la-mofongo",
    name: "La Mofongo",
    role: "Ghost chef",
    description:
      "Feeds the crew, buries the evidence; pressure and garlic as diplomacy.",
    tags: ["human", "ally", "warrior"],
    image: "/characters/placeholder-3.svg",
    faction: "red-noodle-clan",
    threatLevel: "low",
    presence: "physical",
  },
  {
    id: "dj-astro",
    name: "DJ Astro",
    role: "Pulse prophet",
    description:
      "Every set a battle map; bass law, treble mercy, crowd as constellation.",
    tags: ["human", "mystery", "ally", "observer"],
    image: "/characters/placeholder-4.svg",
    faction: "skywave-collective",
    threatLevel: "low",
    presence: "physical",
  },
  {
    id: "hackermouth",
    name: "Hackermouth",
    role: "Sentient surveillance",
    description:
      "Defensive intelligence in tape and signal—sees all, names all, ends all.",
    tags: ["entity", "enemy", "observer", "corrupt", "mystery", "unknown"],
    image: "/ui/hackermouth/hackermouth-core.png",
    threatLevel: "high",
    presence: "digital",
  },
  {
    id: "sifu-kinoko",
    name: "Sifu Kinoko",
    role: "Lily Pad patriarch",
    description:
      "Marionette sermons and Planet Weapons obsession—the cosmic theater calls it The Conflict.",
    tags: ["human", "enemy", "legend", "corrupt", "warrior", "spiritual"],
    image: "/characters/placeholder-1.svg",
    faction: "lily-pad-clan",
    threatLevel: "high",
    presence: "physical",
  },
  {
    id: "yulania-friz",
    name: "Yulania Friz",
    role: "Seductive tactician",
    description:
      "Cipher with the Neverminds; hunts the black for Manus and the darkened GRATS.",
    tags: ["human", "enemy", "mystery", "warrior"],
    image: "/characters/placeholder-1.svg",
    faction: "neverminds-faction",
    threatLevel: "high",
    presence: "physical",
  },
  {
    id: "gratitude-frogs-grats",
    name: "The GRATS",
    role: "Gratitude frogs elite",
    description:
      "Childhood blade-squad of Manus—protectors of the Central Socket until the handshake betrayed.",
    tags: ["ally", "legend", "warrior", "mystery", "human"],
    image: "/characters/placeholder-1.svg",
    faction: "red-noodle-clan",
    threatLevel: "high",
    presence: "physical",
  },
  {
    id: "shield-doncellas",
    name: "Shield Doncellas",
    role: "Maidens in red",
    description:
      "Red rice hats, Flor de Maga, scarfmasks—silent standoff in the People of Pisces.",
    tags: ["human", "warrior", "ally", "mystery"],
    image: "/characters/placeholder-1.svg",
    faction: "red-noodle-clan",
    threatLevel: "medium",
    presence: "physical",
  },
  {
    id: "the-exhumerator",
    name: "The Exhumerator",
    role: "Cloverleaf broker",
    description:
      "Watches from the balcony; three claps dismiss the Doncellas into red smoke.",
    tags: ["human", "mystery", "observer", "spiritual"],
    image: "/characters/placeholder-1.svg",
    faction: "people-of-pisces",
    threatLevel: "unknown",
    presence: "physical",
  },
  {
    id: "tonyo-byo",
    name: "Tonyo Byo",
    role: "Ocean Comets rider",
    description:
      "Frondeuring effigy of wrath; Citadels undone in the name of Tang Nia Obing’s memory.",
    tags: ["human", "warrior", "ally", "legend"],
    image: "/characters/placeholder-1.svg",
    faction: "red-noodle-clan",
    threatLevel: "high",
    presence: "physical",
  },
  {
    id: "saint-flamingo",
    name: "Saint Flamingo",
    role: "Flower City tyrant-in-frippery",
    description:
      "Rewarded Manus with Spada Virina—intent of tyranny met the purple-black blade’s temper.",
    tags: ["human", "enemy", "corrupt", "warrior", "spiritual"],
    image: "/characters/placeholder-1.svg",
    faction: "flower-city-court",
    threatLevel: "high",
    presence: "physical",
  },
  {
    id: "bloodless-visitor",
    name: "Bloodless Visitor",
    role: "Kumoyun rider",
    description:
      "Silver attire, blue poncho—gifts hope in porcelain, vanishes into cloud on stolen sky-tech.",
    tags: ["human", "mystery", "ally", "legend", "warrior"],
    image: "/characters/placeholder-1.svg",
    faction: "house-of-yabu",
    threatLevel: "unknown",
    presence: "physical",
  },
  {
    id: "azula-sabra",
    name: "Azula Sabra",
    role: "Venom 8 blade",
    description:
      "Warrior-for-hire with obsidian platypus bill and electric eyes; katana casual at the hip.",
    tags: ["human", "warrior", "enemy", "mystery"],
    image: "/characters/placeholder-1.svg",
    faction: "venom-8-clan",
    threatLevel: "high",
    presence: "physical",
  },
  {
    id: "koden-bushi-bloodflower",
    name: "Koden Bushi Bloodflower",
    role: "Bearer of the bleeding Cuatro",
    description:
      "White mask, red tracery—delivers a guitar case stamped with Lily Pad sigil and a heart still beating.",
    tags: ["human", "warrior", "ally", "mystery", "spiritual"],
    image: "/characters/placeholder-1.svg",
    faction: "red-noodle-clan",
    threatLevel: "high",
    presence: "physical",
  },
  {
    id: "perfect-abuelo",
    name: "Perfect Abuelo",
    role: "Blade-and-music ancestor",
    description:
      "Musicman warrior who taught young Manus bladecraft on the banquito—gone but strung into every chord.",
    tags: ["legend", "ally", "spiritual", "warrior", "human"],
    image: "/characters/placeholder-1.svg",
    faction: "red-noodle-clan",
    threatLevel: "low",
    presence: "myth",
  },
  {
    id: "sifu-bamboo",
    name: "Sifu Bamboo",
    role: "House of Yabu master",
    description:
      "Grin atop rubble; kismet braided with Kinoko—Planet Weapons make slaves of disciples.",
    tags: ["human", "warrior", "mystery", "enemy", "legend"],
    image: "/characters/placeholder-1.svg",
    faction: "house-of-yabu",
    threatLevel: "high",
    presence: "physical",
  },
  {
    id: "tang-nia-obing",
    name: "Tang Nia Obing",
    role: "Slain beauty of Bamboo Mountain",
    description:
      "Memory that steers Tonyo’s comet; Lily Pad sin carved into saga as loss, not footnote.",
    tags: ["legend", "mystery", "spiritual", "ally"],
    image: "/characters/placeholder-1.svg",
    faction: "red-noodle-clan",
    threatLevel: "unknown",
    presence: "myth",
  },
  {
    id: "neverminds",
    name: "The Neverminds",
    role: "Slayer-rocker hunt pack",
    description:
      "Yulania’s band in the black—noise as radar, vengeance as set list.",
    tags: ["enemy", "warrior", "mystery", "human"],
    image: "/characters/placeholder-1.svg",
    faction: "neverminds-faction",
    threatLevel: "high",
    presence: "physical",
  },
  {
    id: "sword-of-yindao",
    name: "Sword of Yindao",
    role: "Planet Weapon",
    description:
      "One of nine obsessions—edge that names itself in Combine Nine, Ascend Divine.",
    tags: ["artifact", "legend", "mystery", "enemy"],
    image: "/characters/placeholder-1.svg",
    faction: "lily-pad-clan",
    threatLevel: "high",
    presence: "myth",
  },
  {
    id: "spada-virina",
    name: "Spada Virina",
    role: "Purple-black Planet Weapon",
    description:
      "Coveted blade; ill-omened echoes; Manus’s lawless vex ends Saint Flamingo’s embryonic reign.",
    tags: ["artifact", "corrupt", "mystery", "enemy", "legend"],
    image: "/characters/placeholder-1.svg",
    faction: "flower-city-court",
    threatLevel: "high",
    presence: "myth",
  },
  {
    id: "people-of-pisces",
    name: "People of Pisces",
    role: "Musician’s sanctum",
    description:
      "Seven-story kauri nest—psychedelic tables, bounty board, incongruent melodies as shield.",
    tags: ["entity", "ally", "mystery", "spiritual"],
    image: "/characters/placeholder-1.svg",
    faction: "people-of-pisces",
    threatLevel: "low",
    presence: "physical",
  },
  {
    id: "lily-pad-clan",
    name: "The Lily Pad Clan (order)",
    role: "Cult across the citadels",
    description:
      "Doctrine, marionettes, nine citadels smashed—still a frequency in the smoke of Kakuno Asukal.",
    tags: ["entity", "enemy", "corrupt", "legend", "spiritual"],
    image: "/characters/placeholder-1.svg",
    faction: "lily-pad-clan",
    threatLevel: "high",
    presence: "myth",
  },
  {
    id: "red-noodle-clan",
    name: "Red Noodle Clan (banner)",
    role: "Cosmic borincano banner",
    description:
      "Long live the thread—Ocean Comets, socket ghosts, and gratitude ordnance.",
    tags: ["entity", "legend", "ally", "mystery"],
    image: "/characters/placeholder-1.svg",
    faction: "red-noodle-clan",
    threatLevel: "high",
    presence: "myth",
  },
  {
    id: "neon-independents",
    name: "Neon Independents",
    role: "Voltage bloc",
    description:
      "Grid saints and rail-touch oracles—law’s blind spot made habitable.",
    tags: ["entity", "ally", "mystery", "unknown"],
    image: "/characters/placeholder-1.svg",
    faction: "neon-independents",
    threatLevel: "medium",
    presence: "digital",
  },
  {
    id: "dockside-syndicate",
    name: "Dockside Syndicate",
    role: "Harbor combine",
    description:
      "Rust treaty and wet money—Tito’s laugh echoes off container scripture.",
    tags: ["entity", "ally", "corrupt", "mystery"],
    image: "/characters/placeholder-1.svg",
    faction: "dockside-syndicate",
    threatLevel: "medium",
    presence: "physical",
  },
  {
    id: "skywave-collective",
    name: "Skywave Collective",
    role: "Signal church",
    description:
      "Pulse prophets wiring mercy into waveform—DJ Astro’s denomination.",
    tags: ["entity", "ally", "mystery", "spiritual"],
    image: "/characters/placeholder-1.svg",
    faction: "skywave-collective",
    threatLevel: "low",
    presence: "digital",
  },
  {
    id: "venom-8-clan",
    name: "Venom 8 Clan",
    role: "Shadow cadre",
    description:
      "Exclusive training, neon slash jackets—Azula’s bill is a warning lamp.",
    tags: ["entity", "enemy", "mystery", "warrior"],
    image: "/characters/placeholder-1.svg",
    faction: "venom-8-clan",
    threatLevel: "high",
    presence: "physical",
  },
  {
    id: "grubbergelt-line",
    name: "Grubbergelt Skycraft",
    role: "Gold-gondola line",
    description:
      "Zeppelin departures humming above Pisces—luxury branded on the wind.",
    tags: ["entity", "unknown", "observer", "corrupt"],
    image: "/characters/placeholder-1.svg",
    faction: "grubbergelt-corp",
    threatLevel: "medium",
    presence: "physical",
  },
  {
    id: "the-jibaro",
    name: "The Jibaro",
    role: "Manus’s skycraft",
    description:
      "Vessel of return and repair—spacewalk fixes and hasty betrayals orbit its hull.",
    tags: ["artifact", "ally", "legend", "mystery"],
    image: "/characters/placeholder-1.svg",
    faction: "red-noodle-clan",
    threatLevel: "medium",
    presence: "physical",
  },
  {
    id: "piano-factory-maestro",
    name: "The Piano Factory Maestro",
    role: "Treacherous conductor",
    description:
      "Orchestrates the festive melody that welcomes Azula—sophistication as bait.",
    tags: ["human", "mystery", "corrupt", "observer"],
    image: "/characters/placeholder-1.svg",
    faction: "people-of-pisces",
    threatLevel: "medium",
    presence: "physical",
  },
  {
    id: "raziel-underwire",
    name: "Raziel Underwire",
    role: "The grid’s cough",
    description:
      "Not quite a person—copper throat, static favor owed by Vera, blue spark in the gutter.",
    tags: ["entity", "mystery", "ally", "observer", "unknown"],
    image: "/characters/placeholder-1.svg",
    faction: "neon-independents",
    threatLevel: "unknown",
    presence: "digital",
  },
  {
    id: "glass-lung-choir",
    name: "Glass Lung Choir",
    role: "Sub-factory acoustics",
    description:
      "Vent-shaft quartet without conductor—tourists hear jazz; initiates hear verdicts.",
    tags: ["entity", "mystery", "spiritual", "unknown"],
    image: "/characters/placeholder-1.svg",
    faction: "skywave-collective",
    threatLevel: "medium",
    presence: "myth",
  },
  {
    id: "socket-ghost",
    name: "The Socket Ghost",
    role: "Handshake pause",
    description:
      "Slept in protocols before the steal—breath between hello and betrayal.",
    tags: ["entity", "unknown", "mystery", "enemy", "observer"],
    image: "/characters/placeholder-1.svg",
    threatLevel: "high",
    presence: "digital",
  },
  {
    id: "salt-ring-enclave",
    name: "Salt Ring Enclave",
    role: "Brine treaty",
    description:
      "Smugglers and blade-saints behind blackout glass—garlic peel offerings return salt silence.",
    tags: ["entity", "ally", "mystery", "warrior"],
    image: "/characters/placeholder-1.svg",
    faction: "salt-ring-enclave",
    threatLevel: "medium",
    presence: "physical",
  },
  {
    id: "obsidian-parade",
    name: "The Obsidian Parade",
    role: "Unnamed column",
    description:
      "Assembles when red smoke clears—no hymn, only alignment; Kinoko’s strings remember older hands.",
    tags: ["unknown", "mystery", "enemy", "spiritual", "entity"],
    image: "/characters/placeholder-1.svg",
    threatLevel: "high",
    presence: "myth",
  },
  {
    id: "kumoyun-static-saint",
    name: "Kumoyun Static Saint",
    role: "Cycle contrail myth",
    description:
      "Almost-music left in the Bloodless Visitor’s wake—Venom 8 tattoos the frequency.",
    tags: ["legend", "mystery", "spiritual", "unknown"],
    image: "/characters/placeholder-1.svg",
    faction: "house-of-yabu",
    threatLevel: "unknown",
    presence: "myth",
  },
  {
    id: "folded-borough",
    name: "The Folded Borough",
    role: "Creased Flower City",
    description:
      "Alley that exists when you forget your name—echo-debt and borrowed shadows.",
    tags: ["entity", "mystery", "unknown", "spiritual"],
    image: "/characters/placeholder-1.svg",
    faction: "flower-city-court",
    threatLevel: "unknown",
    presence: "myth",
  },
  {
    id: "the-horizon",
    name: "The Horizon",
    role: "Silent witness",
    description:
      "Peer-to-peer seed that never lies—knows the name beneath flat feet and flat lies.",
    tags: ["unknown", "observer", "mystery", "spiritual"],
    image: "/characters/placeholder-1.svg",
    threatLevel: "unknown",
    presence: "myth",
  },
  {
    id: "the-city-grid",
    name: "The City Grid",
    role: "Living circuit",
    description:
      "Half the metropolis wired to oracle and rumor—touch the rail and pray.",
    tags: ["artifact", "entity", "mystery", "spiritual"],
    image: "/characters/placeholder-1.svg",
    faction: "neon-independents",
    threatLevel: "medium",
    presence: "digital",
  },
  {
    id: "off-world-whispers",
    name: "Off-World Whispers",
    role: "Rumor field",
    description:
      "Talk of stepping beyond and returning—exhaust that clings to the astronaut myth.",
    tags: ["legend", "mystery", "unknown", "observer"],
    image: "/characters/placeholder-1.svg",
    threatLevel: "unknown",
    presence: "myth",
  },
];

export function getSagaCharacterById(id: string): Character | undefined {
  return characters.find((c) => c.id === id);
}
