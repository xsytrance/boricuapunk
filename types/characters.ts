export type CharacterTag =
  | "primary"
  | "secondary"
  | "implied"
  | "mystery"
  | "artifact"
  | "enemy"
  | "ally"
  | "spiritual"
  | "system"
  | "environment"
  | "weapon"
  | "leader"
  | "mentor"
  | "warrior";

export type Character = {
  id: string;
  name: string;
  role: string;
  description: string;
  tags: CharacterTag[];
  image: string;
};

export const characters: Character[] = [
  {
    id: "yindao",
    name: "Yindao",
    role: "Blade Master",
    description: "A disciplined warrior bound by honor and precision.",
    tags: ["primary", "warrior", "weapon"],
    image: "/characters/yindao.png",
  },
  {
    id: "red-noodle-clan",
    name: "Red Noodle Clan",
    role: "Faction",
    description: "A legacy-driven clan rooted in discipline and ritual.",
    tags: ["primary", "system", "ally"],
    image: "/characters/clan.png",
  },
  {
    id: "clan-warriors",
    name: "Clan Warriors",
    role: "Unit",
    description: "Trained fighters loyal to the clan’s code.",
    tags: ["secondary", "ally"],
    image: "/characters/warriors.png",
  },
  {
    id: "enemy-forces",
    name: "Enemy Forces",
    role: "Opposition",
    description: "Unknown adversaries threatening the balance.",
    tags: ["secondary", "enemy"],
    image: "/characters/enemies.png",
  },
  {
    id: "sword-of-yindao",
    name: "Sword of Yindao",
    role: "Artifact",
    description: "A precise, possibly sentient blade tied to Yindao’s fate.",
    tags: ["implied", "artifact", "weapon", "mystery"],
    image: "/characters/sword.png",
  },
  {
    id: "ancestors",
    name: "The Ancestors",
    role: "Spiritual Watchers",
    description: "Silent overseers guiding the clan from beyond.",
    tags: ["implied", "spiritual", "mystery"],
    image: "/characters/ancestors.png",
  },
  {
    id: "unseen-teacher",
    name: "The Unseen Teacher",
    role: "Mentor",
    description: "A hidden influence shaping Yindao’s path.",
    tags: ["implied", "mentor", "mystery"],
    image: "/characters/teacher.png",
  },
  {
    id: "enemy-leader",
    name: "Enemy Leader",
    role: "Antagonist",
    description: "An unknown strategist behind opposing forces.",
    tags: ["implied", "enemy", "leader", "mystery"],
    image: "/characters/enemy-leader.png",
  },
  {
    id: "the-code",
    name: "The Code",
    role: "Philosophy",
    description: "The governing law of discipline and action.",
    tags: ["system", "mystery"],
    image: "/characters/code.png",
  },
  {
    id: "battlefield",
    name: "The Battlefield",
    role: "Environment",
    description: "A reactive arena where conflict unfolds.",
    tags: ["environment"],
    image: "/characters/battlefield.png",
  },
];
export const characterBehavior = {
    mystery: {
      className: "opacity-60 blur-[1px]",
      messagePool: [
        "…YOU SHOULD NOT SEE THIS ONE.",
        "THIS PRESENCE IS NOT MEANT FOR YOU.",
      ],
    },
    artifact: {
      className: "glow-artifact",
      messagePool: [
        "THE OBJECT REMEMBERS.",
        "DO NOT TOUCH THE RELIC.",
      ],
    },
    enemy: {
      className: "glitch-enemy",
      messagePool: [
        "THREAT DETECTED.",
        "HOSTILE SIGNAL.",
      ],
    },
    spiritual: {
      className: "fade-spiritual",
      messagePool: [
        "…THEY ARE WATCHING.",
        "LISTEN CLOSELY.",
      ],
    },
  };