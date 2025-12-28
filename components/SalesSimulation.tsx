'use client';

import { SalesSimulation as SalesSimulationType } from '@/lib/types';
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
} from 'recharts';

interface SalesSimulationProps {
  salesSimulation: SalesSimulationType;
}

export default function SalesSimulation({ salesSimulation }: SalesSimulationProps) {
  const chartData = salesSimulation.segments.map((segment, index) => ({
    name: segment,
    繰越案件: salesSimulation.carryoverTotal[index] / 100000000,
    現時点見込: salesSimulation.currentForecast[index] / 100000000,
    計画値: salesSimulation.targetRevenue[index] / 100000000,
    不足額: salesSimulation.shortfall[index] / 100000000,
    rawCarryover: salesSimulation.carryoverTotal[index],
    rawForecast: salesSimulation.currentForecast[index],
    rawTarget: salesSimulation.targetRevenue[index],
    rawShortfall: salesSimulation.shortfall[index],
  }));

  const totalShortfall = salesSimulation.shortfall.reduce((sum, v) => sum + v, 0);
  const totalTarget = salesSimulation.targetRevenue.reduce((sum, v) => sum + v, 0);
  const totalForecast = salesSimulation.currentForecast.reduce((sum, v) => sum + v, 0);
  const achievementRate = (totalForecast / totalTarget) * 100;

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{
    value: number;
    name: string;
    payload: {
      rawCarryover: number;
      rawForecast: number;
      rawTarget: number;
      rawShortfall: number;
    };
  }>; label?: string }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-bold text-gray-900 dark:text-white mb-2">{label}</p>
          <p className="text-gray-600">
            繰越案件: {(data.rawCarryover / 100000000).toFixed(1)}億円
          </p>
          <p className="text-indigo-600">
            現時点見込: {(data.rawForecast / 100000000).toFixed(1)}億円
          </p>
          <p className="text-green-600">
            計画値: {(data.rawTarget / 100000000).toFixed(1)}億円
          </p>
          <p className="text-red-600 font-medium">
            不足額: {(data.rawShortfall / 1000000).toFixed(0)}百万円
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">売上シミュレーション</h3>
        <div className="flex flex-wrap gap-3">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-lg">
            <span className="text-xs text-indigo-600 dark:text-indigo-400">計画達成率</span>
            <p className={`text-lg font-bold ${
              achievementRate >= 100 ? 'text-green-600' : achievementRate >= 90 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {achievementRate.toFixed(1)}%
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
            <span className="text-xs text-red-600 dark:text-red-400">不足額合計</span>
            <p className="text-lg font-bold text-red-700 dark:text-red-300">
              {(totalShortfall / 100000000).toFixed(1)}億円
            </p>
          </div>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis tickFormatter={(value) => `${value}億`} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine y={0} stroke="#374151" />
            <Bar dataKey="現時点見込" fill="#6366F1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="計画値" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 詳細テーブル */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-3 font-semibold text-gray-700 dark:text-gray-300">セグメント</th>
              <th className="text-right py-3 px-3 font-semibold text-gray-700 dark:text-gray-300">繰越案件</th>
              <th className="text-right py-3 px-3 font-semibold text-gray-700 dark:text-gray-300">現時点見込</th>
              <th className="text-right py-3 px-3 font-semibold text-gray-700 dark:text-gray-300">計画値</th>
              <th className="text-right py-3 px-3 font-semibold text-gray-700 dark:text-gray-300">不足額</th>
              <th className="text-right py-3 px-3 font-semibold text-gray-700 dark:text-gray-300">達成率</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((row) => {
              const rate = (row.rawForecast / row.rawTarget) * 100;
              return (
                <tr
                  key={row.name}
                  className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                >
                  <td className="py-3 px-3 font-medium text-gray-900 dark:text-white">{row.name}</td>
                  <td className="text-right py-3 px-3 text-gray-600 dark:text-gray-400">
                    {(row.rawCarryover / 100000000).toFixed(1)}億円
                  </td>
                  <td className="text-right py-3 px-3 text-indigo-600">
                    {(row.rawForecast / 100000000).toFixed(1)}億円
                  </td>
                  <td className="text-right py-3 px-3 text-green-600">
                    {(row.rawTarget / 100000000).toFixed(1)}億円
                  </td>
                  <td className={`text-right py-3 px-3 font-medium ${
                    row.rawShortfall > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {row.rawShortfall > 0 ? (
                      <span>{(row.rawShortfall / 1000000).toFixed(0)}百万円</span>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td className="text-right py-3 px-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        rate >= 100
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : rate >= 90
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {rate.toFixed(0)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
              <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">合計</td>
              <td className="text-right py-3 px-3 font-bold text-gray-700 dark:text-gray-300">
                {(salesSimulation.carryoverTotal.reduce((a, b) => a + b, 0) / 100000000).toFixed(1)}億円
              </td>
              <td className="text-right py-3 px-3 font-bold text-indigo-600">
                {(totalForecast / 100000000).toFixed(1)}億円
              </td>
              <td className="text-right py-3 px-3 font-bold text-green-600">
                {(totalTarget / 100000000).toFixed(1)}億円
              </td>
              <td className="text-right py-3 px-3 font-bold text-red-600">
                {(totalShortfall / 1000000).toFixed(0)}百万円
              </td>
              <td className="text-right py-3 px-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    achievementRate >= 100
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : achievementRate >= 90
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {achievementRate.toFixed(0)}%
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 警告メッセージ */}
      {totalShortfall > 0 && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-medium text-red-800 dark:text-red-300">
                売上計画に対して{(totalShortfall / 100000000).toFixed(1)}億円の不足が見込まれます
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                特にSaaS（{(salesSimulation.shortfall[0] / 1000000).toFixed(0)}百万円）、
                AI/ML（{(salesSimulation.shortfall[1] / 1000000).toFixed(0)}百万円）の
                受注強化が必要です。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
