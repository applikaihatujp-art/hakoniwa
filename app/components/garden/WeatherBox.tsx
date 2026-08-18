"use client";

import { useState, useEffect } from "react";
import { CITIES } from "./cities"; // ← 別ファイルからデータをインポートする

// 天気コード（数字）を絵文字に変換する関数
function getWeatherEmoji(code: number) {
  if (code === 0) return "☀️";
  if (code >= 1 && code <= 3) return "☁️";
  if (code >= 51 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 95) return "⚡";
  return "🌤️";
}

export default function WeatherBox() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentWeather, setCurrentWeather] = useState<{ temp: string | number; code: number }>({ temp: "--", code: 0 });
  const [forecasts, setForecasts] = useState<Array<{ time: string; temp: string | number; code: number }>>([
    { time: "+3h", temp: "--", code: 0 },
    { time: "+6h", temp: "--", code: 0 },
    { time: "+9h", temp: "--", code: 0 },
    { time: "+12h", temp: "--", code: 0 },
  ]);

  // 位置情報と設定モーダルの状態
  const [locationName, setLocationName] = useState("マイガーデン");
  const [lat, setLat] = useState(35.7);
  const [lon, setLon] = useState(140.0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 1. 初回ロード時に保存された位置情報を読み込む
  useEffect(() => {
    const savedLat = localStorage.getItem("garden_lat");
    const savedLon = localStorage.getItem("garden_lon");
    const savedName = localStorage.getItem("garden_name");

    if (savedLat && savedLon) {
      setLat(parseFloat(savedLat));
      setLon(parseFloat(savedLon));
      if (savedName) setLocationName(savedName);
    }
  }, []);

  // 2. 時計を動かす
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // 3. 緯度・経度が変わったらお天気データを取得する
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&timezone=Asia%2FTokyo`);
        const data = await res.json();

        if (data.current) {
          setCurrentWeather({
            temp: data.current.temperature_2m != null ? Math.round(data.current.temperature_2m) : "--",
            code: data.current.weather_code ?? 0,
          });
        }

        if (data.hourly && data.hourly.time) {
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
        }
      } catch (error) {
        console.error("天気の取得に失敗しました:", error);
      }
    };

    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(weatherInterval);
  }, [lat, lon]);

  // GPSで現在地を取得する処理
  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      alert("お使いのブラウザは位置情報に対応していません");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLat = position.coords.latitude;
        const newLon = position.coords.longitude;
        setLat(newLat);
        setLon(newLon);
        setLocationName("現在地");

        localStorage.setItem("garden_lat", newLat.toString());
        localStorage.setItem("garden_lon", newLon.toString());
        localStorage.setItem("garden_name", "現在地");

        setIsSettingsOpen(false);
      },
      (error) => {
        let errorMsg = "位置情報の取得に失敗しました。";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "位置情報の利用がブロックされています。ブラウザの設定から許可してください。";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = "位置情報が取得できませんでした（電波状況など）。";
        } else if (error.code === error.TIMEOUT) {
          errorMsg = "位置情報の取得がタイムアウトしました。";
        }
        alert(errorMsg);
        console.error("Geolocation Error:", error);
      },
      {
        timeout: 10000, // 10秒でタイムアウトさせる設定を追加
        maximumAge: 0,
      },
    );
  };

  // プリセットの都市を選択したときの処理
  const handleSelectCity = (key: string) => {
    const city = CITIES[key];
    if (city) {
      setLat(city.lat);
      setLon(city.lon);
      setLocationName(city.name);

      localStorage.setItem("garden_lat", city.lat.toString());
      localStorage.setItem("garden_lon", city.lon.toString());
      localStorage.setItem("garden_name", city.name);

      setIsSettingsOpen(false);
    }
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 10,
          background: "rgba(230, 247, 255, 0.6)",
          border: "2px solid #b3e0ff",
          padding: "8px 12px", // パディングを狭く調整
          borderRadius: "14px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          minWidth: "190px", // 横幅の最小値を狭く調整
        }}
      >
        {/* 【上段】地域名＋歯車 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px", borderBottom: "1px solid rgba(179, 224, 255, 0.3)", paddingBottom: "4px" }}>
          <div style={{ fontWeight: "bold", color: "#333", fontSize: "13px" }}>マイガーデン</div>
          <div style={{ fontSize: "11px", color: "#666", cursor: "pointer", background: "rgba(0,0,0,0.05)", padding: "1px 6px", borderRadius: "4px" }} onClick={() => setIsSettingsOpen(true)} title="クリックして地域を変更">
            {locationName} ⚙️
          </div>
        </div>

        {/* 【中段】時間、現在の天気、気温 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "6px", borderBottom: "1px solid rgba(179, 224, 255, 0.3)" }}>
          <div style={{ color: "#005580", fontWeight: "bold", fontSize: "15px" }}>{currentTime}</div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ fontSize: "18px" }}>{getWeatherEmoji(currentWeather.code)}</span>
            <span style={{ fontSize: "13px", color: "#333", fontWeight: "bold" }}>{currentWeather.temp}°C</span>
          </div>
        </div>

        {/* 【下段】3, 6, 9, 12時間後の天気 */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", textAlign: "center" }}>
          {forecasts.map((f, index) => (
            <div key={index}>
              <div style={{ fontSize: "8px", color: "#666" }}>{f.time}</div>
              <div style={{ fontSize: "14px" }}>{getWeatherEmoji(f.code)}</div>
              <div style={{ fontSize: "9px", color: "#333" }}>{f.temp}°C</div>
            </div>
          ))}
        </div>
      </div>

      {/* 設定モーダル（歯車を押したときに出てくるポップアップ） */}
      {isSettingsOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
            backdropFilter: "blur(5px)",
          }}
          onClick={() => setIsSettingsOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "16px",
              width: "320px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#333", textAlign: "center" }}>📍 お天気・地域の変更</h3>

            {/* GPSボタン */}
            <button
              onClick={handleGeoLocation}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px",
                background: "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              GPSの現在地から取得する
            </button>

            <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px", textAlign: "center" }}>または地域を選択</div>

            {/* 都市ボタンリスト */}
            <div
              style={{
                maxHeight: "240px",
                overflowY: "auto",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                marginBottom: "16px",
                paddingRight: "4px",
              }}
            >
              {Object.keys(CITIES).map((key) => (
                <button
                  key={key}
                  onClick={() => handleSelectCity(key)}
                  style={{
                    padding: "8px",
                    background: "#f0f0f0",
                    color: "#333", // ←ここを追加！文字を濃い色に固定します
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  {CITIES[key].name}
                </button>
              ))}
            </div>

            {/* 閉じるボタン */}
            <button
              onClick={() => setIsSettingsOpen(false)}
              style={{
                width: "100%",
                padding: "8px",
                background: "#ccc",
                color: "#333",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
}
