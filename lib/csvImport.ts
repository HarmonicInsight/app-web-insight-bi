// CSVインポートユーティリティ

import { PipelineItem, PipelineStage } from './pipelineData';

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
