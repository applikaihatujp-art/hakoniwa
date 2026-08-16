"use client";

import { PlacedAnimal } from "./types";

type AnimalItemProps = {
  animal: PlacedAnimal;
};

export function AnimalItem({ animal }: AnimalItemProps) {
  const imageUrl = `https://njjyylfjcxfrockmqsuq.supabase.co/storage/v1/object/public/animal-images/${animal.image_url}`;

  return (
    <div
      style={{
        position: "absolute",
        left: `${animal.x}%`,
        top: `${animal.y}%`,
        transition: "all 2s ease-in-out",
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        background: "transparent",
      }}
    >
      <img
        src={imageUrl}
        alt={animal.name}
        style={{
          width: "60px",
          height: "60px",
          objectFit: "contain",
          display: "block",
        }}
        onError={() => {
          console.log("画像の読み込みに失敗しました:", animal.image_url);
        }}
      />
    </div>
  );
}
