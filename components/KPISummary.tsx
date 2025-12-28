'use client';

import { Summary, Targets, Thresholds, StatusLevel } from '@/lib/types';

interface KPISummaryProps {
  summary: Summary;
  targets: Targets;
  thresholds: Thresholds;
}

function formatCurrency(value: number, unit: 'oku' | 'hyakuman' = 'oku'): string {
  if (unit === 'oku') {
    return (value / 100000000).toFixed(1) + '億円';
  }
  return (value / 1000000).toFixed(0) + '百万円';
}

function formatPercent(value: number): string {
  return value.toFixed(1) + '%';
}

function calculateYoY(current: number, previous: number): number {
  return ((current - previous) / previous) * 100;
}

function getRevenueStatus(achievement: number, thresholds: Thresholds): StatusLevel {
  if (achievement >= thresholds.revenueAchievementGood) return 'good';
  if (achievement >= thresholds.revenueAchievementWarning) return 'warning';
  return 'critical';
}

function getMarginStatus(margin: number, thresholds: Thresholds): StatusLevel {
  if (margin >= thresholds.marginGood) return 'good';
  if (margin >= thresholds.marginWarning) return 'warning';
  return 'critical';
}

const statusStyles = {
  good: {
    badge: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    ring: 'ring-emerald-500/50',
    progress: 'bg-emerald-500',
    border: 'border-emerald-500/30',
  },
  warning: {
    badge: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    ring: 'ring-amber-500/50',
    progress: 'bg-amber-500',
    border: 'border-amber-500/30',
  },
  critical: {
    badge: 'bg-red-500/20 text-red-400 border border-red-500/30',
    ring: 'ring-red-500/50',
    progress: 'bg-red-500',
    border: 'border-red-500/30',
  },
};

const statusLabels = {
  good: '達成',
  warning: '注意',
  critical: '未達',
};

interface KPICardProps {
  title: string;
  value: string;
  target?: string;
  achievement?: number;
  status?: StatusLevel;
  yoyChange?: number;
  icon: React.ReactNode;
  colorClass: string;
}

function KPICard({ title, value, target, achievement, status, yoyChange, icon, colorClass }: KPICardProps) {
  return (
    <div className={`bg-slate-800 rounded-xl shadow-lg p-5 border-l-4 ${colorClass} ${status ? `ring-1 ${statusStyles[status].ring}` : ''}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-slate-400">{title}</p>
            {status && (
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${statusStyles[status].badge}`}>
                {statusLabels[status]}
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-2 rounded-lg bg-slate-700/50`}>
          {icon}
        </div>
      </div>

      {/* Target & Progress */}
      {target && achievement !== undefined && status && (
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">目標: {target}</span>
            <span className={`font-medium ${
              status === 'good' ? 'text-emerald-400' : status === 'warning' ? 'text-amber-400' : 'text-red-400'
            }`}>
              {achievement.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${statusStyles[status].progress}`}
              style={{ width: `${Math.min(achievement, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* YoY Change */}
      {yoyChange !== undefined && (
        <div className={`flex items-center mt-2 text-sm ${yoyChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          <span className="mr-1">{yoyChange >= 0 ? '▲' : '▼'}</span>
          <span>前年比 {yoyChange >= 0 ? '+' : ''}{yoyChange.toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
}

export default function KPISummary({ summary, targets, thresholds }: KPISummaryProps) {
  const revenueYoY = calculateYoY(summary.totalRevenue, summary.previousYearRevenue);
  const profitYoY = calculateYoY(summary.totalGrossProfit, summary.previousYearGrossProfit);

  const revenueAchievement = (summary.totalRevenue / targets.revenue) * 100;
  const profitAchievement = (summary.totalGrossProfit / targets.grossProfit) * 100;

  const revenueStatus = getRevenueStatus(revenueAchievement, thresholds);
  const profitStatus = getRevenueStatus(profitAchievement, thresholds);
  const marginStatus = getMarginStatus(summary.grossMarginRate, thresholds);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">
          {summary.fiscalYear} 業績サマリー
        </h2>
        <span className="text-sm text-slate-400">{summary.asOfDate}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KPICard
          title="全社売上"
          value={formatCurrency(summary.totalRevenue)}
          target={formatCurrency(targets.revenue)}
          achievement={revenueAchievement}
          status={revenueStatus}
          yoyChange={revenueYoY}
          colorClass="border-indigo-500"
          icon={
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KPICard
          title="粗利益"
          value={formatCurrency(summary.totalGrossProfit)}
          target={formatCurrency(targets.grossProfit)}
          achievement={profitAchievement}
          status={profitStatus}
          yoyChange={profitYoY}
          colorClass="border-emerald-500"
          icon={
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <KPICard
          title="粗利率"
          value={formatPercent(summary.grossMarginRate)}
          target={formatPercent(targets.grossMarginRate)}
          achievement={(summary.grossMarginRate / targets.grossMarginRate) * 100}
          status={marginStatus}
          colorClass="border-purple-500"
          icon={
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          }
        />
        <KPICard
          title="バックログ"
          value={formatCurrency(summary.totalRemainingWork)}
          target={`目安: ${formatCurrency(targets.remainingWork)}`}
          colorClass="border-orange-500"
          icon={
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
      </div>
    </div>
  );
}
