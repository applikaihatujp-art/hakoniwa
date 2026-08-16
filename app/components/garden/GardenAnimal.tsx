"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Animal = {
  id: string;
  name: string;
  image_url: string;
  base_rate: number;
};

type PlacedAnimal = Animal & {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
};

export default function Garden() {
  const [animalsOnScreen, setAnimalsOnScreen] = useState<PlacedAnimal[]>([]);

  const performGacha = async () => {
    const { data: allAnimals, error } = await supabase.from("animals").select("*");
    if (error || !allAnimals) return;

    const multiplier = 2.0;

    const winners: PlacedAnimal[] = allAnimals
      .filter((animal: Animal) => {
        const probability = animal.base_rate * multiplier;
        return Math.random() < probability;
      })
      .map((animal) => {
        const startX = Math.random() * 80 + 10;
        const startY = Math.random() * 60 + 20;
        return {
          ...animal,
          x: startX,
          y: startY,
          targetX: startX,
          targetY: startY,
        };
      });

    setAnimalsOnScreen(winners);
  };

  useEffect(() => {
    performGacha();
    const interval = setInterval(performGacha, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const walkInterval = setInterval(() => {
      setAnimalsOnScreen((prevAnimals) =>
        prevAnimals.map((animal) => {
          const moveRange = 3;
          let newTargetX = animal.targetX + (Math.random() * (moveRange * 2) - moveRange);
          let newTargetY = animal.targetY + (Math.random() * (moveRange * 2) - moveRange);

          newTargetX = Math.max(10, Math.min(90, newTargetX));
          newTargetY = Math.max(20, Math.min(80, newTargetY));

          return {
            ...animal,
            x: animal.targetX,
            y: animal.targetY,
            targetX: newTargetX,
            targetY: newTargetY,
          };
        }),
      );
    }, 3000);

    return () => clearInterval(walkInterval);
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {animalsOnScreen.map((animal) => (
        <div
          key={animal.id}
          style={{
            position: "absolute",
            left: `${animal.x}%`,
            top: `${animal.y}%`,
            transition: "all 2s ease-in-out",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          <img
            src={`https://njjyylfjcxfrockmqsuq.supabase.co/storage/v1/object/public/animal-images/${animal.image_url}`}
            alt={animal.name}
            style={{
              width: "60px",
              height: "60px",
              objectFit: "contain",
              display: "block",
              background: "transparent", // 背景を透明にする
            }}
            onError={(e) => {
              console.log("画像の読み込みに失敗しました:", animal.image_url);
            }}
          />
        </div>
      ))}
    </div>
  );
}
