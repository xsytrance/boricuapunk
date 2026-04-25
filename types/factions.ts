export type FactionAlignment = "ally" | "enemy" | "neutral" | "unknown";

export type Faction = {
  id: string;
  name: string;
  description: string;
  alignment: FactionAlignment;
};

export const factions: Faction[] = [
  {
    id: "red-noodle-clan",
    name: "Red Noodle Clan",
    description:
      "Legacy warriors of the cosmic borincano thread—Ocean Comets, hidden blades, and gratitude as ordnance.",
    alignment: "ally",
  },
  {
    id: "lily-pad-clan",
    name: "The Lily Pad Clan",
    description:
      "Sifu Kinoko’s doctrine across Enneatic Citadels: Combine Nine, Ascend Divine—obsession dressed as scripture.",
    alignment: "enemy",
  },
  {
    id: "neon-independents",
    name: "Neon Independents",
    description:
      "Grid-fringe operators and oracles; half in light, half in law’s blind spot.",
    alignment: "neutral",
  },
  {
    id: "dockside-syndicate",
    name: "Dockside Syndicate",
    description:
      "Harbor teeth and ledger ghosts; debts pull harder than tides in Old San Juan sprawl.",
    alignment: "neutral",
  },
  {
    id: "skywave-collective",
    name: "Skywave Collective",
    description:
      "Pulse prophets and signal clergy—bass as statute, treble as absolution.",
    alignment: "ally",
  },
  {
    id: "venom-8-clan",
    name: "Venom 8 Clan",
    description:
      "Shadow-forged sellsword cadre; neon-gold slash marks and katana quiet.",
    alignment: "unknown",
  },
  {
    id: "grubbergelt-corp",
    name: "Grubbergelt",
    description:
      "Zeppelin-skycraft luxury with a gold-plated gondola—commerce above the meadows.",
    alignment: "unknown",
  },
  {
    id: "salt-ring-enclave",
    name: "Salt Ring Enclave",
    description:
      "Dockside treaty carved in rust: brine, blackout glass, and blades blessed by silence.",
    alignment: "neutral",
  },
  {
    id: "house-of-yabu",
    name: "House of Yabu",
    description:
      "Sifu Bamboo’s divine build—scattered now, still humming astrological kismet.",
    alignment: "unknown",
  },
  {
    id: "neverminds-faction",
    name: "The Neverminds",
    description:
      "Yulania Friz’s slayer-rockers—hunting the black for Manus and the GRATS.",
    alignment: "enemy",
  },
  {
    id: "people-of-pisces",
    name: "People of Pisces",
    description:
      "Seven-story kauri ale-joint and musician’s nest—runes, gigs, and the cloverleaf dark.",
    alignment: "neutral",
  },
  {
    id: "flower-city-court",
    name: "Flower City Interests",
    description:
      "Neon parasols and tyrants in frippery—where Spada Virina changes hands in blood.",
    alignment: "unknown",
  },
];

export function getFactionById(id: string): Faction | undefined {
  const normalized = id.trim().toLowerCase();
  return factions.find(
    (f) =>
      f.id === id ||
      f.id.toLowerCase() === normalized ||
      f.name.toLowerCase() === normalized,
  );
}
