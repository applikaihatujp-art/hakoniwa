// app/page.tsx
"use client";

import GardenBackground from "../components/garden/GardenBackground";
import GardenAnimal from "../components/garden/GardenAnimal";
import WeatherBox from "../components/garden/WeatherBox";

export default function GardenPage() {
  return (
    <GardenBackground>
      <WeatherBox />
      <GardenAnimal />
    </GardenBackground>
  );
}
