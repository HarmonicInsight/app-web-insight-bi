// 月次データ管理 - 複数月対応

export type KPIStatus = 'good' | 'warning' | 'critical';

export interface MonthlyKPIValue {
  budget: number;
  actual: number;
  variance: number;
  varianceRate: number;
}

export interface KPIItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  isHigherBetter: boolean; // true=高いほど良い, false=低いほど良い
}

export interface MonthlyData {
  month: number;
  year: number;
  label: string;
  kpis: Record<string, MonthlyKPIValue>;
}

// KPI定義
export const kpiDefinitions: KPIItem[] = [
  { id: 'revenue', name: '売上高', category: '収益', unit: '億円', isHigherBetter: true },
  { id: 'gross_profit', name: '粗利益', category: '収益', unit: '億円', isHigherBetter: true },
  { id: 'margin_rate', name: '粗利率', category: '収益', unit: '%', isHigherBetter: true },
  { id: 'operating_profit', name: '営業利益', category: '収益', unit: '億円', isHigherBetter: true },
  { id: 'orders', name: '受注金額', category: '営業', unit: '億円', isHigherBetter: true },
  { id: 'pipeline', name: 'パイプライン', category: '営業', unit: '億円', isHigherBetter: true },
  { id: 'new_deals', name: '新規商談数', category: '営業', unit: '件', isHigherBetter: true },
  { id: 'win_rate', name: '成約率', category: '営業', unit: '%', isHigherBetter: true },
  { id: 'project_count', name: '稼働PJ数', category: 'プロジェクト', unit: '件', isHigherBetter: true },
  { id: 'project_margin', name: 'PJ平均粗利率', category: 'プロジェクト', unit: '%', isHigherBetter: true },
  { id: 'red_projects', name: '赤字PJ数', category: 'プロジェクト', unit: '件', isHigherBetter: false },
  { id: 'headcount', name: '社員数', category: '人事', unit: '名', isHigherBetter: true },
  { id: 'sales_headcount', name: '営業人員', category: '人事', unit: '名', isHigherBetter: true },
  { id: 'turnover_rate', name: '離職率', category: '人事', unit: '%', isHigherBetter: false },
  { id: 'cash', name: '現預金残高', category: '財務', unit: '億円', isHigherBetter: true },
  { id: 'sga', name: '販管費', category: '財務', unit: '億円', isHigherBetter: false },
];

// 2025年度 月次データ（4月〜9月）
export const monthlyDataset: MonthlyData[] = [
  {
    month: 4, year: 2025, label: '4月',
    kpis: {
      revenue: { budget: 15.0, actual: 14.2, variance: -0.8, varianceRate: -5.3 },
      gross_profit: { budget: 2.3, actual: 2.1, variance: -0.2, varianceRate: -8.7 },
      margin_rate: { budget: 15.0, actual: 14.8, variance: -0.2, varianceRate: -1.3 },
      operating_profit: { budget: 0.9, actual: 0.8, variance: -0.1, varianceRate: -11.1 },
      orders: { budget: 8.0, actual: 7.5, variance: -0.5, varianceRate: -6.3 },
      pipeline: { budget: 95.0, actual: 92.0, variance: -3.0, varianceRate: -3.2 },
      new_deals: { budget: 28, actual: 24, variance: -4, varianceRate: -14.3 },
      win_rate: { budget: 35.0, actual: 32.0, variance: -3.0, varianceRate: -8.6 },
      project_count: { budget: 100, actual: 98, variance: -2, varianceRate: -2.0 },
      project_margin: { budget: 15.0, actual: 13.5, variance: -1.5, varianceRate: -10.0 },
      red_projects: { budget: 0, actual: 2, variance: 2, varianceRate: 0 },
      headcount: { budget: 128, actual: 126, variance: -2, varianceRate: -1.6 },
      sales_headcount: { budget: 45, actual: 40, variance: -5, varianceRate: -11.1 },
      turnover_rate: { budget: 10.0, actual: 9.2, variance: -0.8, varianceRate: -8.0 },
      cash: { budget: 20.0, actual: 21.5, variance: 1.5, varianceRate: 7.5 },
      sga: { budget: 2.8, actual: 2.7, variance: -0.1, varianceRate: -3.6 },
    }
  },
  {
    month: 5, year: 2025, label: '5月',
    kpis: {
      revenue: { budget: 15.5, actual: 15.8, variance: 0.3, varianceRate: 1.9 },
      gross_profit: { budget: 2.4, actual: 2.5, variance: 0.1, varianceRate: 4.2 },
      margin_rate: { budget: 15.0, actual: 15.8, variance: 0.8, varianceRate: 5.3 },
      operating_profit: { budget: 0.95, actual: 1.0, variance: 0.05, varianceRate: 5.3 },
      orders: { budget: 8.2, actual: 9.0, variance: 0.8, varianceRate: 9.8 },
      pipeline: { budget: 98.0, actual: 100.0, variance: 2.0, varianceRate: 2.0 },
      new_deals: { budget: 30, actual: 28, variance: -2, varianceRate: -6.7 },
      win_rate: { budget: 35.0, actual: 34.0, variance: -1.0, varianceRate: -2.9 },
      project_count: { budget: 105, actual: 108, variance: 3, varianceRate: 2.9 },
      project_margin: { budget: 15.0, actual: 14.2, variance: -0.8, varianceRate: -5.3 },
      red_projects: { budget: 0, actual: 2, variance: 2, varianceRate: 0 },
      headcount: { budget: 130, actual: 128, variance: -2, varianceRate: -1.5 },
      sales_headcount: { budget: 46, actual: 41, variance: -5, varianceRate: -10.9 },
      turnover_rate: { budget: 10.0, actual: 8.8, variance: -1.2, varianceRate: -12.0 },
      cash: { budget: 21.0, actual: 22.8, variance: 1.8, varianceRate: 8.6 },
      sga: { budget: 2.8, actual: 2.65, variance: -0.15, varianceRate: -5.4 },
    }
  },
  {
    month: 6, year: 2025, label: '6月',
    kpis: {
      revenue: { budget: 17.0, actual: 16.5, variance: -0.5, varianceRate: -2.9 },
      gross_profit: { budget: 2.6, actual: 2.4, variance: -0.2, varianceRate: -7.7 },
      margin_rate: { budget: 15.0, actual: 14.5, variance: -0.5, varianceRate: -3.3 },
      operating_profit: { budget: 1.0, actual: 0.9, variance: -0.1, varianceRate: -10.0 },
      orders: { budget: 8.5, actual: 8.8, variance: 0.3, varianceRate: 3.5 },
      pipeline: { budget: 102.0, actual: 105.0, variance: 3.0, varianceRate: 2.9 },
      new_deals: { budget: 30, actual: 26, variance: -4, varianceRate: -13.3 },
      win_rate: { budget: 35.0, actual: 33.5, variance: -1.5, varianceRate: -4.3 },
      project_count: { budget: 110, actual: 112, variance: 2, varianceRate: 1.8 },
      project_margin: { budget: 15.0, actual: 13.0, variance: -2.0, varianceRate: -13.3 },
      red_projects: { budget: 0, actual: 3, variance: 3, varianceRate: 0 },
      headcount: { budget: 132, actual: 129, variance: -3, varianceRate: -2.3 },
      sales_headcount: { budget: 47, actual: 41, variance: -6, varianceRate: -12.8 },
      turnover_rate: { budget: 10.0, actual: 9.5, variance: -0.5, varianceRate: -5.0 },
      cash: { budget: 22.0, actual: 23.5, variance: 1.5, varianceRate: 6.8 },
      sga: { budget: 2.9, actual: 2.75, variance: -0.15, varianceRate: -5.2 },
    }
  },
  {
    month: 7, year: 2025, label: '7月',
    kpis: {
      revenue: { budget: 16.0, actual: 15.5, variance: -0.5, varianceRate: -3.1 },
      gross_profit: { budget: 2.4, actual: 2.2, variance: -0.2, varianceRate: -8.3 },
      margin_rate: { budget: 15.0, actual: 14.2, variance: -0.8, varianceRate: -5.3 },
      operating_profit: { budget: 0.95, actual: 0.85, variance: -0.1, varianceRate: -10.5 },
      orders: { budget: 8.3, actual: 8.5, variance: 0.2, varianceRate: 2.4 },
      pipeline: { budget: 105.0, actual: 108.0, variance: 3.0, varianceRate: 2.9 },
      new_deals: { budget: 30, actual: 25, variance: -5, varianceRate: -16.7 },
      win_rate: { budget: 35.0, actual: 32.0, variance: -3.0, varianceRate: -8.6 },
      project_count: { budget: 112, actual: 115, variance: 3, varianceRate: 2.7 },
      project_margin: { budget: 15.0, actual: 12.5, variance: -2.5, varianceRate: -16.7 },
      red_projects: { budget: 0, actual: 3, variance: 3, varianceRate: 0 },
      headcount: { budget: 133, actual: 130, variance: -3, varianceRate: -2.3 },
      sales_headcount: { budget: 48, actual: 41, variance: -7, varianceRate: -14.6 },
      turnover_rate: { budget: 10.0, actual: 8.5, variance: -1.5, varianceRate: -15.0 },
      cash: { budget: 23.0, actual: 24.0, variance: 1.0, varianceRate: 4.3 },
      sga: { budget: 2.85, actual: 2.7, variance: -0.15, varianceRate: -5.3 },
    }
  },
  {
    month: 8, year: 2025, label: '8月',
    kpis: {
      revenue: { budget: 14.5, actual: 13.8, variance: -0.7, varianceRate: -4.8 },
      gross_profit: { budget: 2.2, actual: 2.0, variance: -0.2, varianceRate: -9.1 },
      margin_rate: { budget: 15.0, actual: 14.5, variance: -0.5, varianceRate: -3.3 },
      operating_profit: { budget: 0.85, actual: 0.75, variance: -0.1, varianceRate: -11.8 },
      orders: { budget: 7.5, actual: 7.8, variance: 0.3, varianceRate: 4.0 },
      pipeline: { budget: 108.0, actual: 112.0, variance: 4.0, varianceRate: 3.7 },
      new_deals: { budget: 25, actual: 22, variance: -3, varianceRate: -12.0 },
      win_rate: { budget: 35.0, actual: 33.0, variance: -2.0, varianceRate: -5.7 },
      project_count: { budget: 115, actual: 118, variance: 3, varianceRate: 2.6 },
      project_margin: { budget: 15.0, actual: 12.0, variance: -3.0, varianceRate: -20.0 },
      red_projects: { budget: 0, actual: 3, variance: 3, varianceRate: 0 },
      headcount: { budget: 134, actual: 131, variance: -3, varianceRate: -2.2 },
      sales_headcount: { budget: 49, actual: 42, variance: -7, varianceRate: -14.3 },
      turnover_rate: { budget: 10.0, actual: 8.2, variance: -1.8, varianceRate: -18.0 },
      cash: { budget: 24.0, actual: 25.0, variance: 1.0, varianceRate: 4.2 },
      sga: { budget: 2.75, actual: 2.6, variance: -0.15, varianceRate: -5.5 },
    }
  },
  {
    month: 9, year: 2025, label: '9月',
    kpis: {
      revenue: { budget: 16.5, actual: 15.2, variance: -1.3, varianceRate: -7.9 },
      gross_profit: { budget: 2.5, actual: 2.2, variance: -0.3, varianceRate: -12.0 },
      margin_rate: { budget: 15.0, actual: 14.5, variance: -0.5, varianceRate: -3.3 },
      operating_profit: { budget: 1.0, actual: 0.85, variance: -0.15, varianceRate: -15.0 },
      orders: { budget: 8.5, actual: 9.2, variance: 0.7, varianceRate: 8.2 },
      pipeline: { budget: 110.0, actual: 115.0, variance: 5.0, varianceRate: 4.5 },
      new_deals: { budget: 30, actual: 25, variance: -5, varianceRate: -16.7 },
      win_rate: { budget: 35.0, actual: 32.0, variance: -3.0, varianceRate: -8.6 },
      project_count: { budget: 118, actual: 120, variance: 2, varianceRate: 1.7 },
      project_margin: { budget: 15.0, actual: 12.2, variance: -2.8, varianceRate: -18.7 },
      red_projects: { budget: 0, actual: 3, variance: 3, varianceRate: 0 },
      headcount: { budget: 135, actual: 132, variance: -3, varianceRate: -2.2 },
      sales_headcount: { budget: 50, actual: 42, variance: -8, varianceRate: -16.0 },
      turnover_rate: { budget: 10.0, actual: 8.5, variance: -1.5, varianceRate: -15.0 },
      cash: { budget: 22.0, actual: 25.3, variance: 3.3, varianceRate: 15.0 },
      sga: { budget: 2.8, actual: 2.6, variance: -0.2, varianceRate: -7.1 },
    }
  },
];

// 累計計算
export function calculateYTD(data: MonthlyData[], upToMonth: number): Record<string, MonthlyKPIValue> {
  const result: Record<string, MonthlyKPIValue> = {};
  const monthsData = data.filter(d => d.month <= upToMonth);

  kpiDefinitions.forEach(kpi => {
    let budgetSum = 0;
    let actualSum = 0;

    // 率系のKPIは平均を取る
    const isRate = kpi.unit === '%';

    monthsData.forEach(m => {
      const v = m.kpis[kpi.id];
      if (v) {
        budgetSum += v.budget;
        actualSum += v.actual;
      }
    });

    if (isRate) {
      budgetSum = budgetSum / monthsData.length;
      actualSum = actualSum / monthsData.length;
    }

    const variance = actualSum - budgetSum;
    const varianceRate = budgetSum !== 0 ? (variance / budgetSum) * 100 : 0;

    result[kpi.id] = {
      budget: Math.round(budgetSum * 10) / 10,
      actual: Math.round(actualSum * 10) / 10,
      variance: Math.round(variance * 10) / 10,
      varianceRate: Math.round(varianceRate * 10) / 10,
    };
  });

  return result;
}

// 通期見込（簡易計算）
export function calculateForecast(ytd: Record<string, MonthlyKPIValue>, currentMonth: number): Record<string, { budget: number; forecast: number; variance: number; varianceRate: number }> {
  const result: Record<string, { budget: number; forecast: number; variance: number; varianceRate: number }> = {};
  const remainingMonths = 12 - currentMonth + 3; // 4月始まりで3月まで
  const elapsedMonths = currentMonth - 3; // 4月から数えた月数

  // 通期予算（仮）
  const fyBudget: Record<string, number> = {
    revenue: 200.0, gross_profit: 30.0, margin_rate: 15.0, operating_profit: 12.0,
    orders: 100.0, pipeline: 120.0, new_deals: 360, win_rate: 35.0,
    project_count: 130, project_margin: 15.0, red_projects: 0,
    headcount: 145, sales_headcount: 55, turnover_rate: 10.0,
    cash: 30.0, sga: 34.0,
  };

  kpiDefinitions.forEach(kpi => {
    const ytdValue = ytd[kpi.id];
    const budget = fyBudget[kpi.id] || 0;

    // 見込み = 累計実績 + (累計実績/経過月数) * 残月数
    const isRate = kpi.unit === '%';
    let forecast: number;

    if (isRate) {
      forecast = ytdValue.actual; // 率は直近値をそのまま使用
    } else {
      const monthlyAvg = ytdValue.actual / elapsedMonths;
      forecast = ytdValue.actual + monthlyAvg * remainingMonths;
    }

    forecast = Math.round(forecast * 10) / 10;
    const variance = forecast - budget;
    const varianceRate = budget !== 0 ? (variance / budget) * 100 : 0;

    result[kpi.id] = {
      budget,
      forecast,
      variance: Math.round(variance * 10) / 10,
      varianceRate: Math.round(varianceRate * 10) / 10,
    };
  });

  return result;
}

// KPIステータス判定
export function getKPIStatus(varianceRate: number, isHigherBetter: boolean): KPIStatus {
  const effectiveRate = isHigherBetter ? varianceRate : -varianceRate;
  if (effectiveRate >= -3) return 'good';
  if (effectiveRate >= -10) return 'warning';
  return 'critical';
}

// ステータス設定
export const statusConfig: Record<KPIStatus, { label: string; color: string; bg: string }> = {
  good: { label: '順調', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  warning: { label: '注意', color: 'text-amber-700', bg: 'bg-amber-100' },
  critical: { label: '要対策', color: 'text-red-700', bg: 'bg-red-100' },
};

// カテゴリ一覧
export const categories = ['収益', '営業', 'プロジェクト', '人事', '財務'];
