export default function DeveloperBlog() {
  return (
    <main style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto", color: "#222", lineHeight: 1.8, fontFamily: "sans-serif" }}>
      {/* タイトル ＆ 下線 */}
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "24px", borderBottom: "1px solid #ccc", paddingBottom: "12px" }}>開発者ブログ</h1>

      <p style={{ marginBottom: "16px" }}>箱庭アプリを遊んで頂きありがとうございます。</p>
      <p style={{ marginBottom: "24px" }}>
        当アプリは、日々の癒やしやちょっとした息抜きに使えそうな
        <br />
        ツールを形にしたものです。
      </p>

      <p style={{ marginBottom: "16px" }}>
        お気に入りの動物たちを眺めて
        <br />
        のんびりと楽しめる空間を軸に構成しております。
      </p>
      <p style={{ marginBottom: "24px" }}>
        忙しい日常の合間に、
        <br />
        ふとリラックスできる時間をお届けできれば嬉しいです。
      </p>

      <p style={{ marginBottom: "16px" }}>
        ぜひ日々の癒やしにお役立てください。
        <br />
        これからも新しいアプリの開発を
        <br />
        続けていきますのでよろしくお願い致します。
      </p>

      <p style={{ marginBottom: "40px", fontSize: "14px", color: "#555" }}>開発者より</p>

      {/* ホーム画面に追加しよう案内ボックス */}
      <div
        style={{
          backgroundColor: "#f0f8ff",
          border: "1px solid #bce8f1",
          borderRadius: "8px",
          padding: "16px 20px",
          marginBottom: "32px",
          color: "#31708f",
        }}
      >
        <p style={{ fontWeight: "bold", marginBottom: "8px" }}>💡 アプリとして使うともっと快適！</p>
        <p style={{ fontSize: "14px", margin: 0 }}>
          iPhoneやAndroidの「ホーム画面に追加」を行うと、
          <br />
          検索バーが消えて「全画面アプリ」として起動できます。
          <br />
          いつでもサクッと箱庭に癒やされにいけます！
        </p>
      </div>

      {/* アップデート一覧（クリックして開くアコーディオン） */}
      <details
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "16px 20px",
          marginBottom: "40px",
          backgroundColor: "#fafafa",
          cursor: "pointer",
        }}
      >
        <summary style={{ fontWeight: "bold", fontSize: "16px", outline: "none" }}>▶ アップデート一覧（クリックして開く）</summary>
        <div style={{ marginTop: "16px", fontSize: "14px", lineHeight: 1.6, color: "#444" }}>
          <p style={{ fontWeight: "bold", marginBottom: "4px" }}>v1.0</p>
          <p style={{ marginBottom: "16px" }}>● 2026/08/20 箱庭アプリをリリースしました！</p>

          <p style={{ fontWeight: "bold", marginBottom: "4px" }}>v1.1（予定）</p>
          <p style={{ marginBottom: "0" }}>● 新しい動物や背景、えさやり等を追加予定です</p>
        </div>
      </details>

      <p style={{ fontSize: "14px", color: "#666" }}>© 2026 rine-apps.com. All Rights Reserved.</p>
    </main>
  );
}
