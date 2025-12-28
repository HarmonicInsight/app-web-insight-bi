# InsightBI - 経営ダッシュボード

IT企業の業績データを可視化するデモダッシュボードです。売上、粗利、プロジェクト状況などをリアルタイムで確認できます。

![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan)

## 機能

### 全社ダッシュボード
- **サマリー**: KPIサマリー、アラート、アクションアイテム
- **支社分析**: 支社別の売上・粗利比較、パフォーマンスヒートマップ
- **セグメント分析**: 事業セグメント別の分析
- **バックログ**: 受注残・期待粗利の可視化
- **売上予測**: 売上シミュレーション

### プロジェクト分析（DI）
- プロジェクト一覧とフィルタリング
- 粗利率 × 売上規模のマトリクス分析
- リスクプロジェクトの特定

## デモ環境

### ログイン情報
- **ユーザー名**: `demo`
- **パスワード**: `insight2025`

### サンプルデータ
IT企業を想定したデモデータが含まれています：
- **支社**: 東京本社、大阪支社、名古屋支社、福岡支社、札幌支社、海外事業部
- **事業セグメント**: SaaS、AI/ML、クラウド、セキュリティ、データ分析、コンサル
- **売上規模**: 約92.5億円
- **粗利**: 約13.5億円（粗利率14.6%）

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **UI**: React 19 + TypeScript
- **スタイリング**: Tailwind CSS 4
- **チャート**: Recharts
- **認証**: クライアントサイド認証（デモ用）

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 本番サーバーの起動
npm start
```

開発サーバーは http://localhost:3000 で起動します。

## プロジェクト構成

```
InsightBI/
├── app/
│   ├── globals.css      # グローバルスタイル
│   ├── layout.tsx       # ルートレイアウト
│   └── page.tsx         # メインページ
├── components/
│   ├── MainDashboard.tsx    # メインコンテナ（ログイン含む）
│   ├── Dashboard.tsx        # 全社ダッシュボード
│   ├── DIDashboard.tsx      # プロジェクト分析
│   ├── ExecutiveSummary.tsx # エグゼクティブサマリー
│   ├── KPISummary.tsx       # KPIカード
│   ├── PerformanceHeatmap.tsx # ヒートマップ
│   ├── BranchComparison.tsx   # 支社比較
│   ├── SegmentAnalysis.tsx    # セグメント分析
│   ├── RemainingWork.tsx      # バックログ
│   ├── ProfitImprovement.tsx  # 粗利改善
│   └── SalesSimulation.tsx    # 売上予測
├── data/
│   └── performance.json  # デモ業績データ
├── lib/
│   ├── types.ts          # TypeScript型定義
│   └── processData.ts    # データ処理ユーティリティ
└── package.json
```

## ライセンス

MIT License

## 開発元

[Harmonic Insight](https://github.com/HarmonicInsight)
