export default function PrivacyPolicy() {
  return (
    <main style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto", color: "#222", lineHeight: 1.8, fontFamily: "sans-serif" }}>
      {/* タイトル ＆ 下線 */}
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "24px", borderBottom: "1px solid #ccc", paddingBottom: "12px" }}>プライバシーポリシー</h1>

      <p style={{ marginBottom: "24px" }}>箱庭アプリ（以下「本アプリ」）をご利用いただきありがとうございます。本アプリ（URL: https://hakoniwa.rine-apps.com ）における個人情報の取り扱いについて、以下の通りプライバシーポリシーを定めます。</p>

      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginTop: "32px", marginBottom: "12px" }}>1. 広告の配信について</h2>
      <p style={{ marginBottom: "24px" }}>本アプリでは、第三者配信の広告サービスを利用、または将来的に利用する場合があります。広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookieや端末識別子を使用することがあります。</p>

      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginTop: "32px", marginBottom: "12px" }}>2. アプリの機能提供におけるデータの取扱いについて</h2>
      <p style={{ marginBottom: "24px" }}>本アプリでは、プレイデータや設定情報を保存するため、データベース（Supabase等）を利用する場合があります。これらのデータは、アプリの機能提供およびサービスの改善のために使用され、個人を特定する目的では使用いたしません。</p>

      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginTop: "32px", marginBottom: "12px" }}>3. アクセス解析ツールについて</h2>
      <p style={{ marginBottom: "24px" }}>本アプリでは、アクセス解析ツールを利用してトラフィックデータを収集しています。このデータは匿名で収集されており、個人を特定するものではありません。</p>

      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginTop: "32px", marginBottom: "12px" }}>4. お問い合わせ先</h2>
      <p style={{ marginBottom: "12px" }}>本アプリに関するご質問やご相談は、下記メールアドレスまでお問い合わせください。</p>
      <p style={{ marginBottom: "24px" }}>
        <a href="mailto:appli.kaihatu.jp+hakoniwa@gmail.com" style={{ color: "#0066cc", textDecoration: "underline" }}>
          appli.kaihatu.jp+hakoniwa@gmail.com
        </a>
      </p>

      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginTop: "32px", marginBottom: "12px" }}>5. プライバシーポリシーの変更</h2>
      <p style={{ marginBottom: "32px" }}>本アプリは、必要に応じてプライバシーポリシーの内容を変更する場合があります。変更した際は本ページにてお知らせいたします。</p>

      <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>© 2026 rine-apps.com. All Rights Reserved.</p>
    </main>
  );
}
