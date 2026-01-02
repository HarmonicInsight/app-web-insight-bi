'use client';

import { useState, useMemo } from 'react';
import {
  monthlyDataset,
  kpiDefinitions,
  categories,
  calculateYTD,
  calculateForecast,
  getKPIStatus,
  statusConfig,
  KPIStatus,
} from '@/lib/monthlyData';

// 数値フォーマット
function fmt(value: number, unit: string): string {
  if (unit === '%') return `${value.toFixed(1)}%`;
  if (unit === '億円') return `${value.toFixed(1)}`;
  return `${Math.round(value)}`;
}

// 差異の色
function varColor(rate: number, isHigherBetter: boolean): string {
  const effective = isHigherBetter ? rate : -rate;
  if (effective >= 0) return 'text-emerald-600';
  if (effective >= -5) return 'text-amber-600';
  return 'text-red-600';
}

// コンパクトなKPI行
function KPIRow({
  kpi,
  current,
  previous,
  ytd,
  forecast,
  showPrevious,
}: {
  kpi: typeof kpiDefinitions[0];
  current: { budget: number; actual: number; variance: number; varianceRate: number } | null;
  previous: { budget: number; actual: number; variance: number; varianceRate: number } | null;
  ytd: { budget: number; actual: number; variance: number; varianceRate: number };
  forecast: { budget: number; forecast: number; variance: number; varianceRate: number };
  showPrevious: boolean;
}) {
  const status = current ? getKPIStatus(current.varianceRate, kpi.isHigherBetter) : 'good';
  const statusCfg = statusConfig[status];

  // 前月比
  const momChange = current && previous ? current.actual - previous.actual : null;
  const momRate = previous && previous.actual !== 0 ? ((momChange || 0) / previous.actual) * 100 : null;

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 text-sm">
      {/* KPI名 */}
      <td className="py-2 px-2">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.bg}`} />
          <span className="font-medium text-slate-800">{kpi.name}</span>
        </div>
      </td>

      {/* 当月 */}
      <td className="py-2 px-2 text-right">
        <span className="font-semibold">{current ? fmt(current.actual, kpi.unit) : '-'}</span>
        <span className="text-slate-400 text-xs ml-1">{kpi.unit !== '%' ? kpi.unit : ''}</span>
      </td>
      <td className="py-2 px-2 text-right text-xs text-slate-500">
        {current ? fmt(current.budget, kpi.unit) : '-'}
      </td>
      <td className="py-2 px-2 text-right">
        {current && (
          <span className={`text-xs font-medium ${varColor(current.varianceRate, kpi.isHigherBetter)}`}>
            {current.varianceRate >= 0 ? '+' : ''}{current.varianceRate.toFixed(1)}%
          </span>
        )}
      </td>

      {/* 前月（オプション） */}
      {showPrevious && (
        <>
          <td className="py-2 px-2 text-right text-slate-600">
            {previous ? fmt(previous.actual, kpi.unit) : '-'}
          </td>
          <td className="py-2 px-2 text-right">
            {momRate !== null && (
              <span className={`text-xs ${varColor(momRate, kpi.isHigherBetter)}`}>
                {momRate >= 0 ? '+' : ''}{momRate.toFixed(1)}%
              </span>
            )}
          </td>
        </>
      )}

      {/* 累計 */}
      <td className="py-2 px-2 text-right font-medium">{fmt(ytd.actual, kpi.unit)}</td>
      <td className="py-2 px-2 text-right text-xs text-slate-500">{fmt(ytd.budget, kpi.unit)}</td>
      <td className="py-2 px-2 text-right">
        <span className={`text-xs font-medium ${varColor(ytd.varianceRate, kpi.isHigherBetter)}`}>
          {ytd.varianceRate >= 0 ? '+' : ''}{ytd.varianceRate.toFixed(1)}%
        </span>
      </td>

      {/* 通期見込 */}
      <td className="py-2 px-2 text-right font-medium">{fmt(forecast.forecast, kpi.unit)}</td>
      <td className="py-2 px-2 text-right text-xs text-slate-500">{fmt(forecast.budget, kpi.unit)}</td>
      <td className="py-2 px-2 text-right">
        <span className={`text-xs font-medium ${varColor(forecast.varianceRate, kpi.isHigherBetter)}`}>
          {forecast.varianceRate >= 0 ? '+' : ''}{forecast.varianceRate.toFixed(1)}%
        </span>
      </td>

      {/* ステータス */}
      <td className="py-2 px-2 text-center">
        <span className={`text-xs px-1.5 py-0.5 rounded ${statusCfg.bg} ${statusCfg.color}`}>
          {statusCfg.label}
        </span>
      </td>
    </tr>
  );
}

// サマリーカード（コンパクト）
function SummaryCard({ label, value, unit, rate, isGood }: {
  label: string;
  value: string;
  unit?: string;
  rate?: number;
  isGood?: boolean;
}) {
  return (
    <div className={`rounded-lg p-3 ${isGood === undefined ? 'bg-slate-100' : isGood ? 'bg-emerald-50' : 'bg-red-50'}`}>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-slate-900">{value}</span>
        {unit && <span className="text-xs text-slate-500">{unit}</span>}
      </div>
      {rate !== undefined && (
        <div className={`text-xs ${rate >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          予算比 {rate >= 0 ? '+' : ''}{rate.toFixed(1)}%
        </div>
      )}
    </div>
  );
}

export default function MonthlyFollowDashboard() {
  const [selectedMonth, setSelectedMonth] = useState(9);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPrevious, setShowPrevious] = useState(true);

  const availableMonths = monthlyDataset.map(d => ({ month: d.month, label: d.label }));

  // 選択月データ
  const currentData = useMemo(() =>
    monthlyDataset.find(d => d.month === selectedMonth) || null
  , [selectedMonth]);

  // 前月データ
  const previousData = useMemo(() =>
    monthlyDataset.find(d => d.month === selectedMonth - 1) || null
  , [selectedMonth]);

  // 累計
  const ytdData = useMemo(() =>
    calculateYTD(monthlyDataset, selectedMonth)
  , [selectedMonth]);

  // 通期見込
  const forecastData = useMemo(() =>
    calculateForecast(ytdData, selectedMonth)
  , [ytdData, selectedMonth]);

  // フィルター済みKPI
  const filteredKPIs = selectedCategory === 'all'
    ? kpiDefinitions
    : kpiDefinitions.filter(k => k.category === selectedCategory);

  // サマリー計算
  const summary = useMemo(() => {
    const revenue = currentData?.kpis.revenue;
    const profit = currentData?.kpis.gross_profit;
    const goodCount = kpiDefinitions.filter(k => {
      const v = currentData?.kpis[k.id];
      if (!v) return false;
      return getKPIStatus(v.varianceRate, k.isHigherBetter) === 'good';
    }).length;
    const criticalCount = kpiDefinitions.filter(k => {
      const v = currentData?.kpis[k.id];
      if (!v) return false;
      return getKPIStatus(v.varianceRate, k.isHigherBetter) === 'critical';
    }).length;

    return {
      revenue: revenue ? { actual: revenue.actual, rate: revenue.varianceRate } : null,
      profit: profit ? { actual: profit.actual, rate: profit.varianceRate } : null,
      goodCount,
      criticalCount,
      total: kpiDefinitions.length,
    };
  }, [currentData]);

  return (
    <div className="h-full overflow-auto p-4 space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">月次フォロー</h1>
          <p className="text-sm text-slate-500">2025年度 予実管理</p>
        </div>

        {/* 月選択 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">対象月:</span>
          <div className="flex gap-1">
            {availableMonths.map(m => (
              <button
                key={m.month}
                onClick={() => setSelectedMonth(m.month)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  selectedMonth === m.month
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* サマリー */}
      <div className="grid grid-cols-6 gap-3">
        <SummaryCard
          label="当月売上"
          value={summary.revenue ? summary.revenue.actual.toFixed(1) : '-'}
          unit="億円"
          rate={summary.revenue?.rate}
          isGood={summary.revenue ? summary.revenue.rate >= -5 : undefined}
        />
        <SummaryCard
          label="当月粗利"
          value={summary.profit ? summary.profit.actual.toFixed(1) : '-'}
          unit="億円"
          rate={summary.profit?.rate}
          isGood={summary.profit ? summary.profit.rate >= -5 : undefined}
        />
        <SummaryCard
          label="累計売上"
          value={ytdData.revenue?.actual.toFixed(1) || '-'}
          unit="億円"
          rate={ytdData.revenue?.varianceRate}
          isGood={ytdData.revenue ? ytdData.revenue.varianceRate >= -5 : undefined}
        />
        <SummaryCard
          label="通期見込"
          value={forecastData.revenue?.forecast.toFixed(1) || '-'}
          unit="億円"
          rate={forecastData.revenue?.varianceRate}
          isGood={forecastData.revenue ? forecastData.revenue.varianceRate >= -5 : undefined}
        />
        <SummaryCard
          label="順調KPI"
          value={`${summary.goodCount}/${summary.total}`}
          isGood={summary.goodCount >= summary.total * 0.7}
        />
        <SummaryCard
          label="要対策KPI"
          value={`${summary.criticalCount}`}
          unit="件"
          isGood={summary.criticalCount === 0}
        />
      </div>

      {/* フィルター＆オプション */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">カテゴリ:</span>
          {['all', ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? '全て' : cat}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showPrevious}
            onChange={e => setShowPrevious(e.target.checked)}
            className="rounded"
          />
          前月比較を表示
        </label>
      </div>

      {/* KPIテーブル */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 text-xs text-slate-600">
            <tr>
              <th className="py-2 px-2 text-left font-medium">KPI</th>
              <th colSpan={3} className="py-2 px-2 text-center font-medium border-l border-slate-200">
                当月（{currentData?.label}）
              </th>
              {showPrevious && (
                <th colSpan={2} className="py-2 px-2 text-center font-medium border-l border-slate-200">
                  前月（{previousData?.label || '-'}）
                </th>
              )}
              <th colSpan={3} className="py-2 px-2 text-center font-medium border-l border-slate-200">
                累計（4月〜{currentData?.label}）
              </th>
              <th colSpan={3} className="py-2 px-2 text-center font-medium border-l border-slate-200">
                通期見込
              </th>
              <th className="py-2 px-2 text-center font-medium border-l border-slate-200">状況</th>
            </tr>
            <tr className="text-xs text-slate-500">
              <th className="py-1 px-2"></th>
              <th className="py-1 px-2 text-right">実績</th>
              <th className="py-1 px-2 text-right">予算</th>
              <th className="py-1 px-2 text-right">差異</th>
              {showPrevious && (
                <>
                  <th className="py-1 px-2 text-right border-l border-slate-200">実績</th>
                  <th className="py-1 px-2 text-right">前月比</th>
                </>
              )}
              <th className="py-1 px-2 text-right border-l border-slate-200">実績</th>
              <th className="py-1 px-2 text-right">予算</th>
              <th className="py-1 px-2 text-right">差異</th>
              <th className="py-1 px-2 text-right border-l border-slate-200">見込</th>
              <th className="py-1 px-2 text-right">予算</th>
              <th className="py-1 px-2 text-right">差異</th>
              <th className="py-1 px-2 border-l border-slate-200"></th>
            </tr>
          </thead>
          <tbody>
            {filteredKPIs.map(kpi => (
              <KPIRow
                key={kpi.id}
                kpi={kpi}
                current={currentData?.kpis[kpi.id] || null}
                previous={previousData?.kpis[kpi.id] || null}
                ytd={ytdData[kpi.id]}
                forecast={forecastData[kpi.id]}
                showPrevious={showPrevious}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* 要対策KPIサマリー */}
      {summary.criticalCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <h3 className="font-semibold text-red-800 text-sm mb-2">要対策KPI</h3>
          <div className="grid grid-cols-4 gap-2">
            {kpiDefinitions.filter(k => {
              const v = currentData?.kpis[k.id];
              return v && getKPIStatus(v.varianceRate, k.isHigherBetter) === 'critical';
            }).map(k => {
              const v = currentData?.kpis[k.id];
              return (
                <div key={k.id} className="bg-white rounded p-2 text-sm">
                  <div className="font-medium text-slate-800">{k.name}</div>
                  <div className="text-red-600 text-xs">
                    予算比 {v?.varianceRate && v.varianceRate >= 0 ? '+' : ''}{v?.varianceRate.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
