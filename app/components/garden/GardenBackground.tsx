// components/garden/GardenBackground.tsx
"use client";

import { useTimeZone, TimeZone } from "../../hooks/garden/useTimeZone";

const timeZoneStyles: Record<TimeZone, { filter: string; overlayColor: string }> = {
  morning: { filter: "brightness(0.9) saturate(1.1)", overlayColor: "rgba(255, 200, 150, 0.15)" },
  day: { filter: "brightness(1) saturate(1)", overlayColor: "rgba(0, 0, 0, 0)" },
  evening: { filter: "brightness(0.88) sepia(0.2)", overlayColor: "rgba(255, 150, 50, 0.15)" },
  night: { filter: "brightness(0.85) saturate(0.95)", overlayColor: "rgba(30, 60, 120, 0.15)" },
};

export default function GardenBackground({ children }: { children: React.ReactNode }) {
  const timeZone = useTimeZone();
  const style = timeZoneStyles[timeZone];

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundImage: "url(/images/backgrounds/garden.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        filter: style.filter,
        transition: "filter 1s ease-in-out",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: style.overlayColor,
          pointerEvents: "none",
          transition: "background-color 1s ease-in-out",
          zIndex: 1,
        }}
      />
      <div style={{ position: "relative", zIndex: 2, width: "100%", height: "100%" }}>{children}</div>
    </div>
  );
}
