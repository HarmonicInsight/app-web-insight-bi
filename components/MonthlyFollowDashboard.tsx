'use client';

import { useState } from 'react';
import {
  sampleMonthlyReview,
  varianceStatusConfig,
  MonthlyKPI,
  VarianceAnalysis,
  MonthlyAction,
} from '@/lib/monthlyFollowData';

// フェーズタブ
type Phase = 'summary' | 'variance' | 'forecast' | 'actions';

// 数値フォーマット
function formatNumber(value: number, unit: string): string {
  if (unit === '%') {
    return `${value.toFixed(1)}%`;
  }
  if (unit === '億円') {
    return `${value.toFixed(1)}億円`;
  }
  if (unit === '件' || unit === '名') {
    return `${Math.round(value)}${unit}`;
  }
  return `${value}${unit}`;
}

// 差異の色
function getVarianceColor(rate: number): string {
  if (rate >= 0) return 'text-emerald-600';
  if (rate >= -5) return 'text-amber-600';
  if (rate >= -10) return 'text-orange-600';
  return 'text-red-600';
}

// サマリーカード
function SummaryCard({ label, value, unit, subValue, subLabel, status }: {
  label: string;
  value: number;
  unit: string;
  subValue?: number;
  subLabel?: string;
  status?: 'good' | 'warning' | 'bad';
}) {
  const statusColors = {
    good: 'border-emerald-200 bg-emerald-50',
    warning: 'border-amber-200 bg-amber-50',
    bad: 'border-red-200 bg-red-50',
  };

  return (
    <div className={`rounded-xl border-2 p-4 ${status ? statusColors[status] : 'border-slate-200 bg-white'}`}>
      <div className="text-sm text-slate-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-slate-900">
        {formatNumber(value, unit)}
      </div>
      {subValue !== undefined && subLabel && (
        <div className="text-xs text-slate-500 mt-1">
          {subLabel}: <span className={getVarianceColor(subValue)}>{subValue >= 0 ? '+' : ''}{subValue.toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
}

// KPIテーブル行
function KPIRow({ kpi, onClick }: { kpi: MonthlyKPI; onClick: () => void }) {
  const status = varianceStatusConfig[kpi.status];

  return (
    <tr
      className="hover:bg-slate-50 cursor-pointer border-b border-slate-100"
      onClick={onClick}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status.bgColor}`} />
          <span className="font-medium text-slate-900">{kpi.name}</span>
        </div>
        <div className="text-xs text-slate-500 ml-4">{kpi.category}</div>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="font-medium">{formatNumber(kpi.actualMonth, kpi.unit)}</div>
        <div className="text-xs text-slate-500">予算: {formatNumber(kpi.budgetMonth, kpi.unit)}</div>
      </td>
      <td className="py-3 px-4 text-right">
        <div className={`font-medium ${getVarianceColor(kpi.varianceRateMonth)}`}>
          {kpi.varianceRateMonth >= 0 ? '+' : ''}{kpi.varianceRateMonth.toFixed(1)}%
        </div>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="font-medium">{formatNumber(kpi.actualYTD, kpi.unit)}</div>
        <div className="text-xs text-slate-500">予算: {formatNumber(kpi.budgetYTD, kpi.unit)}</div>
      </td>
      <td className="py-3 px-4 text-right">
        <div className={`font-medium ${getVarianceColor(kpi.varianceRateYTD)}`}>
          {kpi.varianceRateYTD >= 0 ? '+' : ''}{kpi.varianceRateYTD.toFixed(1)}%
        </div>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="font-medium">{formatNumber(kpi.forecastFY, kpi.unit)}</div>
        <div className="text-xs text-slate-500">予算: {formatNumber(kpi.budgetFY, kpi.unit)}</div>
      </td>
      <td className="py-3 px-4 text-right">
        <div className={`font-medium ${getVarianceColor(kpi.varianceRateFY)}`}>
          {kpi.varianceRateFY >= 0 ? '+' : ''}{kpi.varianceRateFY.toFixed(1)}%
        </div>
      </td>
      <td className="py-3 px-4 text-center">
        <span className={`text-xs px-2 py-1 rounded-full ${status.bgColor} ${status.color}`}>
          {status.label}
        </span>
      </td>
    </tr>
  );
}

// KPI詳細モーダル
function KPIDetailModal({ kpi, onClose }: { kpi: MonthlyKPI; onClose: () => void }) {
  const status = varianceStatusConfig[kpi.status];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <span className={`text-xs px-2 py-1 rounded-full ${status.bgColor} ${status.color} mb-2 inline-block`}>
                {status.label}
              </span>
              <h2 className="text-xl font-bold">{kpi.name}</h2>
              <p className="text-slate-300">{kpi.category}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* 予実比較 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-500 mb-2">当月</h4>
              <div className="text-xl font-bold">{formatNumber(kpi.actualMonth, kpi.unit)}</div>
              <div className="text-sm text-slate-500">予算: {formatNumber(kpi.budgetMonth, kpi.unit)}</div>
              <div className={`text-sm font-medium ${getVarianceColor(kpi.varianceRateMonth)}`}>
                差異: {kpi.varianceRateMonth >= 0 ? '+' : ''}{kpi.varianceRateMonth.toFixed(1)}%
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-500 mb-2">累計（YTD）</h4>
              <div className="text-xl font-bold">{formatNumber(kpi.actualYTD, kpi.unit)}</div>
              <div className="text-sm text-slate-500">予算: {formatNumber(kpi.budgetYTD, kpi.unit)}</div>
              <div className={`text-sm font-medium ${getVarianceColor(kpi.varianceRateYTD)}`}>
                差異: {kpi.varianceRateYTD >= 0 ? '+' : ''}{kpi.varianceRateYTD.toFixed(1)}%
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-500 mb-2">通期見込</h4>
              <div className="text-xl font-bold">{formatNumber(kpi.forecastFY, kpi.unit)}</div>
              <div className="text-sm text-slate-500">予算: {formatNumber(kpi.budgetFY, kpi.unit)}</div>
              <div className={`text-sm font-medium ${getVarianceColor(kpi.varianceRateFY)}`}>
                差異: {kpi.varianceRateFY >= 0 ? '+' : ''}{kpi.varianceRateFY.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* 前年比較 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-700 mb-2">前年同期比較</h4>
            <div className="flex items-center gap-4">
              <div>
                <div className="text-sm text-blue-600">前年同期実績</div>
                <div className="text-lg font-bold text-blue-900">{formatNumber(kpi.actualPY, kpi.unit)}</div>
              </div>
              <div className="text-2xl">→</div>
              <div>
                <div className="text-sm text-blue-600">当期実績</div>
                <div className="text-lg font-bold text-blue-900">{formatNumber(kpi.actualYTD, kpi.unit)}</div>
              </div>
              <div className={`text-xl font-bold ${kpi.yoyRate >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {kpi.yoyRate >= 0 ? '+' : ''}{kpi.yoyRate.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* コメント */}
          {kpi.varianceComment && (
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">差異コメント</h4>
              <p className="text-slate-600 bg-slate-50 rounded-lg p-3">{kpi.varianceComment}</p>
            </div>
          )}

          {/* トレンド */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">トレンド:</span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              kpi.trend === 'improving' ? 'bg-emerald-100 text-emerald-700' :
              kpi.trend === 'declining' ? 'bg-red-100 text-red-700' :
              'bg-slate-100 text-slate-700'
            }`}>
              {kpi.trend === 'improving' ? '↑ 改善傾向' : kpi.trend === 'declining' ? '↓ 悪化傾向' : '→ 横ばい'}
            </span>
            {kpi.actionRequired && (
              <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                要アクション
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 差異分析カード
function VarianceAnalysisCard({ analysis }: { analysis: VarianceAnalysis }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-slate-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-slate-900">{analysis.kpiName}</h4>
            <div className={`text-sm ${getVarianceColor(analysis.varianceRate)}`}>
              差異: {analysis.varianceAmount >= 0 ? '+' : ''}{analysis.varianceAmount} ({analysis.varianceRate >= 0 ? '+' : ''}{analysis.varianceRate.toFixed(1)}%)
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              analysis.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
              analysis.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
              'bg-slate-100 text-slate-700'
            }`}>
              {analysis.status === 'completed' ? '完了' : analysis.status === 'in_progress' ? '対応中' : '未着手'}
            </span>
            <svg className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-slate-100 pt-4">
          {/* 差異要因 */}
          <div>
            <h5 className="text-sm font-medium text-slate-700 mb-2">差異要因</h5>
            <div className="space-y-2">
              {analysis.factors.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className={`w-2 h-2 rounded-full ${f.type === 'positive' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className="flex-1">{f.factor}</span>
                  <span className={f.type === 'positive' ? 'text-emerald-600' : 'text-red-600'}>
                    {f.impact >= 0 ? '+' : ''}{f.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 根本原因 */}
          <div>
            <h5 className="text-sm font-medium text-slate-700 mb-1">根本原因</h5>
            <p className="text-sm text-slate-600">{analysis.rootCause}</p>
          </div>

          {/* 是正アクション */}
          <div className="bg-blue-50 rounded-lg p-3">
            <h5 className="text-sm font-medium text-blue-700 mb-1">是正アクション</h5>
            <p className="text-sm text-blue-900">{analysis.correctionAction}</p>
            <div className="flex gap-4 mt-2 text-xs text-blue-600">
              <span>担当: {analysis.owner}</span>
              <span>期限: {analysis.dueDate}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// アクションカード
function ActionCard({ action }: { action: MonthlyAction }) {
  const priorityColors = {
    high: 'border-l-red-500',
    medium: 'border-l-amber-500',
    low: 'border-l-slate-400',
  };

  const statusLabels = {
    not_started: { label: '未着手', color: 'bg-slate-100 text-slate-700' },
    in_progress: { label: '進行中', color: 'bg-blue-100 text-blue-700' },
    completed: { label: '完了', color: 'bg-emerald-100 text-emerald-700' },
    delayed: { label: '遅延', color: 'bg-red-100 text-red-700' },
  };

  const statusConfig = statusLabels[action.status];

  return (
    <div className={`bg-white rounded-lg border border-slate-200 border-l-4 ${priorityColors[action.priority]} p-4`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-slate-900">{action.title}</h4>
        <span className={`text-xs px-2 py-1 rounded-full ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      </div>
      <p className="text-sm text-slate-600 mb-3">{action.description}</p>

      {/* プログレスバー */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>進捗</span>
          <span>{action.progress}%</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${action.status === 'delayed' ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ width: `${action.progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="bg-slate-100 px-2 py-1 rounded">関連KPI: {action.relatedKPI}</span>
        <span className="bg-slate-100 px-2 py-1 rounded">担当: {action.owner}</span>
        <span className="bg-slate-100 px-2 py-1 rounded">期限: {action.dueDate}</span>
      </div>
    </div>
  );
}

// メインコンポーネント
export default function MonthlyFollowDashboard() {
  const [activePhase, setActivePhase] = useState<Phase>('summary');
  const [selectedKPI, setSelectedKPI] = useState<MonthlyKPI | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const data = sampleMonthlyReview;
  const categories = ['all', ...Array.from(new Set(data.kpis.map(k => k.category)))];

  const filteredKPIs = filterCategory === 'all'
    ? data.kpis
    : data.kpis.filter(k => k.category === filterCategory);

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full">
      {/* ヘッダー */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">月次フォロー</h1>
          <p className="text-slate-500">
            {data.period.fiscalYear} {data.period.monthName}度 月次レビュー（締日: {data.period.closingDate}）
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">PDCAサイクル:</span>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
            Check（評価）
          </span>
        </div>
      </div>

      {/* フェーズタブ */}
      <div className="flex gap-2 border-b border-slate-200">
        {[
          { id: 'summary', label: '予実サマリー', icon: '📊' },
          { id: 'variance', label: '差異分析', icon: '🔍' },
          { id: 'forecast', label: '見通し更新', icon: '📈' },
          { id: 'actions', label: 'アクション管理', icon: '✅' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activePhase === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => setActivePhase(tab.id as Phase)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* サマリービュー */}
      {activePhase === 'summary' && (
        <div className="space-y-6">
          {/* サマリーカード */}
          <div className="grid grid-cols-5 gap-4">
            <SummaryCard
              label="売上達成率"
              value={data.summary.revenueAchievement}
              unit="%"
              status={data.summary.revenueAchievement >= 95 ? 'good' : data.summary.revenueAchievement >= 85 ? 'warning' : 'bad'}
            />
            <SummaryCard
              label="利益達成率"
              value={data.summary.profitAchievement}
              unit="%"
              status={data.summary.profitAchievement >= 95 ? 'good' : data.summary.profitAchievement >= 85 ? 'warning' : 'bad'}
            />
            <SummaryCard
              label="KPI達成"
              value={data.summary.kpiOnTrack}
              unit={`/ ${data.summary.kpiTotal}`}
              status={data.summary.kpiOnTrack >= data.summary.kpiTotal * 0.8 ? 'good' : data.summary.kpiOnTrack >= data.summary.kpiTotal * 0.6 ? 'warning' : 'bad'}
            />
            <SummaryCard
              label="未完了アクション"
              value={data.summary.actionsOpen}
              unit="件"
              status={data.summary.actionsOpen <= 3 ? 'good' : data.summary.actionsOpen <= 5 ? 'warning' : 'bad'}
            />
            <SummaryCard
              label="完了アクション"
              value={data.summary.actionsCompleted}
              unit="件"
            />
          </div>

          {/* カテゴリフィルター */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">カテゴリ:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filterCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat === 'all' ? 'すべて' : cat}
              </button>
            ))}
          </div>

          {/* KPIテーブル */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-sm text-slate-600">
                  <th className="py-3 px-4 font-medium">KPI</th>
                  <th className="py-3 px-4 font-medium text-right">当月実績</th>
                  <th className="py-3 px-4 font-medium text-right">当月差異</th>
                  <th className="py-3 px-4 font-medium text-right">累計実績</th>
                  <th className="py-3 px-4 font-medium text-right">累計差異</th>
                  <th className="py-3 px-4 font-medium text-right">通期見込</th>
                  <th className="py-3 px-4 font-medium text-right">通期差異</th>
                  <th className="py-3 px-4 font-medium text-center">ステータス</th>
                </tr>
              </thead>
              <tbody>
                {filteredKPIs.map((kpi) => (
                  <KPIRow key={kpi.id} kpi={kpi} onClick={() => setSelectedKPI(kpi)} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 差異分析ビュー */}
      {activePhase === 'variance' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">差異分析・是正アクション</h2>
            <span className="text-sm text-slate-500">{data.varianceAnalyses.length}件の重要差異</span>
          </div>
          <div className="space-y-4">
            {data.varianceAnalyses.map((analysis) => (
              <VarianceAnalysisCard key={analysis.kpiId} analysis={analysis} />
            ))}
          </div>
        </div>
      )}

      {/* 見通し更新ビュー */}
      {activePhase === 'forecast' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">見通し更新履歴</h2>
            <span className="text-sm text-slate-500">直近の更新</span>
          </div>
          <div className="space-y-4">
            {data.forecastUpdates.map((update) => (
              <div key={update.kpiId} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold text-slate-900">{update.kpiName}</h4>
                  <span className="text-xs text-slate-500">更新: {update.updatedAt} by {update.updatedBy}</span>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">当初予算</div>
                    <div className="font-semibold">{update.originalBudget}億円</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">前回見込</div>
                    <div className="font-semibold">{update.previousForecast}億円</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs text-blue-600 mb-1">今回見込</div>
                    <div className="font-semibold text-blue-900">{update.currentForecast}億円</div>
                  </div>
                  <div className={`text-center p-3 rounded-lg ${update.changeAmount >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    <div className={`text-xs mb-1 ${update.changeAmount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>変更額</div>
                    <div className={`font-semibold ${update.changeAmount >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                      {update.changeAmount >= 0 ? '+' : ''}{update.changeAmount}億円
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">変更理由</div>
                  <p className="text-sm text-slate-700">{update.changeReason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* アクション管理ビュー */}
      {activePhase === 'actions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">アクション管理</h2>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                優先度高: {data.actions.filter(a => a.priority === 'high').length}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                進行中: {data.actions.filter(a => a.status === 'in_progress').length}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {data.actions.map((action) => (
              <ActionCard key={action.id} action={action} />
            ))}
          </div>
        </div>
      )}

      {/* KPI詳細モーダル */}
      {selectedKPI && (
        <KPIDetailModal kpi={selectedKPI} onClose={() => setSelectedKPI(null)} />
      )}
    </div>
  );
}
