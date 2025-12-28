import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InsightBI - 経営ダッシュボード",
  description: "IT企業の業績データを可視化するダッシュボード。売上、粗利、プロジェクト状況などをリアルタイムで確認できます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
