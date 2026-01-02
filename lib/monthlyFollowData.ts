// 月次フォロー用データ型定義とサンプルデータ

export type VarianceStatus = 'on_track' | 'minor_variance' | 'major_variance' | 'critical';

export interface MonthlyKPI {
  id: string;
  name: string;
  category: string;
  unit: string;
  // 当月
  budgetMonth: number;
  actualMonth: number;
  varianceMonth: number;
  varianceRateMonth: number;
  // 累計
  budgetYTD: number;
  actualYTD: number;
  varianceYTD: number;
  varianceRateYTD: number;
  // 通期
  budgetFY: number;
  forecastFY: number;
  varianceFY: number;
  varianceRateFY: number;
  // 前年比
  actualPY: number;
  yoyRate: number;
  // ステータス
  status: VarianceStatus;
  trend: 'improving' | 'stable' | 'declining';
  // 分析コメント
  varianceComment?: string;
  actionRequired?: boolean;
}

export interface VarianceAnalysis {
  kpiId: string;
  kpiName: string;
  varianceAmount: number;
  varianceRate: number;
  factors: {
    factor: string;
    impact: number;
    type: 'positive' | 'negative';
  }[];
  rootCause: string;
  correctionAction: string;
  owner: string;
  dueDate: string;
  status: 'open' | 'in_progress' | 'completed';
}

export interface ForecastUpdate {
  kpiId: string;
  kpiName: string;
  originalBudget: number;
  previousForecast: number;
  currentForecast: number;
  changeAmount: number;
  changeReason: string;
  updatedAt: string;
  updatedBy: string;
}

export interface MonthlyAction {
  id: string;
  title: string;
  description: string;
  relatedKPI: string;
  owner: string;
  priority: 'high' | 'medium' | 'low';
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  dueDate: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyReviewData {
  period: {
    fiscalYear: string;
    month: number;
    monthName: string;
    closingDate: string;
  };
  summary: {
    revenueAchievement: number;
    profitAchievement: number;
    kpiOnTrack: number;
    kpiTotal: number;
    actionsOpen: number;
    actionsCompleted: number;
  };
  kpis: MonthlyKPI[];
  varianceAnalyses: VarianceAnalysis[];
  forecastUpdates: ForecastUpdate[];
  actions: MonthlyAction[];
}

// ステータス設定
export const varianceStatusConfig: Record<VarianceStatus, { label: string; color: string; bgColor: string }> = {
  on_track: { label: '順調', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  minor_variance: { label: '軽微差異', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  major_variance: { label: '要注意', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  critical: { label: '要対策', color: 'text-red-700', bgColor: 'bg-red-100' },
};

// サンプルデータ：2025年9月度月次レビュー
export const sampleMonthlyReview: MonthlyReviewData = {
  period: {
    fiscalYear: '2025年度',
    month: 9,
    monthName: '9月',
    closingDate: '2025-09-30',
  },
  summary: {
    revenueAchievement: 92.5,
    profitAchievement: 90.0,
    kpiOnTrack: 8,
    kpiTotal: 12,
    actionsOpen: 5,
    actionsCompleted: 3,
  },
  kpis: [
    {
      id: 'kpi-revenue',
      name: '売上高',
      category: '収益',
      unit: '億円',
      budgetMonth: 16.5,
      actualMonth: 15.2,
      varianceMonth: -1.3,
      varianceRateMonth: -7.9,
      budgetYTD: 100.0,
      actualYTD: 92.5,
      varianceYTD: -7.5,
      varianceRateYTD: -7.5,
      budgetFY: 200.0,
      forecastFY: 188.0,
      varianceFY: -12.0,
      varianceRateFY: -6.0,
      actualPY: 88.0,
      yoyRate: 5.1,
      status: 'major_variance',
      trend: 'stable',
      varianceComment: '大型案件2件の検収が10月にずれ込み',
      actionRequired: true,
    },
    {
      id: 'kpi-gross-profit',
      name: '粗利益',
      category: '収益',
      unit: '億円',
      budgetMonth: 2.5,
      actualMonth: 2.2,
      varianceMonth: -0.3,
      varianceRateMonth: -12.0,
      budgetYTD: 15.0,
      actualYTD: 13.5,
      varianceYTD: -1.5,
      varianceRateYTD: -10.0,
      budgetFY: 30.0,
      forecastFY: 27.5,
      varianceFY: -2.5,
      varianceRateFY: -8.3,
      actualPY: 12.1,
      yoyRate: 11.6,
      status: 'major_variance',
      trend: 'declining',
      varianceComment: '東北支社の粗利率低下が影響',
      actionRequired: true,
    },
    {
      id: 'kpi-margin-rate',
      name: '粗利率',
      category: '収益',
      unit: '%',
      budgetMonth: 15.0,
      actualMonth: 14.5,
      varianceMonth: -0.5,
      varianceRateMonth: -3.3,
      budgetYTD: 15.0,
      actualYTD: 14.6,
      varianceYTD: -0.4,
      varianceRateYTD: -2.7,
      budgetFY: 15.0,
      forecastFY: 14.6,
      varianceFY: -0.4,
      varianceRateFY: -2.7,
      actualPY: 13.8,
      yoyRate: 5.8,
      status: 'minor_variance',
      trend: 'improving',
    },
    {
      id: 'kpi-orders',
      name: '受注金額',
      category: '営業',
      unit: '億円',
      budgetMonth: 8.5,
      actualMonth: 9.2,
      varianceMonth: 0.7,
      varianceRateMonth: 8.2,
      budgetYTD: 50.0,
      actualYTD: 52.3,
      varianceYTD: 2.3,
      varianceRateYTD: 4.6,
      budgetFY: 100.0,
      forecastFY: 105.0,
      varianceFY: 5.0,
      varianceRateFY: 5.0,
      actualPY: 48.0,
      yoyRate: 9.0,
      status: 'on_track',
      trend: 'improving',
      varianceComment: 'SaaS案件の好調が継続',
    },
    {
      id: 'kpi-pipeline',
      name: 'パイプライン',
      category: '営業',
      unit: '億円',
      budgetMonth: 110.0,
      actualMonth: 115.0,
      varianceMonth: 5.0,
      varianceRateMonth: 4.5,
      budgetYTD: 110.0,
      actualYTD: 115.0,
      varianceYTD: 5.0,
      varianceRateYTD: 4.5,
      budgetFY: 120.0,
      forecastFY: 125.0,
      varianceFY: 5.0,
      varianceRateFY: 4.2,
      actualPY: 98.0,
      yoyRate: 17.3,
      status: 'on_track',
      trend: 'improving',
    },
    {
      id: 'kpi-new-deals',
      name: '新規商談数',
      category: '営業',
      unit: '件',
      budgetMonth: 30,
      actualMonth: 25,
      varianceMonth: -5,
      varianceRateMonth: -16.7,
      budgetYTD: 180,
      actualYTD: 156,
      varianceYTD: -24,
      varianceRateYTD: -13.3,
      budgetFY: 360,
      forecastFY: 320,
      varianceFY: -40,
      varianceRateFY: -11.1,
      actualPY: 165,
      yoyRate: -5.5,
      status: 'critical',
      trend: 'declining',
      varianceComment: '営業人員不足により新規開拓が停滞',
      actionRequired: true,
    },
    {
      id: 'kpi-project-margin',
      name: 'PJ平均粗利率',
      category: 'プロジェクト',
      unit: '%',
      budgetMonth: 15.0,
      actualMonth: 12.2,
      varianceMonth: -2.8,
      varianceRateMonth: -18.7,
      budgetYTD: 15.0,
      actualYTD: 12.2,
      varianceYTD: -2.8,
      varianceRateYTD: -18.7,
      budgetFY: 15.0,
      forecastFY: 13.0,
      varianceFY: -2.0,
      varianceRateFY: -13.3,
      actualPY: 11.5,
      yoyRate: 6.1,
      status: 'critical',
      trend: 'stable',
      varianceComment: '赤字PJ3件が全体を押し下げ',
      actionRequired: true,
    },
    {
      id: 'kpi-red-projects',
      name: '赤字PJ数',
      category: 'プロジェクト',
      unit: '件',
      budgetMonth: 0,
      actualMonth: 3,
      varianceMonth: 3,
      varianceRateMonth: 0,
      budgetYTD: 0,
      actualYTD: 3,
      varianceYTD: 3,
      varianceRateYTD: 0,
      budgetFY: 0,
      forecastFY: 2,
      varianceFY: 2,
      varianceRateFY: 0,
      actualPY: 2,
      yoyRate: 50.0,
      status: 'critical',
      trend: 'stable',
      varianceComment: '継続判断が必要',
      actionRequired: true,
    },
    {
      id: 'kpi-headcount',
      name: '社員数',
      category: '人事',
      unit: '名',
      budgetMonth: 135,
      actualMonth: 132,
      varianceMonth: -3,
      varianceRateMonth: -2.2,
      budgetYTD: 135,
      actualYTD: 132,
      varianceYTD: -3,
      varianceRateYTD: -2.2,
      budgetFY: 145,
      forecastFY: 140,
      varianceFY: -5,
      varianceRateFY: -3.4,
      actualPY: 125,
      yoyRate: 5.6,
      status: 'minor_variance',
      trend: 'stable',
      varianceComment: '採用計画に対し3名の遅れ',
    },
    {
      id: 'kpi-sales-headcount',
      name: '営業人員',
      category: '人事',
      unit: '名',
      budgetMonth: 50,
      actualMonth: 42,
      varianceMonth: -8,
      varianceRateMonth: -16.0,
      budgetYTD: 50,
      actualYTD: 42,
      varianceYTD: -8,
      varianceRateYTD: -16.0,
      budgetFY: 55,
      forecastFY: 48,
      varianceFY: -7,
      varianceRateFY: -12.7,
      actualPY: 40,
      yoyRate: 5.0,
      status: 'critical',
      trend: 'stable',
      varianceComment: '採用難易度上昇により計画未達',
      actionRequired: true,
    },
    {
      id: 'kpi-cash',
      name: '現預金残高',
      category: '財務',
      unit: '億円',
      budgetMonth: 22.0,
      actualMonth: 25.3,
      varianceMonth: 3.3,
      varianceRateMonth: 15.0,
      budgetYTD: 22.0,
      actualYTD: 25.3,
      varianceYTD: 3.3,
      varianceRateYTD: 15.0,
      budgetFY: 25.0,
      forecastFY: 28.0,
      varianceFY: 3.0,
      varianceRateFY: 12.0,
      actualPY: 20.5,
      yoyRate: 23.4,
      status: 'on_track',
      trend: 'improving',
    },
    {
      id: 'kpi-sga',
      name: '販管費',
      category: '財務',
      unit: '億円',
      budgetMonth: 2.8,
      actualMonth: 2.6,
      varianceMonth: -0.2,
      varianceRateMonth: -7.1,
      budgetYTD: 17.0,
      actualYTD: 15.8,
      varianceYTD: -1.2,
      varianceRateYTD: -7.1,
      budgetFY: 34.0,
      forecastFY: 32.0,
      varianceFY: -2.0,
      varianceRateFY: -5.9,
      actualPY: 16.5,
      yoyRate: -4.2,
      status: 'on_track',
      trend: 'stable',
      varianceComment: 'コスト削減施策が奏功',
    },
  ],
  varianceAnalyses: [
    {
      kpiId: 'kpi-revenue',
      kpiName: '売上高',
      varianceAmount: -7.5,
      varianceRate: -7.5,
      factors: [
        { factor: '大型案件検収ずれ（A社、B社）', impact: -5.0, type: 'negative' },
        { factor: '東北支社の売上低迷', impact: -3.5, type: 'negative' },
        { factor: 'SaaS事業の好調', impact: 1.0, type: 'positive' },
      ],
      rootCause: '大型案件の検収時期が当初計画から10月にずれ込んだこと、および東北支社の営業力低下が主因',
      correctionAction: '①A社・B社との調整を継続し10月検収を確実に ②東北支社へ本社営業の支援派遣',
      owner: '営業本部長',
      dueDate: '2025-10-15',
      status: 'in_progress',
    },
    {
      kpiId: 'kpi-new-deals',
      kpiName: '新規商談数',
      varianceAmount: -24,
      varianceRate: -13.3,
      factors: [
        { factor: '営業人員不足（8名）', impact: -18, type: 'negative' },
        { factor: '既存顧客対応の増加', impact: -8, type: 'negative' },
        { factor: 'Webマーケティング強化', impact: 2, type: 'positive' },
      ],
      rootCause: '営業人員の採用が計画比8名不足しており、新規開拓に充てるリソースが不足',
      correctionAction: '①中途採用を最優先で推進 ②外部パートナーの活用検討 ③インサイドセールス強化',
      owner: '人事部長',
      dueDate: '2025-10-31',
      status: 'in_progress',
    },
    {
      kpiId: 'kpi-project-margin',
      kpiName: 'PJ平均粗利率',
      varianceAmount: -2.8,
      varianceRate: -18.7,
      factors: [
        { factor: '赤字PJ3件の影響', impact: -2.0, type: 'negative' },
        { factor: '外注費の増加', impact: -1.2, type: 'negative' },
        { factor: '工数管理の改善', impact: 0.4, type: 'positive' },
      ],
      rootCause: '要件定義の甘さによるスコープクリープが赤字PJの主因。外注依存度も上昇',
      correctionAction: '①赤字PJ3件の継続判断を実施 ②要件定義プロセスの強化 ③内製化推進',
      owner: '開発本部長',
      dueDate: '2025-10-10',
      status: 'open',
    },
  ],
  forecastUpdates: [
    {
      kpiId: 'kpi-revenue',
      kpiName: '売上高',
      originalBudget: 200.0,
      previousForecast: 192.0,
      currentForecast: 188.0,
      changeAmount: -4.0,
      changeReason: '東北支社の下期見通しを下方修正（-3億円）、大型案件リスクを織り込み（-1億円）',
      updatedAt: '2025-09-28',
      updatedBy: '経営企画部',
    },
    {
      kpiId: 'kpi-gross-profit',
      kpiName: '粗利益',
      originalBudget: 30.0,
      previousForecast: 28.5,
      currentForecast: 27.5,
      changeAmount: -1.0,
      changeReason: '売上減に伴う粗利減（-0.6億円）、粗利率低下影響（-0.4億円）',
      updatedAt: '2025-09-28',
      updatedBy: '経営企画部',
    },
    {
      kpiId: 'kpi-orders',
      kpiName: '受注金額',
      originalBudget: 100.0,
      previousForecast: 102.0,
      currentForecast: 105.0,
      changeAmount: 3.0,
      changeReason: 'SaaS案件の好調により上方修正（+3億円）',
      updatedAt: '2025-09-28',
      updatedBy: '営業企画部',
    },
  ],
  actions: [
    {
      id: 'act-001',
      title: '東北支社への営業支援派遣',
      description: '本社営業メンバー2名を東北支社に3ヶ月間派遣し、大型案件の獲得を支援',
      relatedKPI: '売上高',
      owner: '営業本部長',
      priority: 'high',
      status: 'in_progress',
      dueDate: '2025-12-31',
      progress: 30,
      createdAt: '2025-09-15',
      updatedAt: '2025-09-28',
    },
    {
      id: 'act-002',
      title: '営業人員の緊急採用',
      description: '中途採用を強化し、Q3中に5名の営業人員を確保',
      relatedKPI: '営業人員',
      owner: '人事部長',
      priority: 'high',
      status: 'in_progress',
      dueDate: '2025-12-31',
      progress: 40,
      createdAt: '2025-08-01',
      updatedAt: '2025-09-28',
    },
    {
      id: 'act-003',
      title: '赤字PJ継続判断会議',
      description: '赤字PJ3件について、継続/中止/縮小の判断を経営会議で実施',
      relatedKPI: '赤字PJ数',
      owner: '開発本部長',
      priority: 'high',
      status: 'not_started',
      dueDate: '2025-10-10',
      progress: 0,
      createdAt: '2025-09-20',
      updatedAt: '2025-09-28',
    },
    {
      id: 'act-004',
      title: '要件定義プロセス改善',
      description: '要件定義フェーズでのチェックリスト導入とレビュー体制強化',
      relatedKPI: 'PJ平均粗利率',
      owner: 'PMO',
      priority: 'medium',
      status: 'in_progress',
      dueDate: '2025-11-30',
      progress: 60,
      createdAt: '2025-07-01',
      updatedAt: '2025-09-28',
    },
    {
      id: 'act-005',
      title: 'インサイドセールス立ち上げ',
      description: '営業人員不足を補うため、インサイドセールスチームを新設',
      relatedKPI: '新規商談数',
      owner: '営業企画部長',
      priority: 'medium',
      status: 'in_progress',
      dueDate: '2025-11-15',
      progress: 50,
      createdAt: '2025-08-15',
      updatedAt: '2025-09-28',
    },
  ],
};
