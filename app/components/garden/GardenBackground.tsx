// components/garden/GardenBackground.tsx
"use client";

import { useState } from "react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <div style={{ position: "relative", zIndex: 2, width: "100%", height: "100%" }}>
        {/* 右上のボタン群（縦に並べるコンテナ） */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            alignItems: "flex-end",
          }}
        >
          {/* 他のアプリボタン */}
          <a
            href="https://rine-apps.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(4px)",
              padding: "6px 12px",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#333",
              fontSize: "13px",
              fontWeight: 500,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            📁 他のアプリ
          </a>

          {/* その他ボタン */}
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(4px)",
              padding: "6px 12px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              color: "#333",
              fontSize: "13px",
              fontWeight: 500,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            ⚙ その他
          </button>
        </div>

        {/* モーダルウィンドウ */}
        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(3px)",
              zIndex: 100,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setIsModalOpen(false)}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "24px",
                borderRadius: "16px",
                width: "90%",
                maxWidth: "360px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
              onClick={(e) => e.stopPropagation()} // モーダル内クリックで閉じないようにする
            >
              <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#333", textAlign: "center" }}>その他メニュー</h3>

              <a href="/blog" target="_blank" rel="noopener noreferrer" style={modalItemStyle}>
                📝 開発者ブログ
              </a>

              <a href="mailto:appli.kaihatu.jp+hakoniwa@gmail.com?subject=箱庭アプリについてのお問い合わせ" style={modalItemStyle}>
                ✉️ お問い合わせ
              </a>

              <a href="/privacy" target="_blank" rel="noopener noreferrer" style={modalItemStyle}>
                🔒 プライバシーポリシー
              </a>

              <a href="/roadmap" target="_blank" rel="noopener noreferrer" style={modalItemStyle}>
                🗺️ 今後の展望
              </a>

              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  marginTop: "8px",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#f0f0f0",
                  color: "#666",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                閉じる
              </button>
            </div>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

// モーダル内のリンクボタン用共通スタイル
const modalItemStyle: React.CSSProperties = {
  display: "block",
  padding: "12px 16px",
  borderRadius: "8px",
  backgroundColor: "#f9f9f9",
  color: "#333",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 500,
  textAlign: "center",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  transition: "background-color 0.2s",
};
