export default function Roadmap() {
  return (
    <main style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto", color: "#222", lineHeight: 1.8, fontFamily: "sans-serif" }}>
      {/* タイトル ＆ 下線 */}
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "24px", borderBottom: "1px solid #ccc", paddingBottom: "12px" }}>今後の展望</h1>

      <p style={{ marginBottom: "24px" }}>
        箱庭アプリをお楽しみいただきありがとうございます。
        <br />
        本アプリをより楽しく、癒やされる空間にするために、
        <br />
        今後予定しているアップデートや実装したい機能のアイデアをご紹介します。
      </p>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "12px", color: "#0066cc" }}>実装済み機能（Ver1.0）</h2>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={{ marginBottom: "6px" }}>１０種類＋の動物やキャラクター（確率で出現）</li>
          <li style={{ marginBottom: "6px" }}>背景（時間帯）のバリエーション</li>
          <li style={{ marginBottom: "0" }}>GPSや選択した県の天気情報等</li>
        </ul>
      </section>

      {/* 近日実装予定のセクション */}
      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "12px", color: "#0066cc" }}>🚀 近日実装予定（Phase 1）</h2>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={{ marginBottom: "6px" }}>新しい動物やキャラクターの追加</li>
          <li style={{ marginBottom: "6px" }}>背景（実際の天気を反映等）のバリエーション拡充</li>
          <li style={{ marginBottom: "6px" }}>餌やり、友好度up機能、図鑑機能</li>
          <li style={{ marginBottom: "6px" }}>ログイン及びログインボーナス機能</li>
          <li style={{ marginBottom: "0" }}>入退場や動き、行動パターンの強化</li>
        </ul>
      </section>

      {/* 中長期的な展望のセクション */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "12px", color: "#0066cc" }}>🌱 中長期的な目標（Phase 2以降）</h2>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={{ marginBottom: "6px" }}>ユーザーからのご要望に応じた新機能の追加</li>
          <li style={{ marginBottom: "6px" }}>収集要素やカスタマイズ機能の拡張</li>
          <li style={{ marginBottom: "0" }}>さらにのんびり遊べる演出の強化</li>
        </ul>
      </section>

      {/* フィードバックのお願いボックス */}
      <div
        style={{
          backgroundColor: "#f9f9f9",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "16px 20px",
          marginBottom: "40px",
          color: "#444",
        }}
      >
        <p style={{ fontWeight: "bold", marginBottom: "8px" }}>💬 ご意見・ご要望について</p>
        <p style={{ fontSize: "14px", margin: 0 }}>「こんな動物がほしい」「こういう機能があったら嬉しい」といったアイデアがございましたら、その他メニューのお問い合わせからぜひお気軽にお知らせください！</p>
      </div>

      <p style={{ fontSize: "14px", color: "#666" }}>© 2026 rine-apps.com. All Rights Reserved.</p>
    </main>
  );
}
