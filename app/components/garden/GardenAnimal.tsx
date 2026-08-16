"use client";

import { useGarden } from "./useGarden";
import { AnimalItem } from "./AnimalItem";

export default function GardenAnimal() {
  const { animalsOnScreen } = useGarden();

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        // overflow: "hidden" だと右側で押しつぶされるため、clipに変更する
        overflow: "clip",
      }}
    >
      {animalsOnScreen.map((animal) => (
        <AnimalItem key={animal.id} animal={animal} />
      ))}
    </div>
  );
}
