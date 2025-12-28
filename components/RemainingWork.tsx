'use client';

import { RemainingWork as RemainingWorkType } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';

interface RemainingWorkProps {
  remainingWork: RemainingWorkType[];
}

const COLORS = ['#6366F1', '#3B82F6', '#0EA5E9', '#14B8A6', '#22C55E', '#84CC16'];

export default function RemainingWork({ remainingWork }: RemainingWorkProps) {
  const chartData = remainingWork.map((branch, index) => ({
    name: branch.branch.replace('支社', '').replace('本社', '').replace('事業部', ''),
    バックログ: branch.total.remaining / 100000000,
    期待粗利: branch.total.expectedProfit / 100000000,
    期待粗利率: branch.total.expectedMargin,
    rawRemaining: branch.total.remaining,
    rawProfit: branch.total.expectedProfit,
    color: COLORS[index],
  }));

  const totalRemaining = chartData.reduce((sum, d) => sum + d.rawRemaining, 0);
  const totalExpectedProfit = chartData.reduce((sum, d) => sum + d.rawProfit, 0);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{
    value: number;
    payload: {
      rawRemaining: number;
      rawProfit: number;
      期待粗利率: number;
    };
  }>; label?: string }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-bold text-gray-900 dark:text-white mb-2">{label}</p>
          <p className="text-indigo-600">
            バックログ: {(data.rawRemaining / 100000000).toFixed(1)}億円
          </p>
          <p className="text-green-600">
            期待粗利: {(data.rawProfit / 100000000).toFixed(1)}億円
          </p>
          <p className="text-purple-600">
            期待粗利率: {data.期待粗利率.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">バックログ状況</h3>
        <div className="text-right">
          <span className="text-sm text-gray-500 dark:text-gray-400">合計</span>
          <p className="text-xl font-bold text-indigo-600">
            {(totalRemaining / 100000000).toFixed(0)}億円
          </p>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis tickFormatter={(value) => `${value}億`} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="バックログ" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList
                dataKey="バックログ"
                position="top"
                formatter={(value: number) => `${value.toFixed(1)}億`}
                className="text-xs"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* サマリーカード */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
          <p className="text-sm text-indigo-600 dark:text-indigo-400">バックログ合計</p>
          <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            {(totalRemaining / 100000000).toFixed(0)}億円
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <p className="text-sm text-green-600 dark:text-green-400">期待粗利合計</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            {(totalExpectedProfit / 100000000).toFixed(1)}億円
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <p className="text-sm text-purple-600 dark:text-purple-400">平均期待粗利率</p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {((totalExpectedProfit / totalRemaining) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* 支社別詳細 */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">支社別詳細</h4>
        <div className="space-y-2">
          {chartData.map((branch) => (
            <div
              key={branch.name}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: branch.color }}
                />
                <span className="font-medium text-gray-900 dark:text-white">{branch.name}</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {branch.バックログ.toFixed(1)}億円
                </span>
                <span className="text-green-600">
                  粗利 {branch.期待粗利.toFixed(1)}億円
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    branch.期待粗利率 >= 15
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : branch.期待粗利率 >= 12
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {branch.期待粗利率.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
