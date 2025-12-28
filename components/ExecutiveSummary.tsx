'use client';

import { Summary, Targets, Thresholds, BranchPerformance, SalesSimulation, StatusLevel } from '@/lib/types';

interface ExecutiveSummaryProps {
  summary: Summary;
  targets: Targets;
  thresholds: Thresholds;
  branchPerformance: BranchPerformance[];
  salesSimulation: SalesSimulation;
}

interface Alert {
  level: StatusLevel;
  title: string;
  description: string;
  impact: string;
  actions: string[];
}

function getMarginStatus(margin: number, thresholds: Thresholds): StatusLevel {
  if (margin >= thresholds.marginGood) return 'good';
  if (margin >= thresholds.marginWarning) return 'warning';
  return 'critical';
}

function getRevenueStatus(achievement: number, thresholds: Thresholds): StatusLevel {
  if (achievement >= thresholds.revenueAchievementGood) return 'good';
  if (achievement >= thresholds.revenueAchievementWarning) return 'warning';
  return 'critical';
}

const statusStyles = {
  good: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600',
    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  },
  critical: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-600',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  },
};

const levelLabels = {
  good: '良好',
  warning: '要注意',
  critical: '要対応',
};

export default function ExecutiveSummary({
  summary,
  targets,
  thresholds,
  branchPerformance,
  salesSimulation,
}: ExecutiveSummaryProps) {
  // Generate alerts based on data analysis
  const alerts: Alert[] = [];

  // 1. 売上達成率チェック
  const revenueAchievement = (summary.totalRevenue / targets.revenue) * 100;
  const revenueStatus = getRevenueStatus(revenueAchievement, thresholds);
  if (revenueStatus !== 'good') {
    const shortfall = targets.revenue - summary.totalRevenue;
    alerts.push({
      level: revenueStatus,
      title: '売上計画未達',
      description: `計画${(targets.revenue / 100000000).toFixed(0)}億円に対し、現在${(summary.totalRevenue / 100000000).toFixed(1)}億円（達成率${revenueAchievement.toFixed(0)}%）`,
      impact: `不足額: ${(shortfall / 100000000).toFixed(1)}億円`,
      actions: [
        '受注活動の強化（特にSaaS・AI/MLセグメント）',
        '営業リソースの重点配分見直し',
        '既存顧客への追加提案強化',
      ],
    });
  }

  // 2. 粗利率チェック
  const marginStatus = getMarginStatus(summary.grossMarginRate, thresholds);
  if (marginStatus !== 'good') {
    alerts.push({
      level: marginStatus,
      title: '粗利率が目標未達',
      description: `目標${targets.grossMarginRate}%に対し、現在${summary.grossMarginRate.toFixed(1)}%`,
      impact: `目標との乖離: ${(targets.grossMarginRate - summary.grossMarginRate).toFixed(1)}ポイント`,
      actions: [
        'コスト管理の徹底（外注費・人件費の見直し）',
        '採算性の低い案件の見積精度向上',
        '効率化ツール導入によるコスト低減',
      ],
    });
  }

  // 3. 問題支社の特定
  const problemBranches = branchPerformance.filter(
    (b) => b.total.grossMargin < thresholds.marginWarning
  );
  problemBranches.forEach((branch) => {
    const level: StatusLevel = branch.total.grossMargin < thresholds.marginCritical ? 'critical' : 'warning';
    alerts.push({
      level,
      title: `${branch.branch}の業績悪化`,
      description: `粗利率${branch.total.grossMargin.toFixed(1)}%（${branch.total.grossProfit >= 0 ? '' : '赤字'}）`,
      impact: branch.total.grossProfit < 0
        ? `赤字額: ${Math.abs(branch.total.grossProfit / 1000000).toFixed(0)}百万円`
        : `粗利額: ${(branch.total.grossProfit / 1000000).toFixed(0)}百万円`,
      actions: [
        `${branch.branch}責任者との業績改善会議の実施`,
        '赤字案件の原因分析と再発防止策',
        '人員配置・案件アサインの見直し',
      ],
    });
  });

  // 4. 売上シミュレーション - 不足額が大きいセグメント
  const majorShortfalls = salesSimulation.segments
    .map((seg, i) => ({
      segment: seg,
      shortfall: salesSimulation.shortfall[i],
      target: salesSimulation.targetRevenue[i],
      forecast: salesSimulation.currentForecast[i],
    }))
    .filter((s) => s.shortfall > 100000000) // 1億円以上の不足
    .sort((a, b) => b.shortfall - a.shortfall);

  if (majorShortfalls.length > 0) {
    const totalShortfall = majorShortfalls.reduce((sum, s) => sum + s.shortfall, 0);
    alerts.push({
      level: 'warning',
      title: 'セグメント別売上不足',
      description: `${majorShortfalls.map((s) => s.segment).join('・')}で計画未達の見込み`,
      impact: `合計不足額: ${(totalShortfall / 100000000).toFixed(1)}億円`,
      actions: majorShortfalls.slice(0, 2).map(
        (s) => `${s.segment}: ${(s.shortfall / 1000000).toFixed(0)}百万円の受注確保が必要`
      ),
    });
  }

  // Sort by severity
  const sortedAlerts = alerts.sort((a, b) => {
    const order = { critical: 0, warning: 1, good: 2 };
    return order[a.level] - order[b.level];
  });

  const criticalCount = alerts.filter((a) => a.level === 'critical').length;
  const warningCount = alerts.filter((a) => a.level === 'warning').length;

  // Overall status
  const overallStatus: StatusLevel = criticalCount > 0 ? 'critical' : warningCount > 0 ? 'warning' : 'good';

  return (
    <div className="mb-8">
      {/* Overall Status Header */}
      <div className={`rounded-xl p-6 mb-6 border-2 ${statusStyles[overallStatus].bg} ${statusStyles[overallStatus].border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${statusStyles[overallStatus].badge}`}>
              {overallStatus === 'good' ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : overallStatus === 'warning' ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                経営判断サマリー
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {overallStatus === 'good'
                  ? '現在の業績は計画通りに推移しています'
                  : overallStatus === 'warning'
                  ? '一部指標で注意が必要です'
                  : '早急な対応が必要な課題があります'}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {criticalCount > 0 && (
              <div className="px-4 py-2 bg-red-100 dark:bg-red-900/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">{criticalCount}</p>
                <p className="text-xs text-red-600 dark:text-red-400">要対応</p>
              </div>
            )}
            {warningCount > 0 && (
              <div className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{warningCount}</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">要注意</p>
              </div>
            )}
            {overallStatus === 'good' && (
              <div className="px-4 py-2 bg-green-100 dark:bg-green-900/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">OK</p>
                <p className="text-xs text-green-600 dark:text-green-400">良好</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alert Cards */}
      {sortedAlerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            アクションアイテム
          </h3>

          {sortedAlerts.map((alert, index) => (
            <div
              key={index}
              className={`rounded-lg border p-5 ${statusStyles[alert.level].bg} ${statusStyles[alert.level].border}`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 ${statusStyles[alert.level].icon}`}>
                  {alert.level === 'critical' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${statusStyles[alert.level].badge}`}>
                      {levelLabels[alert.level]}
                    </span>
                    <h4 className="font-bold text-gray-900 dark:text-white">{alert.title}</h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{alert.description}</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                    {alert.impact}
                  </p>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">推奨アクション:</p>
                    <ul className="space-y-1">
                      {alert.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-gray-400 mt-1">-</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {sortedAlerts.length === 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 mx-auto text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-green-700 dark:text-green-300 font-medium">
            すべての指標が良好です。現在の取り組みを継続してください。
          </p>
        </div>
      )}
    </div>
  );
}
