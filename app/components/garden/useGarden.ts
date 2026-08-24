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

    const rawWinners = allAnimals.filter((animal: Animal) => {
      const probability = animal.base_rate * multiplier;
      return Math.random() < probability;
    });

    setAnimalsOnScreen((prev) => {
      const currentActive = prev.filter((a) => a.status === "active" || a.status === "entering");

      const survivingAnimals = currentActive.filter((activeAnimal) => rawWinners.some((winner) => winner.id === activeAnimal.id));

      const exitingAnimals = currentActive
        .filter((activeAnimal) => !rawWinners.some((winner) => winner.id === activeAnimal.id))
        .map((animal) => {
          const exitX = animal.x < 50 ? -15 : 115;
          return {
            ...animal,
            targetX: exitX,
            status: "walking-out" as const,
          };
        });

      const newlyEntering = rawWinners
        .filter((winner) => !currentActive.some((active) => active.id === winner.id))
        .map((animal) => {
          const startFromLeft = Math.random() < 0.5;
          const startX = startFromLeft ? -15 : 115;
          const startY = Math.random() * 60 + 20;

          const finalTargetX = Math.random() * 80 + 10;
          const finalTargetY = Math.random() * 60 + 20;

          return {
            ...animal,
            x: startX,
            y: startY,
            targetX: finalTargetX,
            targetY: finalTargetY,
            status: "entering" as const,
          };
        });

      return [...survivingAnimals, ...exitingAnimals, ...newlyEntering];
    });
  }, []);

  // 2分ごとにガチャを実行
  useEffect(() => {
    performGacha();
    const interval = setInterval(performGacha, 120000);
    return () => clearInterval(interval);
  }, [performGacha]);

  // 定期的な移動＆退場ロジック
  useEffect(() => {
    const walkInterval = setInterval(() => {
      setAnimalsOnScreen((prevAnimals) =>
        prevAnimals
          .map((animal) => {
            // 1. 入場中（entering）の動物：目標地点へ歩かせる、一定時間で active にする
            if (animal.status === "entering") {
              const step = 20; // 移動の滑らかさ
              const diffX = animal.targetX - animal.x;
              const diffY = animal.targetY - animal.y;

              const nextX = Math.abs(diffX) > step ? animal.x + (diffX > 0 ? step : -step) : animal.targetX;
              const nextY = Math.abs(diffY) > step ? animal.y + (diffY > 0 ? step : -step) : animal.targetY;

              const isArrived = nextX === animal.targetX && nextY === animal.targetY;

              return {
                ...animal,
                x: nextX,
                y: nextY,
                status: isArrived ? ("active" as const) : ("entering" as const),
              };
            }

            // 2. 退場中（walking-out）の動物の移動処理
            if (animal.status === "walking-out") {
              const step = 20;
              const diff = animal.targetX - animal.x;

              if (Math.abs(diff) <= step) {
                return {
                  ...animal,
                  x: animal.targetX,
                  status: "gone" as const,
                };
              }

              return {
                ...animal,
                x: animal.x + (diff > 0 ? step : -step),
              };
            }

            // 3. 通常時（active）のランダム歩行（entering や walking-out はここを通らない）
            const moveRange = 10;
            let newTargetX = animal.targetX + (Math.random() * (moveRange * 2) - moveRange);
            let newTargetY = animal.targetY + (Math.random() * (moveRange * 2) - moveRange);

            newTargetX = Math.max(5, Math.min(95, newTargetX));
            newTargetY = Math.max(10, Math.min(90, newTargetY));

            return {
              ...animal,
              x: animal.targetX,
              y: animal.targetY,
              targetX: newTargetX,
              targetY: newTargetY,
            };
          })
          .filter((animal) => animal.status !== "gone"),
      );
    }, 3000);

    return () => clearInterval(walkInterval);
  }, []);

  return { animalsOnScreen };
}
