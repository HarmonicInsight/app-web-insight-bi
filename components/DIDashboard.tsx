'use client';

import { useState, useMemo } from 'react';
import { DashboardData, Project } from '@/lib/processData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter, ComposedChart, Line, Legend
} from 'recharts';

interface DIDashboardProps {
  data: DashboardData;
}

const BUSINESS_COLORS: Record<string, string> = {
  'SaaS': '#6366f1',
  'AI/ML': '#8b5cf6',
  'クラウド': '#0ea5e9',
  'セキュリティ': '#22c55e',
  'データ分析': '#f97316',
  'コンサル': '#ec4899',
  '未設定': '#94a3b8',
};

const BRANCH_COLORS = ['#6366f1', '#f97316', '#22c55e', '#a855f7', '#ef4444', '#06b6d4'];

function formatCurrency(value: number): string {
  if (Math.abs(value) >= 100000000) {
    return (value / 100000000).toFixed(1) + '億';
  }
  if (Math.abs(value) >= 10000000) {
    return (value / 10000000).toFixed(0) + '千万';
  }
  if (Math.abs(value) >= 1000000) {
    return (value / 1000000).toFixed(0) + '百万';
  }
  return value.toLocaleString();
}

function getStatusColor(status: Project['status']) {
  return status === 'critical' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#22c55e';
}

const tabs = [
  { id: 'summary', label: '全社サマリー' },
  { id: 'branch', label: '支社別' },
  { id: 'business', label: '事業別' },
  { id: 'projects', label: '案件別' },
];

export default function DIDashboard({ data }: DIDashboardProps) {
  const [activeTab, setActiveTab] = useState('summary');
  const [filterBranch, setFilterBranch] = useState<string>('all');
  const [filterBusiness, setFilterBusiness] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Get unique values for filters
  const branches = useMemo(() =>
    [...new Set(data.projects.map(p => p.branch))].filter(o => o && o !== '未設定').sort(),
  [data.projects]);

  const businesses = useMemo(() =>
    [...new Set(data.projects.map(p => p.business))].filter(o => o && o !== '未設定').sort(),
  [data.projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return data.projects.filter(p => {
      if (filterBranch !== 'all' && p.branch !== filterBranch) return false;
      if (filterBusiness !== 'all' && p.business !== filterBusiness) return false;
      if (searchTerm && !p.name.includes(searchTerm) && !p.id.includes(searchTerm)) return false;
      return true;
    });
  }, [data.projects, filterBranch, filterBusiness, searchTerm]);

  // Summary calculations
  const summary = useMemo(() => {
    const projects = filteredProjects;
    const totalContract = projects.reduce((sum, p) => sum + (p.finalEstimate.contractAmount || p.initialBudget.contractAmount), 0);
    const totalProfit = projects.reduce((sum, p) => sum + p.finalEstimate.grossProfit, 0);
    const completedCount = projects.filter(p => p.cumulative.revenue > 0).length;
    const improvementCount = projects.filter(p => p.finalEstimate.marginDiff > 0).length;
    const declineCount = projects.filter(p => p.finalEstimate.marginDiff < 0).length;

    return {
      projectCount: projects.length,
      totalContract,
      totalProfit,
      completionRate: projects.length > 0 ? (completedCount / projects.length) * 100 : 0,
      avgMarginRate: totalContract > 0 ? (totalProfit / totalContract) * 100 : 0,
      improvementCount,
      declineCount,
    };
  }, [filteredProjects]);

  // Branch data for charts
  const branchData = useMemo(() => {
    const byBranch: Record<string, { contract: number; profit: number; count: number }> = {};
    filteredProjects.forEach(p => {
      const branch = p.branch || '未設定';
      if (!byBranch[branch]) byBranch[branch] = { contract: 0, profit: 0, count: 0 };
      byBranch[branch].contract += p.finalEstimate.contractAmount || p.initialBudget.contractAmount;
      byBranch[branch].profit += p.finalEstimate.grossProfit;
      byBranch[branch].count++;
    });
    return Object.entries(byBranch)
      .map(([name, data]) => ({
        name: name.replace('支社', '').replace('本社', '').replace('事業部', ''),
        contract: data.contract,
        profit: data.profit,
        marginRate: data.contract > 0 ? (data.profit / data.contract) * 100 : 0,
        count: data.count,
      }))
      .sort((a, b) => b.contract - a.contract);
  }, [filteredProjects]);

  // Business data for charts
  const businessData = useMemo(() => {
    const byBusiness: Record<string, { contract: number; profit: number; count: number }> = {};
    filteredProjects.forEach(p => {
      const business = p.business || '未設定';
      if (!byBusiness[business]) byBusiness[business] = { contract: 0, profit: 0, count: 0 };
      byBusiness[business].contract += p.finalEstimate.contractAmount || p.initialBudget.contractAmount;
      byBusiness[business].profit += p.finalEstimate.grossProfit;
      byBusiness[business].count++;
    });
    return Object.entries(byBusiness)
      .map(([name, data]) => ({
        name,
        contract: data.contract,
        profit: data.profit,
        marginRate: data.contract > 0 ? (data.profit / data.contract) * 100 : 0,
        count: data.count,
      }))
      .sort((a, b) => b.contract - a.contract);
  }, [filteredProjects]);

  // Scatter data
  const scatterData = useMemo(() =>
    filteredProjects.map(p => ({
      name: p.name,
      x: (p.finalEstimate.contractAmount || p.initialBudget.contractAmount) / 1000000,
      y: p.finalEstimate.marginRate || 0,
      status: p.status,
      business: p.business,
    })),
  [filteredProjects]);

  // Decline projects
  const declineProjects = useMemo(() =>
    filteredProjects
      .filter(p => p.finalEstimate.marginDiff < 0)
      .sort((a, b) => a.finalEstimate.marginDiff - b.finalEstimate.marginDiff)
      .slice(0, 5),
  [filteredProjects]);

  // Margin distribution data
  const marginDistribution = useMemo(() => {
    const ranges = [
      { range: '赤字', min: -Infinity, max: 0, color: '#ef4444' },
      { range: '0-5%', min: 0, max: 5, color: '#f97316' },
      { range: '5-10%', min: 5, max: 10, color: '#eab308' },
      { range: '10-15%', min: 10, max: 15, color: '#22c55e' },
      { range: '15%+', min: 15, max: Infinity, color: '#6366f1' },
    ];
    return ranges.map(({ range, min, max, color }) => ({
      range,
      count: filteredProjects.filter(p => {
        const rate = p.finalEstimate.marginRate || 0;
        return rate >= min && rate < max;
      }).length,
      color,
    }));
  }, [filteredProjects]);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 flex-shrink-0 shadow-sm">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-lg font-bold text-slate-800">プロジェクト分析</h1>
              {/* Tab Navigation */}
              <nav className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="text-sm text-slate-500">
              {data.summary.projectCount}件 | 2025年9月度
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b border-slate-200 flex-shrink-0">
        <div className="max-w-full mx-auto px-4 py-2">
          <div className="flex items-center gap-3">
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">全支社</option>
              {branches.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <select
              value={filterBusiness}
              onChange={(e) => setFilterBusiness(e.target.value)}
              className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">全事業</option>
              {businesses.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            {activeTab === 'projects' && (
              <input
                type="text"
                placeholder="案件番号・案件名で検索"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 max-w-md text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            )}
            <div className="ml-auto text-sm text-slate-500">
              絞り込み結果: <span className="font-bold text-slate-700">{filteredProjects.length}</span>件
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* 全社サマリー */}
        {activeTab === 'summary' && (
          <div className="p-4 space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500">案件数</span>
                <p className="text-3xl font-bold text-slate-800">{summary.projectCount}<span className="text-lg text-slate-400">件</span></p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500">見通し請負高</span>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(summary.totalContract)}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500">見通し粗利益</span>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(summary.totalProfit)}</p>
              </div>
              <div className={`rounded-xl p-4 border shadow-sm ${
                summary.avgMarginRate >= 10 ? 'bg-emerald-50 border-emerald-200' :
                summary.avgMarginRate >= 5 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'
              }`}>
                <span className="text-xs text-slate-500">平均粗利率</span>
                <p className={`text-3xl font-bold ${
                  summary.avgMarginRate >= 10 ? 'text-emerald-600' :
                  summary.avgMarginRate >= 5 ? 'text-amber-600' : 'text-red-600'
                }`}>{summary.avgMarginRate.toFixed(1)}%</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 shadow-sm">
                <span className="text-xs text-emerald-600">改善案件</span>
                <p className="text-3xl font-bold text-emerald-600">{summary.improvementCount}<span className="text-lg text-emerald-400">件</span></p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-200 shadow-sm">
                <span className="text-xs text-red-600">悪化案件</span>
                <p className="text-3xl font-bold text-red-600">{summary.declineCount}<span className="text-lg text-red-400">件</span></p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Branch Bar Chart */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-3">支社別 請負高</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={branchData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} tick={{ fill: '#64748b', fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} width={80} />
                      <Tooltip formatter={(value) => typeof value === 'number' ? formatCurrency(value) : value} />
                      <Bar dataKey="contract" fill="#6366f1" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Business Pie Chart */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-3">事業別 構成比</h3>
                <div className="h-64 flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={businessData}
                        dataKey="contract"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {businessData.map((entry, index) => (
                          <Cell key={entry.name} fill={BUSINESS_COLORS[entry.name] || BRANCH_COLORS[index % BRANCH_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => typeof value === 'number' ? formatCurrency(value) : value} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Margin Distribution */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-3">粗利率分布</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marginDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" name="案件数">
                        {marginDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Rankings Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Branch Margin Ranking */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-3">支社別 粗利率ランキング</h3>
                <div className="space-y-2">
                  {branchData.sort((a, b) => b.marginRate - a.marginRate).slice(0, 6).map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-orange-600' : 'bg-slate-300'
                        }`}>{i + 1}</span>
                        <span className="text-slate-700 font-medium">{item.name}</span>
                      </div>
                      <span className={`font-bold ${item.marginRate >= 10 ? 'text-emerald-600' : item.marginRate >= 5 ? 'text-amber-600' : 'text-red-600'}`}>
                        {item.marginRate.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Margin Ranking */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-3">事業別 粗利率</h3>
                <div className="space-y-2">
                  {businessData.sort((a, b) => b.marginRate - a.marginRate).map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: `${BUSINESS_COLORS[item.name] || '#94a3b8'}15` }}>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: BUSINESS_COLORS[item.name] || '#94a3b8' }} />
                        <span className="text-slate-700 font-medium">{item.name}</span>
                        <span className="text-xs text-slate-400">({item.count}件)</span>
                      </div>
                      <span className={`font-bold ${item.marginRate >= 10 ? 'text-emerald-600' : item.marginRate >= 5 ? 'text-amber-600' : 'text-red-600'}`}>
                        {item.marginRate.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decline Projects */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="text-amber-500">!</span> 粗利悪化案件 TOP5
                </h3>
                <div className="space-y-2">
                  {declineProjects.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-red-50">
                      <div>
                        <span className="text-slate-700 font-medium">{p.name}</span>
                        <span className="text-xs text-slate-400 block">{p.branch} / {p.business}</span>
                      </div>
                      <span className="text-red-600 font-bold">{p.finalEstimate.marginDiff.toFixed(1)}%</span>
                    </div>
                  ))}
                  {declineProjects.length === 0 && (
                    <p className="text-slate-400 text-sm">悪化案件はありません</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 支社別 */}
        {activeTab === 'branch' && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {branchData.slice(0, 6).map((branch, i) => (
                <div key={branch.name} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: BRANCH_COLORS[i % BRANCH_COLORS.length] }} />
                    <span className="font-medium text-slate-700">{branch.name}</span>
                  </div>
                  <p className="text-xl font-bold text-slate-800">{formatCurrency(branch.contract)}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                    <span>{branch.count}件</span>
                    <span className={branch.marginRate >= 10 ? 'text-emerald-600' : branch.marginRate >= 5 ? 'text-amber-600' : 'text-red-600'}>
                      粗利率 {branch.marginRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-3">支社別 請負高・粗利率</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={branchData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                      <YAxis yAxisId="left" tickFormatter={(v) => formatCurrency(v)} tick={{ fill: '#64748b', fontSize: 11 }} />
                      <YAxis yAxisId="right" orientation="right" unit="%" tick={{ fill: '#64748b', fontSize: 11 }} />
                      <Tooltip formatter={(value, name) => [typeof value === 'number' ? (name === 'marginRate' ? `${value.toFixed(1)}%` : formatCurrency(value)) : value, name === 'marginRate' ? '粗利率' : '請負高']} />
                      <Bar yAxisId="left" dataKey="contract" fill="#6366f1" name="請負高" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="marginRate" stroke="#22c55e" strokeWidth={2} name="粗利率" dot={{ fill: '#22c55e' }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-3">支社別 構成比</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={branchData}
                        dataKey="contract"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      >
                        {branchData.map((entry, index) => (
                          <Cell key={entry.name} fill={BRANCH_COLORS[index % BRANCH_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => typeof value === 'number' ? formatCurrency(value) : value} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 事業別 */}
        {activeTab === 'business' && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {businessData.map((business) => (
                <div key={business.name} className="bg-white rounded-xl p-4 border-l-4 shadow-sm" style={{ borderLeftColor: BUSINESS_COLORS[business.name] || '#94a3b8' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-slate-700">{business.name}</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{formatCurrency(business.contract)}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div>
                      <span className="text-slate-500">案件数</span>
                      <p className="font-medium text-slate-700">{business.count}件</p>
                    </div>
                    <div>
                      <span className="text-slate-500">粗利率</span>
                      <p className={`font-bold ${business.marginRate >= 10 ? 'text-emerald-600' : business.marginRate >= 5 ? 'text-amber-600' : 'text-red-600'}`}>
                        {business.marginRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-3">事業別 請負高・粗利益</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={businessData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                      <YAxis tickFormatter={(v) => formatCurrency(v)} tick={{ fill: '#64748b', fontSize: 11 }} />
                      <Tooltip formatter={(value) => typeof value === 'number' ? formatCurrency(value) : value} />
                      <Bar dataKey="contract" name="請負高" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="profit" name="粗利益" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-3">事業別 粗利率比較</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={businessData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" unit="%" tick={{ fill: '#64748b', fontSize: 11 }} domain={[0, 'auto']} />
                      <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} width={80} />
                      <Tooltip formatter={(value) => typeof value === 'number' ? `${value.toFixed(1)}%` : value} />
                      <Bar dataKey="marginRate" name="粗利率" radius={[0, 4, 4, 0]}>
                        {businessData.map((entry) => (
                          <Cell key={entry.name} fill={BUSINESS_COLORS[entry.name] || '#94a3b8'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 案件別 */}
        {activeTab === 'projects' && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-3">案件規模 x 粗利率 分布</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" dataKey="x" name="請負金額" unit="百万" tick={{ fill: '#64748b', fontSize: 10 }} label={{ value: '請負金額（百万円）', position: 'bottom', fontSize: 10, fill: '#94a3b8' }} />
                      <YAxis type="number" dataKey="y" name="粗利率" unit="%" tick={{ fill: '#64748b', fontSize: 10 }} domain={[-20, 40]} />
                      <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        formatter={(value, name) => [typeof value === 'number' ? (name === 'x' ? `${value.toFixed(0)}百万円` : `${value.toFixed(1)}%`) : value, name === 'x' ? '請負金額' : '粗利率']}
                      />
                      <Scatter data={scatterData}>
                        {scatterData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2 text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>良好(10%+)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>注意(0-10%)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>要対応(赤字)</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-3">ステータス別件数</h3>
                <div className="h-56 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2 border-4 border-emerald-200">
                        <span className="text-4xl font-bold text-emerald-600">{filteredProjects.filter(p => p.status === 'good').length}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-600">良好</span>
                      <span className="text-xs text-slate-400 block">粗利率10%以上</span>
                    </div>
                    <div>
                      <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2 border-4 border-amber-200">
                        <span className="text-4xl font-bold text-amber-600">{filteredProjects.filter(p => p.status === 'warning').length}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-600">注意</span>
                      <span className="text-xs text-slate-400 block">粗利率0-10%</span>
                    </div>
                    <div>
                      <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2 border-4 border-red-200">
                        <span className="text-4xl font-bold text-red-600">{filteredProjects.filter(p => p.status === 'critical').length}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-600">要対応</span>
                      <span className="text-xs text-slate-400 block">赤字案件</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                    <tr className="text-slate-600">
                      <th className="text-left px-4 py-3 font-medium">案件番号</th>
                      <th className="text-left px-4 py-3 font-medium">支社/事業</th>
                      <th className="text-right px-4 py-3 font-medium">見通し請負</th>
                      <th className="text-right px-4 py-3 font-medium">粗利率</th>
                      <th className="text-right px-4 py-3 font-medium">改善</th>
                      <th className="text-center px-4 py-3 font-medium">ステータス</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProjects.slice(0, 100).map((project) => (
                      <tr
                        key={project.id}
                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => setSelectedProject(project)}
                      >
                        <td className="px-4 py-2">
                          <div className="font-medium text-slate-800">{project.id}</div>
                          <div className="text-xs text-slate-400">{project.name}</div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-1">
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">{project.branch.replace('支社', '').replace('本社', '').replace('事業部', '')}</span>
                            <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: `${BUSINESS_COLORS[project.business] || '#94a3b8'}20`, color: BUSINESS_COLORS[project.business] || '#64748b' }}>
                              {project.business || '未設定'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right font-medium text-slate-800">
                          {formatCurrency(project.finalEstimate.contractAmount || project.initialBudget.contractAmount)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <span className={`font-bold ${
                            project.finalEstimate.marginRate >= 10 ? 'text-emerald-600' :
                            project.finalEstimate.marginRate >= 5 ? 'text-amber-600' : 'text-red-600'
                          }`}>{project.finalEstimate.marginRate.toFixed(1)}%</span>
                          <span className="text-xs text-slate-400 block">初期 {project.initialBudget.marginRate.toFixed(1)}%</span>
                        </td>
                        <td className={`px-4 py-2 text-right font-medium ${
                          project.finalEstimate.marginDiff >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {project.finalEstimate.marginDiff >= 0 ? '+' : ''}{project.finalEstimate.marginDiff.toFixed(1)}%
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span className={`inline-block w-3 h-3 rounded-full ${
                            project.status === 'good' ? 'bg-emerald-500' :
                            project.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                          }`} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-2 border-t border-slate-200 bg-slate-50 text-sm text-slate-500">
                {filteredProjects.length > 100 ? `上位100件を表示 / 全${filteredProjects.length}件` : `${filteredProjects.length}件`} | 見通し合計 {formatCurrency(summary.totalContract)}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProject(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{selectedProject.id}</h2>
                  <p className="text-sm text-slate-500">{selectedProject.branch} / {selectedProject.business}</p>
                </div>
                <button onClick={() => setSelectedProject(null)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-xs text-slate-500">見通し請負金額</span>
                  <p className="font-bold text-slate-800">{formatCurrency(selectedProject.finalEstimate.contractAmount || selectedProject.initialBudget.contractAmount)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-xs text-slate-500">見通し粗利益</span>
                  <p className="font-bold text-emerald-600">{formatCurrency(selectedProject.finalEstimate.grossProfit)}</p>
                </div>
                <div className={`p-3 rounded-lg ${selectedProject.finalEstimate.marginRate >= 10 ? 'bg-emerald-50' : selectedProject.finalEstimate.marginRate >= 5 ? 'bg-amber-50' : 'bg-red-50'}`}>
                  <span className="text-xs text-slate-500">見通し粗利率</span>
                  <p className={`font-bold ${selectedProject.finalEstimate.marginRate >= 10 ? 'text-emerald-600' : selectedProject.finalEstimate.marginRate >= 5 ? 'text-amber-600' : 'text-red-600'}`}>
                    {selectedProject.finalEstimate.marginRate.toFixed(1)}%
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${selectedProject.finalEstimate.marginDiff >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  <span className="text-xs text-slate-500">粗利率差異</span>
                  <p className={`font-bold ${selectedProject.finalEstimate.marginDiff >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {selectedProject.finalEstimate.marginDiff >= 0 ? '+' : ''}{selectedProject.finalEstimate.marginDiff.toFixed(1)}%
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-slate-700 mb-3">予算・見込み比較</h3>
              <table className="w-full text-sm mb-6">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-3 py-2 text-slate-600">項目</th>
                    <th className="text-right px-3 py-2 text-slate-600">当初予算</th>
                    <th className="text-right px-3 py-2 text-slate-600">最終見込み</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-3 py-2 text-slate-600">請負金額</td>
                    <td className="px-3 py-2 text-right text-slate-800">{formatCurrency(selectedProject.initialBudget.contractAmount)}</td>
                    <td className="px-3 py-2 text-right text-slate-800">{formatCurrency(selectedProject.finalEstimate.contractAmount)}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-slate-600">粗利率</td>
                    <td className="px-3 py-2 text-right text-slate-800">{selectedProject.initialBudget.marginRate.toFixed(1)}%</td>
                    <td className="px-3 py-2 text-right text-slate-800">{selectedProject.finalEstimate.marginRate.toFixed(1)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
