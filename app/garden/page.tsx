"use client";

import GardenAnimal from "../components/garden/GardenAnimal";
import WeatherBox from "../components/garden/WeatherBox";

export default function GardenPage() {
  return (
    <main
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundImage: "url(/images/backgrounds/garden.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        margin: 0,
        fontFamily: "sans-serif",
      }}
    >
      {/* 🌤️ お天気ウィジェット */}
      <WeatherBox />

      {/* 🐇 うさぎコンポーネント */}
      <GardenAnimal />
    </main>
  );
}
