"use client";

import { useState, useEffect } from "react";
import Rabbit from "../components/Rabbit";

// 天気コード（数字）を絵文字に変換する関数
function getWeatherEmoji(code: number) {
  // 0: 晴れ, 1,2,3: 曇り, 51-67: 雨, 71-77: 雪, 95-99: 雷
  if (code === 0) return "☀️";
  if (code >= 1 && code <= 3) return "☁️";
  if (code >= 51 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 95) return "⚡";
  return "🌤️";
}

// 天気の文字説明に変換する関数
function getWeatherText(code: number) {
  if (code === 0) return "晴れ";
  if (code >= 1 && code <= 3) return "曇り";
  if (code >= 51 && code <= 67) return "雨";
  if (code >= 71 && code <= 77) return "雪";
  if (code >= 95) return "雷";
  return "晴れ時々曇り";
}

export default function GardenPage() {
  // 現在の時刻
  const [currentTime, setCurrentTime] = useState("");

  // 実際の天気データ用ステート
  const [currentWeather, setCurrentWeather] = useState<{ temp: string | number; code: number }>({ temp: "--", code: 0 });
  const [forecasts, setForecasts] = useState<Array<{ time: string; temp: string | number; code: number }>>([
    { time: "+3h", temp: 0 as string | number, code: 0 },
    { time: "+6h", temp: 0 as string | number, code: 0 },
    { time: "+9h", temp: 0 as string | number, code: 0 },
    { time: "+12h", temp: 0 as string | number, code: 0 },
  ]);

  useEffect(() => {
    // 1. 時計を動かす
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    // 3. 千葉北西部のお天気データを取得する (Open-Meteo API)
    const fetchWeather = async () => {
      try {
        // 千葉北西部周辺（緯度: 35.7, 経度: 140.0）
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=35.7&longitude=140.0&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&timezone=Asia%2FTokyo");
        const data = await res.json();

        // 現在の天気
        setCurrentWeather({
          temp: data.current.temperature_2m != null ? Math.round(data.current.temperature_2m) : "--",
          code: data.current.weather_code ?? 0,
        });

        // 現在時刻のインデックスを探して、+3, +6, +9, +12時間後を抽出
        const nowIndex = data.hourly.time.findIndex((t: string) => new Date(t).getTime() >= Date.now());
        if (nowIndex !== -1) {
          const getFuture = (offset: number) => {
            const idx = nowIndex + offset;
            return {
              temp: Math.round(data.hourly.temperature_2m[idx] ?? 0),
              code: data.hourly.weather_code[idx] ?? 0,
            };
          };

          setForecasts([
            { time: "+3h", ...getFuture(3) },
            { time: "+6h", ...getFuture(6) },
            { time: "+9h", ...getFuture(9) },
            { time: "+12h", ...getFuture(12) },
          ]);
        }
      } catch (error) {
        console.error("天気の取得に失敗しました:", error);
      }
    };

    fetchWeather();
    // 30分ごとに天気を再取得
    const weatherInterval = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(weatherInterval);
    };
  }, []);

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
      {/* 🌤️ 左上のパステル水色お天気ボックス */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 10,
          background: "rgba(230, 247, 255, 0.5)",
          border: "2px solid #b3e0ff",
          padding: "12px 18px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* 【1行目】時間、名前、現在の天気、気温 */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "10px", borderBottom: "1px solid rgba(179, 224, 255, 0.3)", paddingBottom: "8px" }}>
          <div style={{ color: "#005580", fontWeight: "bold", fontSize: "14px" }}>{currentTime}</div>
          <div style={{ fontWeight: "bold", color: "#333", fontSize: "14px" }}>マイガーデン</div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginLeft: "auto" }}>
            <span style={{ fontSize: "20px" }}>{getWeatherEmoji(currentWeather.code)}</span>
            <span style={{ fontSize: "13px", color: "#333", fontWeight: "bold" }}>{currentWeather.temp}°C</span>
          </div>
        </div>

        {/* 【2行目】3, 6, 9, 12時間後の天気 */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "15px", textAlign: "center" }}>
          {forecasts.map((f, index) => (
            <div key={index}>
              <div style={{ fontSize: "9px", color: "#666" }}>{f.time}</div>
              <div style={{ fontSize: "16px" }}>{getWeatherEmoji(f.code)}</div>
              <div style={{ fontSize: "10px", color: "#333" }}>{f.temp}°C</div>
            </div>
          ))}
        </div>
      </div>

      {/* 🐇 うさぎコンポーネントをここに置く！ */}
      <Rabbit />
    </main>
  );
}
