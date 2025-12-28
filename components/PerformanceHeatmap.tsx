'use client';

import { BranchPerformance, Thresholds } from '@/lib/types';

interface PerformanceHeatmapProps {
  branchPerformance: BranchPerformance[];
  thresholds: Thresholds;
}

const SEGMENT_NAMES = ['SaaS', 'AI/ML', 'クラウド', 'セキュリティ', 'データ分析', 'コンサル'];

function getHeatmapColor(margin: number, thresholds: Thresholds): string {
  if (margin < 0) return 'bg-red-600 text-white';
  if (margin < thresholds.marginCritical) return 'bg-red-400 text-white';
  if (margin < thresholds.marginWarning) return 'bg-orange-400 text-white';
  if (margin < thresholds.marginGood) return 'bg-yellow-400 text-gray-900';
  return 'bg-green-500 text-white';
}

function getStatusIcon(margin: number, thresholds: Thresholds): string {
  if (margin < 0) return '!!';
  if (margin < thresholds.marginCritical) return '!';
  if (margin < thresholds.marginWarning) return '-';
  if (margin < thresholds.marginGood) return 'o';
  return '';
}

export default function PerformanceHeatmap({
  branchPerformance,
  thresholds,
}: PerformanceHeatmapProps) {
  // Find problem areas (margin < warning threshold)
  const problemAreas: Array<{
    branch: string;
    segment: string;
    margin: number;
    profit: number;
  }> = [];

  branchPerformance.forEach((branch) => {
    SEGMENT_NAMES.forEach((segment) => {
      const data = branch.segments[segment];
      if (data && data.grossMargin < thresholds.marginWarning) {
        problemAreas.push({
          branch: branch.branch,
          segment,
          margin: data.grossMargin,
          profit: data.grossProfit,
        });
      }
    });
  });

  // Sort by margin (worst first)
  problemAreas.sort((a, b) => a.margin - b.margin);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          支社×セグメント 粗利率マトリクス
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">14%+</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">10-14%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-orange-400 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">5-10%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">0-5%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">赤字</span>
          </div>
        </div>
      </div>

      {/* Heatmap Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-tl-lg">
                支社
              </th>
              {SEGMENT_NAMES.map((segment, i) => (
                <th
                  key={segment}
                  className={`text-center py-2 px-3 font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 ${
                    i === SEGMENT_NAMES.length - 1 ? 'rounded-tr-lg' : ''
                  }`}
                >
                  {segment}
                </th>
              ))}
              <th className="text-center py-2 px-3 font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-600/50">
                合計
              </th>
            </tr>
          </thead>
          <tbody>
            {branchPerformance.map((branch) => (
              <tr key={branch.branch}>
                <td className="py-2 px-3 font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700">
                  {branch.branch.replace('支社', '').replace('本社', '').replace('事業部', '')}
                </td>
                {SEGMENT_NAMES.map((segment) => {
                  const data = branch.segments[segment];
                  if (!data) {
                    return (
                      <td
                        key={segment}
                        className="py-2 px-3 text-center border-b border-gray-100 dark:border-gray-700 bg-gray-100 dark:bg-gray-700/30"
                      >
                        -
                      </td>
                    );
                  }
                  const colorClass = getHeatmapColor(data.grossMargin, thresholds);
                  const icon = getStatusIcon(data.grossMargin, thresholds);
                  return (
                    <td
                      key={segment}
                      className={`py-2 px-3 text-center border-b border-gray-100 dark:border-gray-700 ${colorClass}`}
                      title={`売上: ${(data.revenue / 1000000).toFixed(0)}百万円\n粗利: ${(data.grossProfit / 1000000).toFixed(0)}百万円`}
                    >
                      <div className="font-medium">{data.grossMargin.toFixed(1)}%</div>
                      {icon && (
                        <div className="text-xs opacity-80">{icon}</div>
                      )}
                    </td>
                  );
                })}
                <td
                  className={`py-2 px-3 text-center border-b border-gray-100 dark:border-gray-700 font-bold ${getHeatmapColor(
                    branch.total.grossMargin,
                    thresholds
                  )}`}
                >
                  {branch.total.grossMargin.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Problem Areas Summary */}
      {problemAreas.length > 0 && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h4 className="font-bold text-red-800 dark:text-red-300 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            要注意エリア（粗利率10%未満）
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {problemAreas.slice(0, 6).map((area, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {area.branch.replace('支社', '').replace('本社', '').replace('事業部', '')} - {area.segment}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${area.margin < 0 ? 'text-red-600' : 'text-orange-600'}`}>
                    {area.margin.toFixed(1)}%
                  </span>
                  {area.profit < 0 && (
                    <span className="block text-xs text-red-500">
                      赤字{Math.abs(area.profit / 1000000).toFixed(0)}百万
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {problemAreas.length > 6 && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              他 {problemAreas.length - 6} 件のエリアで粗利率が低下しています
            </p>
          )}
        </div>
      )}
    </div>
  );
}
