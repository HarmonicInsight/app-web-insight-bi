import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "InsightBI - 経営ダッシュボード",
  description: "IT企業の業績データを可視化するダッシュボード。売上、粗利、プロジェクト状況などをリアルタイムで確認できます。",
  keywords: ["BI", "ダッシュボード", "経営管理", "業績分析", "KPI"],
  authors: [{ name: "InsightBI" }],
  robots: "noindex, nofollow", // 商用アプリのため検索エンジン除外
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
