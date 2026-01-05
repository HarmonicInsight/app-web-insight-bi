'use client';

// Internationalization (i18n) utility

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Locale = 'ja' | 'en';

export interface Translations {
  // Common
  common: {
    save: string;
    cancel: string;
    close: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    filter: string;
    all: string;
    none: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    confirm: string;
    back: string;
    next: string;
    submit: string;
    reset: string;
    clear: string;
    yes: string;
    no: string;
    ok: string;
    total: string;
    count: string;
    average: string;
    million: string;
    billion: string;
    percent: string;
    month: string;
    year: string;
    date: string;
    status: string;
    action: string;
    details: string;
    summary: string;
    settings: string;
    help: string;
    logout: string;
    login: string;
  };
  // Navigation
  nav: {
    monthly: string;
    monthlyDesc: string;
    pipeline: string;
    pipelineDesc: string;
    analytics: string;
    analyticsDesc: string;
    charts: string;
    company: string;
    kpiTree: string;
  };
  // Dashboard
  dashboard: {
    title: string;
    fiscalYear: string;
    asOf: string;
    dataManagement: string;
    sessionTimeout: string;
    sessionTimeoutMessage: string;
  };
  // Pipeline
  pipeline: {
    title: string;
    addDeal: string;
    stage: string;
    amount: string;
    customer: string;
    owner: string;
    department: string;
    subTeam: string;
    members: string;
    expectedClose: string;
    grossMargin: string;
    projectType: string;
    newProject: string;
    continuingProject: string;
    events: string;
    eventHistory: string;
    nextAction: string;
    addEvent: string;
    comment: string;
    noEvents: string;
    notSet: string;
    noMatchingDeals: string;
    viewMode: string;
    planComparison: string;
    import: string;
    stageSummary: string;
    clickToFilter: string;
    weighted: string;
    yearlyOverview: string;
    annualTarget: string;
    revenue: string;
    budget: string;
    plTotal: string;
    dealCount: string;
    monthClosed: string;
  };
  // Stages
  stages: {
    A: string;
    ADesc: string;
    B: string;
    BDesc: string;
    C: string;
    CDesc: string;
    D: string;
    DDesc: string;
    O: string;
    ODesc: string;
  };
  // Events
  events: {
    initial_contact: string;
    proposal: string;
    negotiation: string;
    contract: string;
    delivery: string;
    other: string;
  };
  // Plan Comparison
  plan: {
    title: string;
    versionComparison: string;
    planTotal: string;
    currentStack: string;
    variance: string;
    achievementRate: string;
    active: string;
    firstHalf: string;
    secondHalf: string;
    monthlyComparison: string;
    stageBreakdown: string;
  };
  // Excel Import
  import: {
    title: string;
    description: string;
    dragDrop: string;
    fileFormat: string;
    selectSheet: string;
    preview: string;
    execute: string;
    complete: string;
    detected: string;
    totalAmount: string;
    warnings: string;
    errors: string;
    importedCount: string;
  };
  // Analytics
  analytics: {
    title: string;
    companyPerformance: string;
    branchComparison: string;
    backlog: string;
    forecast: string;
    overview: string;
    revenue: string;
    grossProfit: string;
    yoy: string;
    achievement: string;
  };
  // KPI Tree
  kpi: {
    title: string;
    departmentSummary: string;
    decisions: string;
    urgent: string;
    normal: string;
    low: string;
  };
  // Login
  login: {
    title: string;
    subtitle: string;
    username: string;
    password: string;
    usernamePlaceholder: string;
    passwordPlaceholder: string;
    submit: string;
    submitting: string;
    error: string;
    serverError: string;
  };
  // Months
  months: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
  };
}

// Japanese translations
export const ja: Translations = {
  common: {
    save: '保存',
    cancel: 'キャンセル',
    close: '閉じる',
    delete: '削除',
    edit: '編集',
    add: '追加',
    search: '検索',
    filter: 'フィルター',
    all: 'すべて',
    none: 'なし',
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功',
    warning: '警告',
    confirm: '確認',
    back: '戻る',
    next: '次へ',
    submit: '送信',
    reset: 'リセット',
    clear: 'クリア',
    yes: 'はい',
    no: 'いいえ',
    ok: 'OK',
    total: '合計',
    count: '件',
    average: '平均',
    million: '百万',
    billion: '億',
    percent: '%',
    month: '月',
    year: '年',
    date: '日付',
    status: 'ステータス',
    action: 'アクション',
    details: '詳細',
    summary: 'サマリー',
    settings: '設定',
    help: 'ヘルプ',
    logout: 'ログアウト',
    login: 'ログイン',
  },
  nav: {
    monthly: '月次管理',
    monthlyDesc: 'KPI予実・アクション',
    pipeline: 'パイプライン',
    pipelineDesc: '案件・計画管理',
    analytics: '分析',
    analyticsDesc: 'グラフ・詳細分析',
    charts: 'グラフ集',
    company: '全社業績',
    kpiTree: 'KPIツリー',
  },
  dashboard: {
    title: 'InsightBI 経営ダッシュボード',
    fiscalYear: '会計年度',
    asOf: '時点',
    dataManagement: 'データ管理',
    sessionTimeout: 'セッションタイムアウト',
    sessionTimeoutMessage: 'セッションがまもなく期限切れになります。操作を続けるか、再度ログインしてください。',
  },
  pipeline: {
    title: 'パイプライン管理',
    addDeal: '+ 案件追加',
    stage: 'ステージ',
    amount: '金額',
    customer: '顧客',
    owner: '担当',
    department: '部署',
    subTeam: 'サブチーム',
    members: 'メンバー',
    expectedClose: '受注予定',
    grossMargin: '粗利率',
    projectType: '種別',
    newProject: '新規',
    continuingProject: '継続',
    events: 'イベント',
    eventHistory: 'イベント履歴',
    nextAction: 'ネクストアクション',
    addEvent: '+ イベント追加',
    comment: 'コメント',
    noEvents: 'イベントなし',
    notSet: '未設定',
    noMatchingDeals: '条件に一致する案件がありません',
    viewMode: '表示モード',
    planComparison: '計画比較',
    import: 'インポート',
    stageSummary: '確度別サマリー',
    clickToFilter: 'クリックでフィルター',
    weighted: '見込',
    yearlyOverview: '年間売上・パイプライン',
    annualTarget: '通期目標',
    revenue: '売上',
    budget: '予算',
    plTotal: 'PL総額',
    dealCount: '件数',
    monthClosed: '月次締め済',
  },
  stages: {
    A: 'A案件',
    ADesc: '受注確定・契約済み',
    B: 'B案件',
    BDesc: '受注・契約未締結',
    C: 'C案件',
    CDesc: '継続案件・受注見込み',
    D: 'D案件',
    DDesc: '提案済み・可否未定',
    O: 'O案件',
    ODesc: '白地・情報収集段階',
  },
  events: {
    initial_contact: '初回接触',
    proposal: '提案',
    negotiation: '交渉',
    contract: '契約',
    delivery: '納品',
    other: 'その他',
  },
  plan: {
    title: '計画比較',
    versionComparison: '計画バージョン比較',
    planTotal: '計画総額',
    currentStack: '現在積上',
    variance: '差異',
    achievementRate: '達成率',
    active: 'アクティブ',
    firstHalf: '上期',
    secondHalf: '下期',
    monthlyComparison: '月別計画比較',
    stageBreakdown: '確度別内訳',
  },
  import: {
    title: 'Excelインポート',
    description: 'アカウントフォロー形式のExcelファイルをインポート',
    dragDrop: 'Excelファイルをドラッグ＆ドロップ、またはクリックして選択',
    fileFormat: '.xlsx, .xls 形式に対応',
    selectSheet: 'インポートするシート',
    preview: 'プレビュー',
    execute: 'インポート実行',
    complete: 'インポート完了',
    detected: '件の案件を検出',
    totalAmount: '総額',
    warnings: '警告',
    errors: 'エラー',
    importedCount: '件の案件をインポートしました',
  },
  analytics: {
    title: '分析',
    companyPerformance: '全社業績',
    branchComparison: '支社比較',
    backlog: 'バックログ',
    forecast: '予測',
    overview: '概要',
    revenue: '売上高',
    grossProfit: '粗利益',
    yoy: '前年比',
    achievement: '達成率',
  },
  kpi: {
    title: 'KPIツリー',
    departmentSummary: '部門別サマリー',
    decisions: '意思決定',
    urgent: '緊急',
    normal: '通常',
    low: '低',
  },
  login: {
    title: 'InsightBI',
    subtitle: '経営ダッシュボード',
    username: 'ユーザー名',
    password: 'パスワード',
    usernamePlaceholder: 'ユーザー名を入力',
    passwordPlaceholder: 'パスワードを入力',
    submit: 'ログイン',
    submitting: 'ログイン中...',
    error: 'ログインに失敗しました',
    serverError: 'サーバーに接続できません',
  },
  months: {
    1: '1月',
    2: '2月',
    3: '3月',
    4: '4月',
    5: '5月',
    6: '6月',
    7: '7月',
    8: '8月',
    9: '9月',
    10: '10月',
    11: '11月',
    12: '12月',
  },
};

// English translations
export const en: Translations = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    none: 'None',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    reset: 'Reset',
    clear: 'Clear',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    total: 'Total',
    count: 'items',
    average: 'Average',
    million: 'M',
    billion: 'B',
    percent: '%',
    month: 'Month',
    year: 'Year',
    date: 'Date',
    status: 'Status',
    action: 'Action',
    details: 'Details',
    summary: 'Summary',
    settings: 'Settings',
    help: 'Help',
    logout: 'Logout',
    login: 'Login',
  },
  nav: {
    monthly: 'Monthly',
    monthlyDesc: 'KPI Tracking & Actions',
    pipeline: 'Pipeline',
    pipelineDesc: 'Deal & Plan Management',
    analytics: 'Analytics',
    analyticsDesc: 'Charts & Analysis',
    charts: 'Charts',
    company: 'Company Performance',
    kpiTree: 'KPI Tree',
  },
  dashboard: {
    title: 'InsightBI Executive Dashboard',
    fiscalYear: 'Fiscal Year',
    asOf: 'As of',
    dataManagement: 'Data Management',
    sessionTimeout: 'Session Timeout',
    sessionTimeoutMessage: 'Your session is about to expire. Please continue or log in again.',
  },
  pipeline: {
    title: 'Pipeline Management',
    addDeal: '+ Add Deal',
    stage: 'Stage',
    amount: 'Amount',
    customer: 'Customer',
    owner: 'Owner',
    department: 'Department',
    subTeam: 'Sub-team',
    members: 'Members',
    expectedClose: 'Expected Close',
    grossMargin: 'Gross Margin',
    projectType: 'Type',
    newProject: 'New',
    continuingProject: 'Continuing',
    events: 'Events',
    eventHistory: 'Event History',
    nextAction: 'Next Action',
    addEvent: '+ Add Event',
    comment: 'Comment',
    noEvents: 'No events',
    notSet: 'Not set',
    noMatchingDeals: 'No deals match the criteria',
    viewMode: 'View Mode',
    planComparison: 'Plan Comparison',
    import: 'Import',
    stageSummary: 'Stage Summary',
    clickToFilter: 'Click to filter',
    weighted: 'Weighted',
    yearlyOverview: 'Annual Sales & Pipeline',
    annualTarget: 'Annual Target',
    revenue: 'Revenue',
    budget: 'Budget',
    plTotal: 'PL Total',
    dealCount: 'Deals',
    monthClosed: 'Month Closed',
  },
  stages: {
    A: 'Stage A',
    ADesc: 'Contracted & Confirmed',
    B: 'Stage B',
    BDesc: 'Won, Pending Contract',
    C: 'Stage C',
    CDesc: 'Continuing, High Probability',
    D: 'Stage D',
    DDesc: 'Proposed, Pending Decision',
    O: 'Stage O',
    ODesc: 'Opportunity, Early Stage',
  },
  events: {
    initial_contact: 'Initial Contact',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    contract: 'Contract',
    delivery: 'Delivery',
    other: 'Other',
  },
  plan: {
    title: 'Plan Comparison',
    versionComparison: 'Plan Version Comparison',
    planTotal: 'Plan Total',
    currentStack: 'Current Stack',
    variance: 'Variance',
    achievementRate: 'Achievement Rate',
    active: 'Active',
    firstHalf: 'First Half',
    secondHalf: 'Second Half',
    monthlyComparison: 'Monthly Plan Comparison',
    stageBreakdown: 'Stage Breakdown',
  },
  import: {
    title: 'Excel Import',
    description: 'Import Excel files in Account Follow format',
    dragDrop: 'Drag & drop Excel file, or click to select',
    fileFormat: 'Supports .xlsx, .xls formats',
    selectSheet: 'Select sheet to import',
    preview: 'Preview',
    execute: 'Execute Import',
    complete: 'Import Complete',
    detected: 'deals detected',
    totalAmount: 'Total Amount',
    warnings: 'Warnings',
    errors: 'Errors',
    importedCount: 'deals imported',
  },
  analytics: {
    title: 'Analytics',
    companyPerformance: 'Company Performance',
    branchComparison: 'Branch Comparison',
    backlog: 'Backlog',
    forecast: 'Forecast',
    overview: 'Overview',
    revenue: 'Revenue',
    grossProfit: 'Gross Profit',
    yoy: 'YoY',
    achievement: 'Achievement',
  },
  kpi: {
    title: 'KPI Tree',
    departmentSummary: 'Department Summary',
    decisions: 'Decisions',
    urgent: 'Urgent',
    normal: 'Normal',
    low: 'Low',
  },
  login: {
    title: 'InsightBI',
    subtitle: 'Executive Dashboard',
    username: 'Username',
    password: 'Password',
    usernamePlaceholder: 'Enter username',
    passwordPlaceholder: 'Enter password',
    submit: 'Login',
    submitting: 'Logging in...',
    error: 'Login failed',
    serverError: 'Cannot connect to server',
  },
  months: {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
  },
};

// Get translations by locale
export function getTranslations(locale: Locale): Translations {
  return locale === 'en' ? en : ja;
}

// Default locale
export const defaultLocale: Locale = 'ja';

// LocalStorage key for locale
const LOCALE_STORAGE_KEY = 'insightbi_locale';

// Get saved locale from localStorage
export function getSavedLocale(): Locale {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === 'en' || saved === 'ja') {
      return saved;
    }
  }
  return defaultLocale;
}

// Save locale to localStorage
export function saveLocale(locale: Locale): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }
}

// Locale Context
interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Locale Provider Component
interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = getSavedLocale();
    setLocaleState(saved);
    setIsLoaded(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    saveLocale(newLocale);
  };

  const t = getTranslations(locale);

  // Prevent hydration mismatch by rendering nothing until loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

// Custom hook to use locale
export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

// Language toggle component
export function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === 'ja' ? 'en' : 'ja')}
      className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded transition-colors ${className}`}
      title={locale === 'ja' ? 'Switch to English' : '日本語に切り替え'}
    >
      <span className={locale === 'ja' ? 'opacity-100' : 'opacity-50'}>🇯🇵</span>
      <span className="text-white/50">/</span>
      <span className={locale === 'en' ? 'opacity-100' : 'opacity-50'}>🇺🇸</span>
    </button>
  );
}
