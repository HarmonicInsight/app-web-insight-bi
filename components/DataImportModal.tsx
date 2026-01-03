'use client';

import { useState, useRef, useCallback } from 'react';
import {
  parseMonthlyCSV,
  parsePipelineCSV,
  generateMonthlyTemplate,
  generatePipelineTemplate,
  saveMonthlyImport,
  savePipelineImport,
  MonthlyKPIImport,
  CSVParseResult,
} from '@/lib/csvImport';
import { PipelineItem } from '@/lib/pipelineData';

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: () => void;
}

type ImportType = 'monthly' | 'pipeline';

export default function DataImportModal({ isOpen, onClose, onImportComplete }: DataImportModalProps) {
  const [importType, setImportType] = useState<ImportType>('monthly');
  const [dragActive, setDragActive] = useState(false);
  const [parseResult, setParseResult] = useState<CSVParseResult<MonthlyKPIImport | PipelineItem> | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      } else {
        setParseResult(parsePipelineCSV(text));
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

    setIsImporting(true);

    setTimeout(() => {
      if (importType === 'monthly') {
        saveMonthlyImport(parseResult.data as MonthlyKPIImport[]);
      } else {
        savePipelineImport(parseResult.data as PipelineItem[]);
      }

      setIsImporting(false);
      setImportSuccess(true);

      setTimeout(() => {
        onImportComplete?.();
        // Reset state
        setParseResult(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onClose();
      }, 1500);
    }, 500);
  }, [parseResult, importType, onImportComplete, onClose]);

  const handleReset = useCallback(() => {
    setParseResult(null);
    setImportSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const downloadTemplate = useCallback(() => {
    const content = importType === 'monthly' ? generateMonthlyTemplate() : generatePipelineTemplate();
    const filename = importType === 'monthly' ? 'monthly_template.csv' : 'pipeline_template.csv';

    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [importType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">データインポート</h2>
            <p className="text-xs text-slate-500">CSVファイルからデータを取り込みます</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* インポートタイプ選択 */}
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-700 block mb-2">インポート種別</label>
            <div className="flex gap-2">
              <button
                onClick={() => { setImportType('monthly'); handleReset(); }}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  importType === 'monthly'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="font-medium">月次KPIデータ</div>
                <div className="text-xs mt-1 opacity-70">月ごとの実績・予算</div>
              </button>
              <button
                onClick={() => { setImportType('pipeline'); handleReset(); }}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  importType === 'pipeline'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="font-medium">パイプラインデータ</div>
                <div className="text-xs mt-1 opacity-70">案件一覧</div>
              </button>
            </div>
          </div>

          {/* テンプレートダウンロード */}
          <div className="mb-6 p-3 bg-slate-50 rounded-lg flex items-center justify-between">
            <div className="text-sm text-slate-600">
              <span className="font-medium">テンプレート:</span>
              {importType === 'monthly' ? ' 月,KPI ID,実績,予算' : ' ID,案件名,金額,ステージ...'}
            </div>
            <button
              onClick={downloadTemplate}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              テンプレートをダウンロード
            </button>
          </div>

          {/* ファイルアップロード */}
          {!parseResult && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-300 hover:border-slate-400'
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
              <label
                htmlFor="csv-upload"
                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors"
              >
                ファイルを選択
              </label>
            </div>
          )}

          {/* パース結果 */}
          {parseResult && !importSuccess && (
            <div className="space-y-4">
              {/* サマリー */}
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
                <div className="text-sm text-slate-600">
                  読み込み件数: <span className="font-bold">{parseResult.data.length}</span>件
                </div>
              </div>

              {/* エラー */}
              {parseResult.errors.length > 0 && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-red-700 mb-2">エラー ({parseResult.errors.length}件)</div>
                  <ul className="text-xs text-red-600 space-y-1 max-h-24 overflow-y-auto">
                    {parseResult.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 警告 */}
              {parseResult.warnings.length > 0 && (
                <div className="bg-amber-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-amber-700 mb-2">警告 ({parseResult.warnings.length}件)</div>
                  <ul className="text-xs text-amber-600 space-y-1 max-h-24 overflow-y-auto">
                    {parseResult.warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* プレビュー */}
              {parseResult.data.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-2">プレビュー（最初の5件）</div>
                  <div className="bg-slate-50 rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-100">
                        {importType === 'monthly' ? (
                          <tr>
                            <th className="py-2 px-3 text-left">月</th>
                            <th className="py-2 px-3 text-left">KPI ID</th>
                            <th className="py-2 px-3 text-right">実績</th>
                            <th className="py-2 px-3 text-right">予算</th>
                          </tr>
                        ) : (
                          <tr>
                            <th className="py-2 px-3 text-left">ID</th>
                            <th className="py-2 px-3 text-left">案件名</th>
                            <th className="py-2 px-3 text-right">金額</th>
                            <th className="py-2 px-3 text-center">ステージ</th>
                          </tr>
                        )}
                      </thead>
                      <tbody>
                        {parseResult.data.slice(0, 5).map((item, i) => (
                          <tr key={i} className="border-t border-slate-200">
                            {importType === 'monthly' ? (
                              <>
                                <td className="py-2 px-3">{(item as MonthlyKPIImport).month}月</td>
                                <td className="py-2 px-3">{(item as MonthlyKPIImport).kpiId}</td>
                                <td className="py-2 px-3 text-right">{(item as MonthlyKPIImport).actual}</td>
                                <td className="py-2 px-3 text-right">{(item as MonthlyKPIImport).budget}</td>
                              </>
                            ) : (
                              <>
                                <td className="py-2 px-3">{(item as PipelineItem).id}</td>
                                <td className="py-2 px-3">{(item as PipelineItem).name}</td>
                                <td className="py-2 px-3 text-right">{(item as PipelineItem).amount}億</td>
                                <td className="py-2 px-3 text-center">{(item as PipelineItem).stage}</td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {parseResult.data.length > 5 && (
                      <div className="text-xs text-slate-500 text-center py-2 border-t border-slate-200">
                        他 {parseResult.data.length - 5} 件...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* アクション */}
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  やり直す
                </button>
                <button
                  onClick={handleImport}
                  disabled={!parseResult.success || isImporting}
                  className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImporting ? 'インポート中...' : 'インポート実行'}
                </button>
              </div>
            </div>
          )}

          {/* 成功 */}
          {importSuccess && (
            <div className="text-center py-8">
              <svg className="w-16 h-16 mx-auto text-emerald-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-lg font-bold text-emerald-700">インポート完了</div>
              <div className="text-sm text-slate-500 mt-2">データが正常に取り込まれました</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
