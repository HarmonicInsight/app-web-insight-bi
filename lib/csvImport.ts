// CSVインポート・エクスポートユーティリティ

import { PipelineItem, PipelineStage, Department, pipelineData, departments } from './pipelineData';
import { monthlyDataset, kpiDefinitions } from './monthlyData';

// CSVパース結果
export interface CSVParseResult<T> {
  success: boolean;
  data: T[];
  errors: string[];
  warnings: string[];
}

// CSV文字列をパース
export function parseCSV(csvText: string): string[][] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim());
  return lines.map(line => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  });
}

// 月次KPIデータ型
export interface MonthlyKPIImport {
  month: number; // 1-12
  kpiId: string;
  actual: number;
  budget: number;
}

// 月次データCSVをパース
// 期待フォーマット: 月,KPI ID,実績,予算
export function parseMonthlyCSV(csvText: string): CSVParseResult<MonthlyKPIImport> {
  const rows = parseCSV(csvText);
  const data: MonthlyKPIImport[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  if (rows.length === 0) {
    return { success: false, data: [], errors: ['CSVが空です'], warnings: [] };
  }

  // ヘッダー行をスキップ（最初の行がヘッダーかどうか判定）
  const startRow = isNaN(parseInt(rows[0][0])) ? 1 : 0;

  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 4) {
      errors.push(`行${i + 1}: 列が不足しています（月,KPI ID,実績,予算が必要）`);
      continue;
    }

    const month = parseInt(row[0]);
    const kpiId = row[1];
    const actual = parseFloat(row[2]);
    const budget = parseFloat(row[3]);

    if (isNaN(month) || month < 1 || month > 12) {
      errors.push(`行${i + 1}: 月が不正です（1-12）`);
      continue;
    }

    if (!kpiId) {
      errors.push(`行${i + 1}: KPI IDが空です`);
      continue;
    }

    if (isNaN(actual)) {
      warnings.push(`行${i + 1}: 実績が数値ではありません、0として扱います`);
    }

    if (isNaN(budget)) {
      warnings.push(`行${i + 1}: 予算が数値ではありません、0として扱います`);
    }

    data.push({
      month,
      kpiId,
      actual: isNaN(actual) ? 0 : actual,
      budget: isNaN(budget) ? 0 : budget,
    });
  }

  return {
    success: errors.length === 0,
    data,
    errors,
    warnings,
  };
}

// パイプラインデータCSVをパース
// 期待フォーマット: ID,案件名,金額(億),ステージ(A/B/C/D),受注予定月,顧客名,担当者,部署ID
export function parsePipelineCSV(csvText: string): CSVParseResult<PipelineItem> {
  const rows = parseCSV(csvText);
  const data: PipelineItem[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  if (rows.length === 0) {
    return { success: false, data: [], errors: ['CSVが空です'], warnings: [] };
  }

  // ヘッダー行をスキップ
  const startRow = rows[0][0].toLowerCase().includes('id') || rows[0][0] === 'ID' ? 1 : 0;

  const validStages: PipelineStage[] = ['A', 'B', 'C', 'D'];

  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 8) {
      errors.push(`行${i + 1}: 列が不足しています（ID,案件名,金額,ステージ,受注月,顧客,担当,部署が必要）`);
      continue;
    }

    const id = row[0];
    const name = row[1];
    const amount = parseFloat(row[2]);
    const stage = row[3].toUpperCase() as PipelineStage;
    const expectedCloseMonth = parseInt(row[4]);
    const customer = row[5];
    const owner = row[6];
    const departmentId = row[7];

    if (!id) {
      errors.push(`行${i + 1}: IDが空です`);
      continue;
    }

    if (!name) {
      errors.push(`行${i + 1}: 案件名が空です`);
      continue;
    }

    if (isNaN(amount) || amount < 0) {
      errors.push(`行${i + 1}: 金額が不正です`);
      continue;
    }

    if (!validStages.includes(stage)) {
      errors.push(`行${i + 1}: ステージが不正です（A/B/C/Dのいずれか）`);
      continue;
    }

    if (isNaN(expectedCloseMonth) || expectedCloseMonth < 1 || expectedCloseMonth > 12) {
      errors.push(`行${i + 1}: 受注予定月が不正です（1-12）`);
      continue;
    }

    data.push({
      id,
      name,
      amount,
      stage,
      expectedCloseMonth,
      customer: customer || '',
      owner: owner || '',
      departmentId: departmentId || 'sales1',
    });
  }

  return {
    success: errors.length === 0,
    data,
    errors,
    warnings,
  };
}

// サンプルCSVテンプレート生成
export function generateMonthlyTemplate(): string {
  return `月,KPI ID,実績,予算
4,revenue,15.2,14.0
4,grossProfit,4.5,4.2
4,operatingProfit,1.2,1.0
4,orderReceived,18.0,16.5
5,revenue,16.8,15.0
5,grossProfit,5.0,4.5`;
}

export function generatePipelineTemplate(): string {
  return `ID,案件名,金額(億),ステージ,受注予定月,顧客名,担当者,部署ID
P001,○○ビル新築工事,8.5,A,10,○○不動産,田中,sales1
P002,△△マンション改修,4.2,B,11,△△管理組合,佐藤,sales1
P003,□□工場増設,12.0,C,12,□□製作所,鈴木,sales2`;
}

// LocalStorageキー
const MONTHLY_DATA_KEY = 'insightbi_monthly_import';
const PIPELINE_DATA_KEY = 'insightbi_pipeline_import';
const MONTHLY_PIPELINE_KEY = 'insightbi_monthly_pipeline'; // 月別パイプライン

// 月別パイプラインデータ型
export type MonthlyPipelineData = {
  [month: number]: PipelineItem[];
};

// インポートデータの保存
export function saveMonthlyImport(data: MonthlyKPIImport[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(MONTHLY_DATA_KEY, JSON.stringify(data));
  }
}

export function savePipelineImport(data: PipelineItem[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PIPELINE_DATA_KEY, JSON.stringify(data));
  }
}

// 月別パイプラインの保存（特定の月）
export function saveMonthlyPipeline(month: number, data: PipelineItem[]): void {
  if (typeof window !== 'undefined') {
    const existing = loadAllMonthlyPipeline();
    existing[month] = data;
    localStorage.setItem(MONTHLY_PIPELINE_KEY, JSON.stringify(existing));
  }
}

// 月別パイプラインの読み込み（全月）
export function loadAllMonthlyPipeline(): MonthlyPipelineData {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(MONTHLY_PIPELINE_KEY);
  return stored ? JSON.parse(stored) : {};
}

// 月別パイプラインの読み込み（特定の月）
export function loadMonthlyPipeline(month: number): PipelineItem[] {
  const all = loadAllMonthlyPipeline();
  return all[month] || [];
}

// 月別パイプラインのクリア（特定の月）
export function clearMonthlyPipeline(month: number): void {
  if (typeof window !== 'undefined') {
    const existing = loadAllMonthlyPipeline();
    delete existing[month];
    localStorage.setItem(MONTHLY_PIPELINE_KEY, JSON.stringify(existing));
  }
}

// 月別パイプラインの全クリア
export function clearAllMonthlyPipeline(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(MONTHLY_PIPELINE_KEY);
  }
}

// 月別パイプラインのサマリー取得
export function getMonthlyPipelineSummary(): { month: number; count: number; total: number }[] {
  const data = loadAllMonthlyPipeline();
  const months = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];
  return months.map(month => {
    const items = data[month] || [];
    return {
      month,
      count: items.length,
      total: items.reduce((sum, item) => sum + item.amount, 0),
    };
  });
}

// インポートデータの読み込み
export function loadMonthlyImport(): MonthlyKPIImport[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(MONTHLY_DATA_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function loadPipelineImport(): PipelineItem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(PIPELINE_DATA_KEY);
  return stored ? JSON.parse(stored) : [];
}

// インポートデータのクリア
export function clearMonthlyImport(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(MONTHLY_DATA_KEY);
  }
}

export function clearPipelineImport(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(PIPELINE_DATA_KEY);
  }
}

// =====================================
// 部署マスタ
// =====================================
const DEPARTMENT_DATA_KEY = 'insightbi_department_import';

export interface DepartmentImport {
  id: string;
  name: string;
  target: number;
  confirmedYTD: number;
}

export function parseDepartmentCSV(csvText: string): CSVParseResult<DepartmentImport> {
  const rows = parseCSV(csvText);
  const data: DepartmentImport[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  if (rows.length === 0) {
    return { success: false, data: [], errors: ['CSVが空です'], warnings: [] };
  }

  const startRow = isNaN(parseFloat(rows[0][2])) ? 1 : 0;

  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 4) {
      errors.push(`行${i + 1}: 列が不足しています（部署ID,部署名,通期目標,確定売上が必要）`);
      continue;
    }

    const id = row[0];
    const name = row[1];
    const target = parseFloat(row[2]);
    const confirmedYTD = parseFloat(row[3]);

    if (!id) {
      errors.push(`行${i + 1}: 部署IDが空です`);
      continue;
    }

    if (!name) {
      errors.push(`行${i + 1}: 部署名が空です`);
      continue;
    }

    if (isNaN(target) || target < 0) {
      errors.push(`行${i + 1}: 通期目標が不正です`);
      continue;
    }

    data.push({
      id,
      name,
      target,
      confirmedYTD: isNaN(confirmedYTD) ? 0 : confirmedYTD,
    });
  }

  return { success: errors.length === 0, data, errors, warnings };
}

export function saveDepartmentImport(data: DepartmentImport[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DEPARTMENT_DATA_KEY, JSON.stringify(data));
  }
}

export function loadDepartmentImport(): DepartmentImport[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(DEPARTMENT_DATA_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function clearDepartmentImport(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DEPARTMENT_DATA_KEY);
  }
}

export function generateDepartmentTemplate(): string {
  return `部署ID,部署名,通期目標(億),確定売上(億)
sales1,営業1部,70,18.5
sales2,営業2部,65,15.2
sales3,営業3部,65,12.8`;
}

// =====================================
// エクスポート機能
// =====================================

// CSVダウンロードヘルパー
export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 月次KPIデータをエクスポート
export function exportMonthlyData(): string {
  const header = '月,KPI ID,KPI名,実績,予算,差異,差異率(%)';
  const rows: string[] = [header];

  monthlyDataset.forEach(monthData => {
    if (!monthData.isClosed) return; // 締め済みのみ

    Object.entries(monthData.kpis).forEach(([kpiId, value]) => {
      const kpi = kpiDefinitions.find(k => k.id === kpiId);
      rows.push([
        monthData.month,
        kpiId,
        kpi?.name || kpiId,
        value.actual ?? '',
        value.budget,
        value.variance ?? '',
        value.varianceRate ?? '',
      ].join(','));
    });
  });

  return rows.join('\n');
}

// パイプラインデータをエクスポート
export function exportPipelineData(): string {
  const header = 'ID,案件名,金額(億),ステージ,受注予定月,顧客名,担当者,部署ID';
  const rows: string[] = [header];

  // LocalStorageのデータがあればそれを使用、なければデフォルト
  const data = loadPipelineImport().length > 0 ? loadPipelineImport() : pipelineData;

  data.forEach(item => {
    rows.push([
      item.id,
      `"${item.name.replace(/"/g, '""')}"`,
      item.amount,
      item.stage,
      item.expectedCloseMonth,
      `"${item.customer.replace(/"/g, '""')}"`,
      item.owner,
      item.departmentId,
    ].join(','));
  });

  return rows.join('\n');
}

// 部署マスタをエクスポート
export function exportDepartmentData(): string {
  const header = '部署ID,部署名,通期目標(億),確定売上(億)';
  const rows: string[] = [header];

  // LocalStorageのデータがあればそれを使用、なければデフォルト
  const data = loadDepartmentImport().length > 0 ? loadDepartmentImport() : departments;

  data.forEach(dept => {
    rows.push([
      dept.id,
      dept.name,
      dept.target,
      dept.confirmedYTD,
    ].join(','));
  });

  return rows.join('\n');
}

// 全データエクスポート（ZIP風にまとめる代わりに個別ダウンロード）
export function exportAllData(): void {
  const timestamp = new Date().toISOString().slice(0, 10);

  downloadCSV(exportMonthlyData(), `monthly_data_${timestamp}.csv`);
  setTimeout(() => {
    downloadCSV(exportPipelineData(), `pipeline_data_${timestamp}.csv`);
  }, 500);
  setTimeout(() => {
    downloadCSV(exportDepartmentData(), `department_data_${timestamp}.csv`);
  }, 1000);
}

// データ件数サマリー取得
export function getDataSummary(): {
  monthly: { count: number; source: 'default' | 'imported' };
  pipeline: { count: number; source: 'default' | 'imported' };
  department: { count: number; source: 'default' | 'imported' };
} {
  const monthlyImported = loadMonthlyImport();
  const pipelineImported = loadPipelineImport();
  const departmentImported = loadDepartmentImport();

  return {
    monthly: {
      count: monthlyImported.length > 0 ? monthlyImported.length : monthlyDataset.filter(d => d.isClosed).length * kpiDefinitions.length,
      source: monthlyImported.length > 0 ? 'imported' : 'default',
    },
    pipeline: {
      count: pipelineImported.length > 0 ? pipelineImported.length : pipelineData.length,
      source: pipelineImported.length > 0 ? 'imported' : 'default',
    },
    department: {
      count: departmentImported.length > 0 ? departmentImported.length : departments.length,
      source: departmentImported.length > 0 ? 'imported' : 'default',
    },
  };
}

// 全インポートデータをクリア
export function clearAllImportedData(): void {
  clearMonthlyImport();
  clearPipelineImport();
  clearDepartmentImport();
  clearAllMonthlyPipeline();
}

// 月別パイプラインをエクスポート（特定の月）
export function exportMonthlyPipelineData(month: number): string {
  const header = 'ID,案件名,金額(億),ステージ,顧客名,担当者,部署ID';
  const rows: string[] = [header];

  const data = loadMonthlyPipeline(month);

  data.forEach(item => {
    rows.push([
      item.id,
      `"${item.name.replace(/"/g, '""')}"`,
      item.amount,
      item.stage,
      `"${item.customer.replace(/"/g, '""')}"`,
      item.owner,
      item.departmentId,
    ].join(','));
  });

  return rows.join('\n');
}

// 月別パイプライン用のCSVパース（月カラムなし）
export function parseMonthlyPipelineCSV(csvText: string): CSVParseResult<Omit<PipelineItem, 'expectedCloseMonth'>> {
  const rows = parseCSV(csvText);
  const data: Omit<PipelineItem, 'expectedCloseMonth'>[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  if (rows.length === 0) {
    return { success: false, data: [], errors: ['CSVが空です'], warnings: [] };
  }

  // ヘッダー行をスキップ
  const startRow = rows[0][0].toLowerCase().includes('id') || rows[0][0] === 'ID' ? 1 : 0;

  const validStages: PipelineStage[] = ['A', 'B', 'C', 'D'];

  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 7) {
      errors.push(`行${i + 1}: 列が不足しています（ID,案件名,金額,ステージ,顧客,担当,部署が必要）`);
      continue;
    }

    const id = row[0];
    const name = row[1];
    const amount = parseFloat(row[2]);
    const stage = row[3].toUpperCase() as PipelineStage;
    const customer = row[4];
    const owner = row[5];
    const departmentId = row[6];

    if (!id) {
      errors.push(`行${i + 1}: IDが空です`);
      continue;
    }

    if (!name) {
      errors.push(`行${i + 1}: 案件名が空です`);
      continue;
    }

    if (isNaN(amount) || amount < 0) {
      errors.push(`行${i + 1}: 金額が不正です`);
      continue;
    }

    if (!validStages.includes(stage)) {
      errors.push(`行${i + 1}: ステージが不正です（A/B/C/Dのいずれか）`);
      continue;
    }

    data.push({
      id,
      name,
      amount,
      stage,
      customer: customer || '',
      owner: owner || '',
      departmentId: departmentId || 'sales1',
    });
  }

  return {
    success: errors.length === 0,
    data,
    errors,
    warnings,
  };
}

// 月別パイプラインテンプレート生成
export function generateMonthlyPipelineTemplate(): string {
  return `ID,案件名,金額(億),ステージ,顧客名,担当者,部署ID
P001,○○ビル新築工事,8.5,A,○○不動産,田中,sales1
P002,△△マンション改修,4.2,B,△△管理組合,佐藤,sales1
P003,□□工場増設,12.0,C,□□製作所,鈴木,sales2`;
}
