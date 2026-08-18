import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "箱庭アプリ",
  description: "あなただけの小さな箱庭を育てるアプリ",
  // スマホのホーム画面に追加されたときのアプリ設定
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "箱庭アプリ",
  },
  // SNSシェア時のOGP設定
  openGraph: {
    title: "箱庭アプリ",
    description: "あなただけの小さな箱庭を育てるアプリ",
    url: "あなたのアプリのURL（デプロイ後でOK）",
    siteName: "箱庭アプリ",
    images: [
      {
        url: "/images/ogp.jpg", // public/images/ogp.jpg を指定
        width: 1200,
        height: 630,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "箱庭アプリ",
    description: "あなただけの小さな箱庭を育てるアプリ",
    images: ["/images/ogp.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
