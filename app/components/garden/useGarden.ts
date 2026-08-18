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

      return [...survivingAnimals, ...exitingAnimals, ...newlyEntering];
    });
  }, []);

  // 入場してきた子を一定時間後に "active" にする（退場は移動ロジック側に任せる）
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimalsOnScreen((prev) => prev.map((animal) => (animal.status === "entering" ? { ...animal, status: "active" as const } : animal)));
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // 2分ごと（120000ms）にガチャを実行
  useEffect(() => {
    performGacha();
    const interval = setInterval(performGacha, 120000);
    return () => clearInterval(interval);
  }, [performGacha]);

  // 定期的な移動＆退場ロジック（一定速度で歩かせる）
  useEffect(() => {
    const walkInterval = setInterval(() => {
      setAnimalsOnScreen(
        (prevAnimals) =>
          prevAnimals
            .map((animal) => {
              // 退場中（walking-out）の動物の移動処理
              if (animal.status === "walking-out") {
                // 現在地から目標の画面外（targetX）へ一定のステップで近づける
                const step = 20; // 1回あたりの移動量（お好みで調整）
                const diff = animal.targetX - animal.x;

                if (Math.abs(diff) > step) {
                  return {
                    ...animal,
                    x: animal.x + (diff > 0 ? step : -step),
                  };
                } else {
                  // 完全に画面外に到達したら、配列から消すために特別なステータスにするか削除判定へ
                  return {
                    ...animal,
                    x: animal.targetX,
                    status: "gone" as const, // 画面外に到達したマーク
                  };
                }
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
            })
            .filter((animal) => animal.status !== "gone"), // 画面外に到達した子はここでキレイに削除！
      );
    }, 3000); // 3秒ごとに少しずつ歩かせる

    return () => clearInterval(walkInterval);
  }, []);

  return { animalsOnScreen };
}
