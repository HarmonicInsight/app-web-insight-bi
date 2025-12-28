'use client';

import { BranchPerformance } from '@/lib/types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

interface SegmentAnalysisProps {
  branchPerformance: BranchPerformance[];
}

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
const SEGMENT_NAMES = ['SaaS', 'AI/ML', 'クラウド', 'セキュリティ', 'データ分析', 'コンサル'];

export default function SegmentAnalysis({ branchPerformance }: SegmentAnalysisProps) {
  // セグメント別集計
  const segmentTotals = SEGMENT_NAMES.map((segmentName) => {
    let totalRevenue = 0;
    let totalProfit = 0;

    branchPerformance.forEach((branch) => {
      if (branch.segments[segmentName]) {
        totalRevenue += branch.segments[segmentName].revenue;
        totalProfit += branch.segments[segmentName].grossProfit;
      }
    });

    return {
      name: segmentName,
      revenue: totalRevenue,
      profit: totalProfit,
      margin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
    };
  });

  const totalRevenue = segmentTotals.reduce((sum, s) => sum + s.revenue, 0);

  const pieData = segmentTotals.map((segment) => ({
    name: segment.name,
    value: segment.revenue,
    percentage: (segment.revenue / totalRevenue) * 100,
  }));

  const barData = segmentTotals.map((segment) => ({
    name: segment.name,
    売上: segment.revenue / 100000000,
    粗利: segment.profit / 100000000,
    粗利率: segment.margin,
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{
    value: number;
    payload: { name: string; value: number; percentage: number };
  }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-bold text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-indigo-600">{(data.value / 100000000).toFixed(1)}億円</p>
          <p className="text-gray-600 dark:text-gray-400">{data.percentage.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = (props: {
    cx?: number;
    cy?: number;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    percent?: number;
  }) => {
    const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">セグメント別分析</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 円グラフ - 売上構成比 */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 text-center">売上構成比</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={90}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => <span className="text-gray-700 dark:text-gray-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 棒グラフ - セグメント別売上・粗利 */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 text-center">売上・粗利比較</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis tickFormatter={(value) => `${value}億`} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name) => [
                    typeof value === 'number' ? `${value.toFixed(1)}億円` : value,
                    name,
                  ]}
                />
                <Bar dataKey="売上" fill="#6366F1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="粗利" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* セグメント別詳細テーブル */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-400">セグメント</th>
              <th className="text-right py-2 px-3 font-medium text-gray-600 dark:text-gray-400">売上</th>
              <th className="text-right py-2 px-3 font-medium text-gray-600 dark:text-gray-400">粗利</th>
              <th className="text-right py-2 px-3 font-medium text-gray-600 dark:text-gray-400">粗利率</th>
              <th className="text-right py-2 px-3 font-medium text-gray-600 dark:text-gray-400">構成比</th>
            </tr>
          </thead>
          <tbody>
            {segmentTotals.map((segment, index) => (
              <tr key={segment.name} className="border-b border-gray-100 dark:border-gray-700/50">
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">{segment.name}</span>
                  </div>
                </td>
                <td className="text-right py-2 px-3 text-gray-700 dark:text-gray-300">
                  {(segment.revenue / 100000000).toFixed(1)}億円
                </td>
                <td className={`text-right py-2 px-3 ${segment.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(segment.profit / 100000000).toFixed(1)}億円
                </td>
                <td className={`text-right py-2 px-3 ${segment.margin >= 10 ? 'text-green-600' : 'text-orange-600'}`}>
                  {segment.margin.toFixed(1)}%
                </td>
                <td className="text-right py-2 px-3 text-gray-700 dark:text-gray-300">
                  {((segment.revenue / totalRevenue) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
