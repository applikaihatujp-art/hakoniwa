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

    // 1. 今いる動物たちを「画面の外へ歩いて退場する (walking-out)」状態にする
    setAnimalsOnScreen((prev) =>
      prev.map((animal) => {
        // 現在地から一番近い左右どちらかの画面外（例: -10% または 110%）を退場先に決定
        const exitX = animal.x < 50 ? -15 : 115;
        return {
          ...animal,
          targetX: exitX, // 画面外に向かわせる
          status: "walking-out" as const,
        };
      }),
    );

    // 2. 約8秒〜10秒かけて外へ歩かせてから、完全に消して新しいメンバーを入場させる
    setTimeout(() => {
      const winners: PlacedAnimal[] = allAnimals
        .filter((animal: Animal) => {
          const probability = animal.base_rate * multiplier;
          return Math.random() < probability;
        })
        .map((animal) => {
          // 入場時はあえて画面の外（例: 左右のどちらか）からスタートさせる
          const startFromLeft = Math.random() < 0.5;
          const startX = startFromLeft ? -15 : 115;
          const startY = Math.random() * 60 + 20;

          // 最終的に落ち着く庭の中のランダムな目標地点
          const finalTargetX = Math.random() * 80 + 10;
          const finalTargetY = Math.random() * 60 + 20;

          return {
            ...animal,
            x: startX,
            y: startY,
            targetX: finalTargetX, // 最終地点へ向かわせる
            targetY: finalTargetY,
            status: "entering" as const,
          };
        });

      setAnimalsOnScreen(winners);

      // 3. 入場してきた子がしばらく歩いて定着したら "active" にする
      setTimeout(() => {
        setAnimalsOnScreen((prev) => prev.map((animal) => ({ ...animal, status: "active" as const })));
      }, 4000); // 入場に4秒くらいかける
    }, 8000); // 8秒かけて外へ歩かせる
  }, []);

  // 2分ごと（120000ms）にガチャを実行
  useEffect(() => {
    performGacha();
    const interval = setInterval(performGacha, 120000);
    return () => clearInterval(interval);
  }, [performGacha]);

  // 3秒ごとの移動ロジック
  useEffect(() => {
    const walkInterval = setInterval(() => {
      setAnimalsOnScreen((prevAnimals) =>
        prevAnimals.map((animal) => {
          // 退場中（walking-out）の動物は、自分で設定した画面外の targetX に向かって歩き続けるので、
          // ランダムウォークの処理はスキップしてそのままの位置・ターゲットを維持させる
          if (animal.status === "walking-out") {
            return {
              ...animal,
              x: animal.targetX, // 一気に、あるいはtransitionで滑らかに外へ
              y: animal.targetY,
            };
          }

          // 通常時（active）または入場中（entering）のランダム歩行
          const moveRange = 7;
          let newTargetX = animal.targetX + (Math.random() * (moveRange * 2) - moveRange);
          let newTargetY = animal.targetY + (Math.random() * (moveRange * 2) - moveRange);

          // 入場中の子は庭の中（10〜90%）にしっかり収まるように制限
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
