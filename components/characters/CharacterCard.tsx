"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import type { Character } from "@/types/characters";

const FALLBACK_IMAGE = "/characters/placeholder.png";

export type CharacterCardProps = {
  character: Character;
};

export default function CharacterCard({ character }: CharacterCardProps) {
  const [src, setSrc] = useState(character.image);

  const onError = useCallback(() => {
    setSrc((current) => (current === FALLBACK_IMAGE ? current : FALLBACK_IMAGE));
  }, []);

  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        padding: "0.75rem",
        borderRadius: "6px",
        border: "1px solid #333",
        background: "#0a0a0a",
        color: "#e5e5e5",
        fontFamily: "system-ui, sans-serif",
        fontSize: "14px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 / 4",
          overflow: "hidden",
          borderRadius: "4px",
          background: "#111",
        }}
      >
        <Image
          src={src}
          alt={character.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          style={{ objectFit: "cover" }}
          onError={onError}
          unoptimized
        />
      </div>
      <div style={{ fontWeight: 600 }}>{character.name}</div>
      <div style={{ fontSize: "12px", color: "#a3a3a3" }}>{character.role}</div>
    </article>
  );
}
