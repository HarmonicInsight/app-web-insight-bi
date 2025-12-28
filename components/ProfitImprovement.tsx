'use client';

import { ProfitImprovement as ProfitImprovementType } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

interface ProfitImprovementProps {
  profitImprovement: ProfitImprovementType[];
}

export default function ProfitImprovement({ profitImprovement }: ProfitImprovementProps) {
  const chartData = profitImprovement.map((branch) => ({
    name: branch.branch.replace('支社', '').replace('本社', '').replace('事業部', ''),
    当初見通し: branch.total.initialProfit / 10000000,
    最終見通し: branch.total.finalProfit / 10000000,
    改善額: branch.total.improvement / 10000000,
    rawInitial: branch.total.initialProfit,
    rawFinal: branch.total.finalProfit,
    rawImprovement: branch.total.improvement,
  }));

  const totalImprovement = chartData.reduce((sum, d) => sum + d.rawImprovement, 0);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{
    value: number;
    name: string;
    payload: {
      rawInitial: number;
      rawFinal: number;
      rawImprovement: number;
    };
  }>; label?: string }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-bold text-gray-900 dark:text-white mb-2">{label}</p>
          <p className={data.rawInitial >= 0 ? 'text-gray-600' : 'text-red-600'}>
            当初見通し: {(data.rawInitial / 10000000).toFixed(1)}千万円
          </p>
          <p className={data.rawFinal >= 0 ? 'text-indigo-600' : 'text-red-600'}>
            最終見通し: {(data.rawFinal / 10000000).toFixed(1)}千万円
          </p>
          <p className="text-green-600 font-medium">
            改善額: +{(data.rawImprovement / 10000000).toFixed(1)}千万円
          </p>
        </div>
      );
    }
    return null;
  };

  // 改善額でソート（大きい順）
  const sortedByImprovement = [...chartData].sort((a, b) => b.rawImprovement - a.rawImprovement);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">粗利改善トラッキング</h3>
        <div className="bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-lg">
          <span className="text-sm text-green-600 dark:text-green-400">全社改善額</span>
          <p className="text-xl font-bold text-green-700 dark:text-green-300">
            +{(totalImprovement / 100000000).toFixed(1)}億円
          </p>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis
              tickFormatter={(value) => `${value}千万`}
              tick={{ fontSize: 11 }}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine y={0} stroke="#374151" />
            <Bar dataKey="当初見通し" fill="#9CA3AF" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-initial-${index}`}
                  fill={entry.rawInitial >= 0 ? '#9CA3AF' : '#FCA5A5'}
                />
              ))}
            </Bar>
            <Bar dataKey="最終見通し" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-final-${index}`}
                  fill={entry.rawFinal >= 0 ? '#6366F1' : '#EF4444'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 改善ランキング */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
          改善額ランキング
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedByImprovement.map((branch, index) => (
            <div
              key={branch.name}
              className={`p-4 rounded-lg border ${
                index === 0
                  ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                  : index === 1
                  ? 'bg-gray-50 border-gray-200 dark:bg-gray-700/50 dark:border-gray-600'
                  : index === 2
                  ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
                  : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0
                        ? 'bg-yellow-500 text-white'
                        : index === 1
                        ? 'bg-gray-400 text-white'
                        : index === 2
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">{branch.name}</span>
                </div>
                <span className="text-green-600 font-bold">
                  +{(branch.rawImprovement / 100000000).toFixed(2)}億
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className={branch.rawInitial >= 0 ? 'text-gray-500' : 'text-red-500'}>
                  {(branch.rawInitial / 10000000).toFixed(1)}千万
                </span>
                <span className="text-gray-400">→</span>
                <span className={branch.rawFinal >= 0 ? 'text-indigo-600' : 'text-red-600'}>
                  {(branch.rawFinal / 10000000).toFixed(1)}千万
                </span>
              </div>
              {/* プログレスバー */}
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${Math.min((branch.rawImprovement / sortedByImprovement[0].rawImprovement) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
