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

    // 1. 今回のガチャで当選するメンバーを計算
    const rawWinners = allAnimals.filter((animal: Animal) => {
      const probability = animal.base_rate * multiplier;
      return Math.random() < probability;
    });

    setAnimalsOnScreen((prev) => {
      // 2. 現在画面にいる「アクティブ（active）」な子たちを取得
      const currentActive = prev.filter((a) => a.status === "active");

      // 3. 引き続き当選した子は、退場させずにそのまま残す（surviving）
      const survivingAnimals = currentActive.filter((activeAnimal) => rawWinners.some((winner) => winner.id === activeAnimal.id));

      // 4. 外れてしまった子は、画面外へ歩かせて退場（walking-out）させる
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

      // 5. 新しく当選した子（今までいなかった子）だけを入場（entering）させる
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

      // 画面に残る子、去る子、新しく入る子を同時に存在させる（重複IDが発生しないためエラーが起きません）
      return [...survivingAnimals, ...exitingAnimals, ...newlyEntering];
    });

    // 6. 8秒かけて退場しきった子を消し、入場してきた子を "active" にする
    setTimeout(() => {
      setAnimalsOnScreen((prev) =>
        prev
          .filter((animal) => animal.status !== "walking-out") // 退場し終えた子を削除
          .map((animal) => (animal.status === "entering" ? { ...animal, status: "active" as const } : animal)),
      );
    }, 20000); // 8秒間
  }, []);

  // 2分ごと（120000ms）にガチャを実行
  useEffect(() => {
    performGacha();
    const interval = setInterval(performGacha, 120000);
    return () => clearInterval(interval);
  }, [performGacha]);

  // 定期的な移動ロジック
  useEffect(() => {
    const walkInterval = setInterval(() => {
      setAnimalsOnScreen((prevAnimals) =>
        prevAnimals.map((animal) => {
          // 退場中（walking-out）の動物は画面外の targetX に向かわせるためスキップ
          if (animal.status === "walking-out") {
            return animal;
          }

          // 通常時（active）または入場中（entering）のランダム歩行
          const moveRange = 7;
          let newTargetX = animal.targetX + (Math.random() * (moveRange * 2) - moveRange);
          let newTargetY = animal.targetY + (Math.random() * (moveRange * 2) - moveRange);

          // 庭の中にしっかり収まるように制限
          newTargetX = Math.max(5, Math.min(95, newTargetX));
          newTargetY = Math.max(10, Math.min(90, newTargetY));

          return {
            ...animal,
            x: animal.targetX,
            y: animal.targetY,
            targetX: newTargetX,
            targetY: newTargetY,
          };
        }),
      );
    }, 10000);

    return () => clearInterval(walkInterval);
  }, []);

  return { animalsOnScreen };
}
