"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Animal = {
  id: string;
  name: string;
  image_url: string;
  base_rate: number;
};

// 位置情報と、現在地・目標地を持つ型
type PlacedAnimal = Animal & {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
};

export default function Garden() {
  const [animalsOnScreen, setAnimalsOnScreen] = useState<PlacedAnimal[]>([]);

  // 抽選関数
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

  // 初回実行と1分ごとのガチャ
  useEffect(() => {
    performGacha();
    const interval = setInterval(performGacha, 60000);
    return () => clearInterval(interval);
  }, []);

  // 动物たちがちょこちょこ歩く（あまり長い距離動かない）ためのタイマー
  useEffect(() => {
    const walkInterval = setInterval(() => {
      setAnimalsOnScreen((prevAnimals) =>
        prevAnimals.map((animal) => {
          // 現在地から「±3%」以内のごく近い距離を次の目的地にする
          const moveRange = 3;
          let newTargetX = animal.targetX + (Math.random() * (moveRange * 2) - moveRange);
          let newTargetY = animal.targetY + (Math.random() * (moveRange * 2) - moveRange);

          // 画面外に行き過ぎないように制限（端から10%〜90%の範囲に収める）
          newTargetX = Math.max(10, Math.min(90, newTargetX));
          newTargetY = Math.max(20, Math.min(80, newTargetY));

          return {
            ...animal,
            x: animal.targetX, // 実際に位置を更新
            y: animal.targetY,
            targetX: newTargetX, // 次の目的地を更新
            targetY: newTargetY,
          };
        }),
      );
    }, 3000); // 3秒ごとにちょこちょこ移動

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
            fontSize: "40px",
            // 2秒かけてゆっくり滑らかに移動させる
            transition: "all 2s ease-in-out",
          }}
        >
          {animal.image_url}
        </div>
      ))}
    </div>
  );
}
