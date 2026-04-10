"use client";

import { characters } from "@/types/characters";
import CharacterCard from "./CharacterCard";

export default function CharacterGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "1rem",
        width: "100%",
      }}
    >
      {characters.map((c) => (
        <CharacterCard key={c.id} character={c} />
      ))}
    </div>
  );
}
