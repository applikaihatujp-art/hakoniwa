"use client";

import { PlacedAnimal } from "./types";

type AnimalItemProps = {
  animal: PlacedAnimal;
};

export function AnimalItem({ animal }: AnimalItemProps) {
  const imageUrl = `https://njjyylfjcxfrockmqsuq.supabase.co/storage/v1/object/public/animal-images/${animal.image_url}`;

  // ステータスに応じて移動速度（秒数）を自動切り替え
  let transitionDuration = "3s"; // 通常のチョロチョロ移動
  if (animal.status === "entering") {
    transitionDuration = "15s"; // 入場時は少しゆったり（お好みで調整可能）
  } else if (animal.status === "walking-out") {
    transitionDuration = "12s"; // 退場時は画面外へしっかり歩かせる
  }

  return (
    <div
      style={{
        position: "absolute",
        left: `${animal.x}%`,
        top: `${animal.y}%`,
        transition: `left ${transitionDuration} ease-in-out, top ${transitionDuration} ease-in-out`,
        transform: "translate(-50%, -50%)",
        width: "90px",
        height: "90px",
        zIndex: 10,
        background: "transparent",
      }}
    >
      <img
        src={imageUrl}
        alt={animal.name}
        style={{
          width: "90px",
          height: "90px",
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
