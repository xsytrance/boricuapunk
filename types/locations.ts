export type LocationNode = {
  slug: string;
  name: string;
  role: string;
  faction: string;
  factionId?: string;
  note: string;
  links: string[];
};

export const locations: LocationNode[] = [
  {
    slug: "flower-city",
    name: "Flower City",
    role: "Primary cityscape",
    faction: "Flower City Interests",
    factionId: "flower-city-court",
    note: "A neon-parasol power zone where elegance and cruelty share the same hallway.",
    links: ["/lore", "/factions"],
  },
  {
    slug: "people-of-pisces",
    name: "People of Pisces",
    role: "Seven-story ale joint",
    faction: "People of Pisces",
    factionId: "people-of-pisces",
    note: "A musician’s nest, a board for gigs, and one of the saga’s most memorable meeting grounds.",
    links: ["/characters", "/logs"],
  },
  {
    slug: "central-socket",
    name: "Central Socket",
    role: "Mythic infrastructure",
    faction: "Red Noodle Clan",
    factionId: "red-noodle-clan",
    note: "The stolen heart of the archive’s tech mythology—where betrayal and protocol overlap.",
    links: ["/lore", "/logs"],
  },
  {
    slug: "piano-factory",
    name: "Piano Factory",
    role: "Acoustic power plant",
    faction: "Skywave Collective",
    factionId: "skywave-collective",
    note: "Ventilation, jazz, and judgment. The building itself feels like an instrument with a memory.",
    links: ["/lore", "/factions"],
  },
  {
    slug: "salt-ring-enclave",
    name: "Salt Ring Enclave",
    role: "Dockside treaty zone",
    faction: "Salt Ring Enclave",
    factionId: "salt-ring-enclave",
    note: "Brine, rust, silence, and blacked-out windows—where bargains last longer than names.",
    links: ["/factions", "/logs"],
  },
  {
    slug: "bamboo-mountain",
    name: "Bamboo Mountain",
    role: "Kismet ridge",
    faction: "House of Yabu",
    factionId: "house-of-yabu",
    note: "A stage for ancestral power, grief, and the kind of lineage that changes your hand on the weapon.",
    links: ["/lore", "/characters"],
  },
  {
    slug: "boricuapunk-archive",
    name: "Boricuapunk Archive",
    role: "Living dossier system",
    faction: "Red Noodle Clan",
    factionId: "red-noodle-clan",
    note: "The site’s own in-world frame: not a museum, but an active archive under construction.",
    links: ["/archive", "/about"],
  },
  {
    slug: "old-san-juan-sprawl",
    name: "Old San Juan Sprawl",
    role: "Harbor network",
    faction: "Dockside Syndicate",
    factionId: "dockside-syndicate",
    note: "Debts travel fast here. Tides do the accounting.",
    links: ["/factions", "/characters"],
  },
  {
    slug: "jibaro-dock-and-launch-arc",
    name: "Jibaro Dock & Launch Arc",
    role: "Skycraft origin site",
    faction: "Red Noodle Clan",
    factionId: "red-noodle-clan",
    note: "The natural place to think about the Jibaro, its repairs, and the ship’s place in the archive’s motion.",
    links: ["/ships", "/timeline", "/relationships"],
  },
];

export function getLocationBySlug(slug: string): LocationNode | undefined {
  return locations.find((location) => location.slug === slug);
}