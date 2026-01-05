'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  parseMonthlyCSV,
  parsePipelineCSV,
  parseDepartmentCSV,
  parseMonthlyPipelineCSV,
  generateMonthlyTemplate,
  generatePipelineTemplate,
  generateDepartmentTemplate,
  generateMonthlyPipelineTemplate,
  saveMonthlyImport,
  savePipelineImport,
  saveDepartmentImport,
  saveMonthlyPipeline,
  exportMonthlyData,
  exportPipelineData,
  exportDepartmentData,
  exportMonthlyPipelineData,
  downloadCSV,
  getDataSummary,
  getMonthlyPipelineSummary,
  clearAllImportedData,
  MonthlyKPIImport,
  DepartmentImport,
  CSVParseResult,
} from '@/lib/csvImport';
import { PipelineItem } from '@/lib/pipelineData';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChange?: () => void;
}

type TabType = 'export' | 'import';
type DataType = 'monthly' | 'pipeline' | 'department' | 'monthlyPipeline';

// 月リスト（4月〜3月）
const months = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];

export default function DataManagementModal({ isOpen, onClose, onDataChange }: DataManagementModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('export');
  const [importType, setImportType] = useState<DataType>('monthlyPipeline');
  const [selectedMonth, setSelectedMonth] = useState<number>(4);
  const [dragActive, setDragActive] = useState(false);
  const [parseResult, setParseResult] = useState<CSVParseResult<MonthlyKPIImport | PipelineItem | DepartmentImport | Omit<PipelineItem, 'expectedCloseMonth'>> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dataSummary, setDataSummary] = useState<ReturnType<typeof getDataSummary> | null>(null);
  const [monthlyPipelineSummary, setMonthlyPipelineSummary] = useState<ReturnType<typeof getMonthlyPipelineSummary>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // データサマリー更新
  useEffect(() => {
    if (isOpen) {
      setDataSummary(getDataSummary());
      setMonthlyPipelineSummary(getMonthlyPipelineSummary());
    }
  }, [isOpen]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const processFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (importType === 'monthly') {
        setParseResult(parseMonthlyCSV(text));
      } else if (importType === 'pipeline') {
        setParseResult(parsePipelineCSV(text));
      } else if (importType === 'monthlyPipeline') {
        setParseResult(parseMonthlyPipelineCSV(text));
      } else {
        setParseResult(parseDepartmentCSV(text));
      }
    };
    reader.readAsText(file, 'UTF-8');
  }, [importType]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  const handleImport = useCallback(() => {
    if (!parseResult || !parseResult.success) return;

    setIsProcessing(true);
    setTimeout(() => {
      if (importType === 'monthly') {
        saveMonthlyImport(parseResult.data as MonthlyKPIImport[]);
      } else if (importType === 'pipeline') {
        savePipelineImport(parseResult.data as PipelineItem[]);
      } else if (importType === 'monthlyPipeline') {
        // 月別パイプラインの保存（expectedCloseMonthを追加）
        const pipelineItems: PipelineItem[] = (parseResult.data as Omit<PipelineItem, 'expectedCloseMonth'>[]).map(item => ({
          ...item,
          expectedCloseMonth: selectedMonth,
        }));
        saveMonthlyPipeline(selectedMonth, pipelineItems);
      } else {
        saveDepartmentImport(parseResult.data as DepartmentImport[]);
      }

      setIsProcessing(false);
      setSuccess(true);
      setDataSummary(getDataSummary());
      setMonthlyPipelineSummary(getMonthlyPipelineSummary());

      setTimeout(() => {
        onDataChange?.();
        // Reset state inline
        setParseResult(null);
        setSuccess(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1500);
    }, 500);
  }, [parseResult, importType, selectedMonth, onDataChange]);

  const handleReset = useCallback(() => {
    setParseResult(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleExport = useCallback((type: DataType) => {
    setIsProcessing(true);
    const timestamp = new Date().toISOString().slice(0, 10);

    setTimeout(() => {
      if (type === 'monthly') {
        downloadCSV(exportMonthlyData(), `monthly_data_${timestamp}.csv`);
      } else if (type === 'pipeline') {
        downloadCSV(exportPipelineData(), `pipeline_data_${timestamp}.csv`);
      } else {
        downloadCSV(exportDepartmentData(), `department_data_${timestamp}.csv`);
      }
      setIsProcessing(false);
    }, 300);
  }, []);

  const handleExportAll = useCallback(() => {
    setIsProcessing(true);
    const timestamp = new Date().toISOString().slice(0, 10);

    downloadCSV(exportMonthlyData(), `monthly_data_${timestamp}.csv`);
    setTimeout(() => {
      downloadCSV(exportPipelineData(), `pipeline_data_${timestamp}.csv`);
    }, 500);
    setTimeout(() => {
      downloadCSV(exportDepartmentData(), `department_data_${timestamp}.csv`);
      setIsProcessing(false);
    }, 1000);
  }, []);

  const handleClearAll = useCallback(() => {
    if (confirm('インポートしたデータをすべてクリアして、デフォルトデータに戻しますか？')) {
      clearAllImportedData();
      setDataSummary(getDataSummary());
      onDataChange?.();
    }
  }, [onDataChange]);

  const downloadTemplate = useCallback((type: DataType, month?: number) => {
    let content = '';
    let filename = '';

    if (type === 'monthly') {
      content = generateMonthlyTemplate();
      filename = 'monthly_template.csv';
    } else if (type === 'pipeline') {
      content = generatePipelineTemplate();
      filename = 'pipeline_template.csv';
    } else if (type === 'monthlyPipeline') {
      content = generateMonthlyPipelineTemplate();
      filename = `pipeline_${month || 4}月_template.csv`;
    } else {
      content = generateDepartmentTemplate();
      filename = 'department_template.csv';
    }

    downloadCSV(content, filename);
  }, []);

  if (!isOpen) return null;

  const dataTypeLabels: Record<DataType, { name: string; desc: string }> = {
    monthlyPipeline: { name: '月別パイプライン', desc: '月ごとの案件一覧' },
    monthly: { name: '月次KPIデータ', desc: '月ごとの実績・予算' },
    pipeline: { name: 'パイプライン（通期）', desc: '全期間の案件一覧' },
    department: { name: '部署マスタ', desc: '部署・目標設定' },
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">データ管理</h2>
            <p className="text-xs text-slate-500">エクスポート・インポートでデータを編集</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* タブ */}
        <div className="px-6 pt-4 flex gap-2">
          <button
            onClick={() => { setActiveTab('export'); handleReset(); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'export'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            エクスポート
          </button>
          <button
            onClick={() => { setActiveTab('import'); handleReset(); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'import'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            インポート
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* エクスポート */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              {/* 月別パイプラインサマリー */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="text-sm font-bold text-slate-800 mb-3">月別パイプラインデータ</h3>
                <div className="grid grid-cols-6 gap-2">
                  {monthlyPipelineSummary.map(m => (
                    <div
                      key={m.month}
                      className={`bg-white rounded-lg p-2 border text-center cursor-pointer hover:border-indigo-300 transition-colors ${
                        m.count > 0 ? 'border-indigo-200' : 'border-slate-200'
                      }`}
                      onClick={() => m.count > 0 && downloadCSV(exportMonthlyPipelineData(m.month), `pipeline_${m.month}月.csv`)}
                    >
                      <div className="text-xs text-slate-500">{m.month}月</div>
                      <div className={`text-sm font-bold ${m.count > 0 ? 'text-indigo-600' : 'text-slate-300'}`}>
                        {m.count}件
                      </div>
                      {m.count > 0 && (
                        <div className="text-[10px] text-slate-400">{m.total.toFixed(1)}億</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-slate-400 mt-2 text-center">クリックでダウンロード</div>
              </div>

              {/* その他データサマリー */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="text-sm font-bold text-slate-800 mb-3">その他のデータ</h3>
                <div className="grid grid-cols-3 gap-3">
                  {(['monthly', 'pipeline', 'department'] as const).map(type => (
                    <div key={type} className="bg-white rounded-lg p-3 border border-slate-200">
                      <div className="text-xs text-slate-500">{dataTypeLabels[type].name}</div>
                      <div className="flex items-end justify-between mt-1">
                        <span className="text-xl font-bold text-slate-800">
                          {dataSummary?.[type].count || 0}
                          <span className="text-xs text-slate-400 ml-1">件</span>
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          dataSummary?.[type].source === 'imported'
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {dataSummary?.[type].source === 'imported' ? 'インポート済' : 'デフォルト'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleExport(type)}
                        disabled={isProcessing}
                        className="mt-2 w-full px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded hover:bg-slate-200 transition-colors disabled:opacity-50"
                      >
                        エクスポート
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* データリセット */}
              {dataSummary && (dataSummary.monthly.source === 'imported' || dataSummary.pipeline.source === 'imported' || dataSummary.department.source === 'imported') && (
                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={handleClearAll}
                    className="w-full py-2 text-red-600 text-sm font-medium hover:bg-red-50 rounded-lg transition-colors"
                  >
                    インポートデータをクリア（デフォルトに戻す）
                  </button>
                </div>
              )}
            </div>
          )}

          {/* インポート */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              {/* データ種別選択 */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">インポート種別</label>
                {/* 月別パイプライン（メイン） */}
                <div
                  onClick={() => { setImportType('monthlyPipeline'); handleReset(); }}
                  className={`mb-3 py-3 px-4 rounded-lg border-2 transition-all cursor-pointer ${
                    importType === 'monthlyPipeline'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-medium text-sm ${importType === 'monthlyPipeline' ? 'text-indigo-700' : 'text-slate-600'}`}>
                        月別パイプライン
                      </div>
                      <div className="text-[10px] mt-0.5 opacity-70">月ごとの案件一覧をインポート</div>
                    </div>
                    {importType === 'monthlyPipeline' && (
                      <select
                        value={selectedMonth}
                        onChange={(e) => { e.stopPropagation(); setSelectedMonth(parseInt(e.target.value)); }}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 text-sm border border-indigo-300 rounded-lg bg-white text-indigo-700 font-medium"
                      >
                        {months.map(m => (
                          <option key={m} value={m}>{m}月</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* その他のデータ種別 */}
                <div className="grid grid-cols-3 gap-2">
                  {(['monthly', 'pipeline', 'department'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => { setImportType(type); handleReset(); }}
                      className={`py-2 px-3 rounded-lg border-2 transition-all text-left ${
                        importType === type
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <div className="font-medium text-xs">{dataTypeLabels[type].name}</div>
                      <div className="text-[10px] mt-0.5 opacity-70">{dataTypeLabels[type].desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* テンプレートダウンロード */}
              <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  <span className="font-medium">フォーマット確認:</span>
                  {importType === 'monthlyPipeline' && <span className="ml-1 text-indigo-600">{selectedMonth}月用</span>}
                </div>
                <button
                  onClick={() => downloadTemplate(importType, selectedMonth)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  テンプレート
                </button>
              </div>

              {/* ファイルアップロード */}
              {!parseResult && !success && (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <svg className="w-12 h-12 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-slate-600 mb-2">CSVファイルをドラッグ＆ドロップ</p>
                  <p className="text-slate-400 text-sm mb-4">または</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors">
                    ファイルを選択
                  </label>
                </div>
              )}

              {/* パース結果 */}
              {parseResult && !success && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${parseResult.success ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {parseResult.success ? (
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )}
                      <span className={`font-medium ${parseResult.success ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {parseResult.success ? 'パース成功' : 'エラーがあります'}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600">読み込み件数: <span className="font-bold">{parseResult.data.length}</span>件</div>
                  </div>

                  {parseResult.errors.length > 0 && (
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-red-700 mb-2">エラー ({parseResult.errors.length}件)</div>
                      <ul className="text-xs text-red-600 space-y-1 max-h-24 overflow-y-auto">
                        {parseResult.errors.slice(0, 10).map((error, i) => <li key={i}>{error}</li>)}
                        {parseResult.errors.length > 10 && <li>他 {parseResult.errors.length - 10} 件...</li>}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={handleReset} className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                      やり直す
                    </button>
                    <button
                      onClick={handleImport}
                      disabled={!parseResult.success || isProcessing}
                      className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? 'インポート中...' : 'インポート実行'}
                    </button>
                  </div>
                </div>
              )}

              {/* 成功 */}
              {success && (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto text-emerald-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-lg font-bold text-emerald-700">インポート完了</div>
                  <div className="text-sm text-slate-500 mt-2">データが正常に取り込まれました</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
