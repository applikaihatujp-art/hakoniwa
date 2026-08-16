"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Animal, PlacedAnimal } from "./types";

export function useGarden() {
  const [animalsOnScreen, setAnimalsOnScreen] = useState<PlacedAnimal[]>([]);

  const performGacha = useCallback(async () => {
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
  }, []);

  // 初回および60秒ごとのガチャ実行
  useEffect(() => {
    performGacha();
    const interval = setInterval(performGacha, 60000);
    return () => clearInterval(interval);
  }, [performGacha]);

  // 3秒ごとの移動ロジック
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

  return { animalsOnScreen };
}
