"use client";

import { useState, useEffect } from "react";

export default function Rabbit() {
  const [position, setPosition] = useState({ x: 200, y: 400 });
  const [emoji] = useState("🐇");

  useEffect(() => {
    const animalInterval = setInterval(() => {
      const randomX = Math.random() * (window.innerWidth - 100);
      const randomY = window.innerHeight * 0.5 + Math.random() * (window.innerHeight * 0.3);
      setPosition({ x: randomX, y: randomY });
    }, 3000);

    return () => clearInterval(animalInterval);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        fontSize: "40px",
        transition: "all 1.5s ease-in-out",
        zIndex: 5,
      }}
    >
      {emoji}
    </div>
  );
}
