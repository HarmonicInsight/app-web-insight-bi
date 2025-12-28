'use client';

import { BranchPerformance } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

interface BranchComparisonProps {
  branchPerformance: BranchPerformance[];
}

function formatOku(value: number): string {
  return (value / 100000000).toFixed(1);
}

export default function BranchComparison({ branchPerformance }: BranchComparisonProps) {
  const chartData = branchPerformance.map((branch) => ({
    name: branch.branch.replace('支社', '').replace('本社', '').replace('事業部', ''),
    売上: branch.total.revenue / 100000000,
    粗利: branch.total.grossProfit / 100000000,
    粗利率: branch.total.grossMargin,
    rawRevenue: branch.total.revenue,
    rawProfit: branch.total.grossProfit,
  }));

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
    payload: { rawRevenue: number; rawProfit: number; 粗利率: number };
  }>; label?: string }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-bold text-gray-900 dark:text-white mb-2">{label}</p>
          <p className="text-indigo-600">売上: {formatOku(data.rawRevenue)}億円</p>
          <p className={data.rawProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
            粗利: {formatOku(data.rawProfit)}億円
          </p>
          <p className="text-purple-600">粗利率: {data.粗利率.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">支社別業績比較</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              type="number"
              tickFormatter={(value) => `${value}億`}
              domain={[-1, 'dataMax + 2']}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#6B7280' }}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine x={0} stroke="#374151" />
            <Bar dataKey="売上" fill="#6366F1" radius={[0, 4, 4, 0]} />
            <Bar dataKey="粗利" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.粗利 >= 0 ? '#10B981' : '#EF4444'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-sm">
        {chartData.map((branch) => (
          <div
            key={branch.name}
            className={`p-2 rounded-lg text-center ${
              branch.粗利 >= 0
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-red-50 dark:bg-red-900/20'
            }`}
          >
            <span className="font-medium text-gray-700 dark:text-gray-300">{branch.name}</span>
            <br />
            <span className={branch.粗利 >= 0 ? 'text-green-600' : 'text-red-600'}>
              {branch.粗利率.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
