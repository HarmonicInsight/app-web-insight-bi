'use client';

import { useState } from 'react';
import {
  DecisionBox,
  DecisionStatus,
  DecisionUrgency,
  DecisionCategory,
} from '@/lib/types';
import { DEMO_DECISIONS, getRelatedDecisions } from '@/lib/decisionData';

// ステータスの表示設定
const statusConfig: Record<DecisionStatus, { label: string; color: string; bg: string }> = {
  pending: { label: '判断待ち', color: 'text-slate-600', bg: 'bg-slate-100' },
  in_review: { label: '検討中', color: 'text-blue-600', bg: 'bg-blue-100' },
  decided: { label: '決定済み', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  deferred: { label: '保留', color: 'text-amber-600', bg: 'bg-amber-100' },
  escalated: { label: 'エスカレーション', color: 'text-red-600', bg: 'bg-red-100' },
};

// 緊急度の表示設定
const urgencyConfig: Record<DecisionUrgency, { label: string; color: string; icon: string }> = {
  immediate: { label: '緊急', color: 'text-red-600', icon: '🔴' },
  this_week: { label: '今週中', color: 'text-orange-600', icon: '🟠' },
  this_month: { label: '今月中', color: 'text-amber-600', icon: '🟡' },
  this_quarter: { label: '四半期内', color: 'text-blue-600', icon: '🔵' },
};

// カテゴリの表示設定
const categoryConfig: Record<DecisionCategory, { label: string; icon: string }> = {
  financial: { label: '財務・予算', icon: '💰' },
  operational: { label: '業務', icon: '⚙️' },
  strategic: { label: '戦略', icon: '🎯' },
  hr: { label: '人事', icon: '👥' },
  project: { label: 'プロジェクト', icon: '📊' },
  risk: { label: 'リスク', icon: '⚠️' },
};

// 意思決定ボックスカード
function DecisionCard({
  decision,
  onClick,
  isHighlighted,
}: {
  decision: DecisionBox;
  onClick: () => void;
  isHighlighted?: boolean;
}) {
  const status = statusConfig[decision.status];
  const urgency = urgencyConfig[decision.urgency];
  const category = categoryConfig[decision.category];
  const keyInputs = decision.inputs.filter(i => i.isKey);
  const recommendedOption = decision.options.find(o => o.isRecommended);

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border-2 p-5 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
        isHighlighted
          ? 'border-indigo-500 ring-2 ring-indigo-200'
          : decision.status === 'escalated'
          ? 'border-red-300'
          : 'border-slate-200 hover:border-indigo-300'
      }`}
    >
      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{category.icon}</span>
          <span className="text-xs text-slate-500">{category.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">{urgency.icon}</span>
          <span className={`text-xs font-medium ${urgency.color}`}>{urgency.label}</span>
        </div>
      </div>

      {/* タイトル */}
      <h3 className="font-bold text-slate-800 mb-2 line-clamp-2">{decision.title}</h3>

      {/* 目的 */}
      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{decision.purpose}</p>

      {/* キー指標 */}
      {keyInputs.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {keyInputs.slice(0, 2).map(input => (
            <div key={input.id} className="bg-slate-50 rounded-lg px-2 py-1">
              <span className="text-xs text-slate-500">{input.label}</span>
              <span className="text-sm font-bold text-slate-800 ml-1">
                {input.value}{input.unit}
              </span>
              {input.trend && (
                <span className={`ml-1 text-xs ${
                  input.trend === 'up' ? 'text-emerald-600' :
                  input.trend === 'down' ? 'text-red-600' : 'text-slate-500'
                }`}>
                  {input.trend === 'up' ? '↑' : input.trend === 'down' ? '↓' : '→'}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 推奨オプション */}
      {recommendedOption && (
        <div className="bg-indigo-50 rounded-lg px-3 py-2 mb-3">
          <span className="text-xs text-indigo-600 font-medium">推奨案:</span>
          <span className="text-sm text-indigo-800 ml-1">{recommendedOption.label}</span>
        </div>
      )}

      {/* フッター */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.bg} ${status.color}`}>
          {status.label}
        </span>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>担当: {decision.owner}</span>
          {decision.deadline && (
            <span className="text-red-500">期限: {decision.deadline.slice(5)}</span>
          )}
        </div>
      </div>

      {/* 関連意思決定の数 */}
      {decision.relatedDecisions.length > 0 && (
        <div className="mt-2 text-xs text-slate-400">
          🔗 関連する意思決定: {decision.relatedDecisions.length}件
        </div>
      )}
    </div>
  );
}

// 意思決定詳細モーダル
function DecisionDetailModal({
  decision,
  allDecisions,
  onClose,
  onNavigate,
}: {
  decision: DecisionBox;
  allDecisions: DecisionBox[];
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'inputs' | 'options' | 'related'>('overview');
  const status = statusConfig[decision.status];
  const urgency = urgencyConfig[decision.urgency];
  const category = categoryConfig[decision.category];
  const relatedDecisions = getRelatedDecisions(allDecisions, decision.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-sm opacity-80">{category.label}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <h2 className="text-2xl font-bold">{decision.title}</h2>
                <p className="mt-2 opacity-90">{decision.purpose}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* メタ情報 */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="opacity-70">緊急度:</span>
                <span>{urgency.icon} {urgency.label}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="opacity-70">担当:</span>
                <span>{decision.owner}</span>
              </div>
              {decision.deadline && (
                <div className="flex items-center gap-1">
                  <span className="opacity-70">期限:</span>
                  <span className="font-medium">{decision.deadline}</span>
                </div>
              )}
              {decision.meetingDate && (
                <div className="flex items-center gap-1">
                  <span className="opacity-70">会議予定:</span>
                  <span>{decision.meetingDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* タブ */}
          <div className="flex border-b border-slate-200">
            {[
              { id: 'overview', label: '概要' },
              { id: 'inputs', label: '判断材料' },
              { id: 'options', label: '選択肢' },
              { id: 'related', label: '関連意思決定' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {tab.label}
                {tab.id === 'related' && decision.relatedDecisions.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-indigo-100 text-indigo-600 rounded-full">
                    {decision.relatedDecisions.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* コンテンツ */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* 概要タブ */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 制約条件 */}
                <div>
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">⛔</span> 制約条件
                  </h3>
                  <div className="space-y-2">
                    {decision.constraints.map(constraint => (
                      <div
                        key={constraint.id}
                        className={`p-3 rounded-lg border ${
                          constraint.type === 'hard'
                            ? 'bg-red-50 border-red-200'
                            : 'bg-amber-50 border-amber-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-sm text-slate-700">{constraint.description}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            constraint.type === 'hard'
                              ? 'bg-red-200 text-red-700'
                              : 'bg-amber-200 text-amber-700'
                          }`}>
                            {constraint.type === 'hard' ? '必須' : '考慮'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 関係者 */}
                <div>
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">👥</span> 関係者
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {decision.stakeholders.map((person, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-700">
                        {person}
                      </span>
                    ))}
                  </div>
                </div>

                {/* タグ */}
                <div>
                  <h3 className="font-bold text-slate-800 mb-3">タグ</h3>
                  <div className="flex flex-wrap gap-2">
                    {decision.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 判断材料タブ */}
            {activeTab === 'inputs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {decision.inputs.map(input => (
                  <div
                    key={input.id}
                    className={`p-4 rounded-lg border ${
                      input.isKey ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600">{input.label}</span>
                      {input.isKey && (
                        <span className="text-xs px-2 py-0.5 bg-indigo-200 text-indigo-700 rounded-full">
                          重要指標
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-800">{input.value}</span>
                      {input.unit && <span className="text-sm text-slate-600">{input.unit}</span>}
                      {input.trend && (
                        <span className={`text-sm ${
                          input.trend === 'up' ? 'text-emerald-600' :
                          input.trend === 'down' ? 'text-red-600' : 'text-slate-500'
                        }`}>
                          {input.trend === 'up' ? '↑上昇' : input.trend === 'down' ? '↓下降' : '→横ばい'}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      <span>出典: {input.source}</span>
                      <span className="ml-2">更新: {input.updatedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 選択肢タブ */}
            {activeTab === 'options' && (
              <div className="space-y-4">
                {decision.options.map(option => (
                  <div
                    key={option.id}
                    className={`p-4 rounded-lg border-2 ${
                      option.isRecommended
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                          {option.label}
                          {option.isRecommended && (
                            <span className="text-xs px-2 py-0.5 bg-emerald-500 text-white rounded-full">
                              推奨
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">{option.description}</p>
                      </div>
                      {option.recommendationScore !== undefined && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-600">
                            {option.recommendationScore}
                          </div>
                          <div className="text-xs text-slate-500">スコア</div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <span className="text-xs font-medium text-emerald-600">✓ メリット</span>
                        <ul className="mt-1 space-y-1">
                          {option.pros.map((pro, i) => (
                            <li key={i} className="text-sm text-slate-600">• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-red-600">✗ デメリット</span>
                        <ul className="mt-1 space-y-1">
                          {option.cons.map((con, i) => (
                            <li key={i} className="text-sm text-slate-600">• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {option.estimatedImpact && (
                      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-slate-200">
                        {option.estimatedImpact.cost !== undefined && (
                          <span className="text-xs px-2 py-1 bg-slate-100 rounded">
                            コスト: ¥{(option.estimatedImpact.cost / 10000).toLocaleString()}万
                          </span>
                        )}
                        {option.estimatedImpact.risk && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            option.estimatedImpact.risk === 'high' ? 'bg-red-100 text-red-700' :
                            option.estimatedImpact.risk === 'medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            リスク: {option.estimatedImpact.risk === 'high' ? '高' : option.estimatedImpact.risk === 'medium' ? '中' : '低'}
                          </span>
                        )}
                        {option.estimatedImpact.timeframe && (
                          <span className="text-xs px-2 py-1 bg-slate-100 rounded">
                            期間: {option.estimatedImpact.timeframe}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 関連意思決定タブ */}
            {activeTab === 'related' && (
              <div className="space-y-4">
                {decision.relatedDecisions.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">関連する意思決定はありません</p>
                ) : (
                  decision.relatedDecisions.map(related => {
                    const relatedDecision = allDecisions.find(d => d.id === related.id);
                    const relationshipLabels: Record<string, string> = {
                      blocks: 'この意思決定をブロック',
                      blocked_by: 'この意思決定に依存',
                      related: '関連',
                      triggers: 'この意思決定が完了すると開始',
                    };

                    return (
                      <div
                        key={related.id}
                        onClick={() => relatedDecision && onNavigate(related.id)}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              related.relationship === 'blocks' || related.relationship === 'blocked_by'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              {relationshipLabels[related.relationship]}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig[related.status].bg} ${statusConfig[related.status].color}`}>
                              {statusConfig[related.status].label}
                            </span>
                          </div>
                          <h4 className="font-medium text-slate-800">{related.title}</h4>
                        </div>
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// メインダッシュボード
export default function DecisionDashboard() {
  const [selectedDecision, setSelectedDecision] = useState<DecisionBox | null>(null);
  const [filterUrgency, setFilterUrgency] = useState<DecisionUrgency | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<DecisionStatus | 'all'>('all');

  const filteredDecisions = DEMO_DECISIONS.filter(d => {
    if (filterUrgency !== 'all' && d.urgency !== filterUrgency) return false;
    if (filterStatus !== 'all' && d.status !== filterStatus) return false;
    return true;
  });

  // 緊急度でグループ化
  const urgencyGroups: Record<DecisionUrgency, DecisionBox[]> = {
    immediate: filteredDecisions.filter(d => d.urgency === 'immediate'),
    this_week: filteredDecisions.filter(d => d.urgency === 'this_week'),
    this_month: filteredDecisions.filter(d => d.urgency === 'this_month'),
    this_quarter: filteredDecisions.filter(d => d.urgency === 'this_quarter'),
  };

  const handleNavigate = (id: string) => {
    const decision = DEMO_DECISIONS.find(d => d.id === id);
    if (decision) setSelectedDecision(decision);
  };

  return (
    <div className="h-full overflow-auto bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ヘッダー */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">意思決定ボックス</h1>
          <p className="text-slate-600">判断が必要な案件を一覧で確認し、必要な情報にアクセスできます</p>
        </div>

        {/* サマリー */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="text-2xl font-bold text-slate-800">{DEMO_DECISIONS.length}</div>
            <div className="text-sm text-slate-500">全意思決定</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="text-2xl font-bold text-red-600">
              {DEMO_DECISIONS.filter(d => d.urgency === 'immediate').length}
            </div>
            <div className="text-sm text-red-600">緊急</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="text-2xl font-bold text-amber-600">
              {DEMO_DECISIONS.filter(d => d.status === 'in_review').length}
            </div>
            <div className="text-sm text-amber-600">検討中</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">
              {DEMO_DECISIONS.filter(d => d.status === 'escalated').length}
            </div>
            <div className="text-sm text-blue-600">エスカレーション</div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <div className="text-2xl font-bold text-emerald-600">
              {DEMO_DECISIONS.filter(d => d.status === 'decided').length}
            </div>
            <div className="text-sm text-emerald-600">決定済み</div>
          </div>
        </div>

        {/* フィルター */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-xl border border-slate-200">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">緊急度</label>
            <select
              value={filterUrgency}
              onChange={e => setFilterUrgency(e.target.value as DecisionUrgency | 'all')}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">すべて</option>
              <option value="immediate">🔴 緊急</option>
              <option value="this_week">🟠 今週中</option>
              <option value="this_month">🟡 今月中</option>
              <option value="this_quarter">🔵 四半期内</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">ステータス</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as DecisionStatus | 'all')}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">すべて</option>
              <option value="pending">判断待ち</option>
              <option value="in_review">検討中</option>
              <option value="escalated">エスカレーション</option>
              <option value="decided">決定済み</option>
              <option value="deferred">保留</option>
            </select>
          </div>
        </div>

        {/* 意思決定ボックス一覧（緊急度別） */}
        {Object.entries(urgencyGroups).map(([urgency, decisions]) => {
          if (decisions.length === 0) return null;
          const config = urgencyConfig[urgency as DecisionUrgency];

          return (
            <div key={urgency} className="mb-8">
              <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${config.color}`}>
                <span className="text-xl">{config.icon}</span>
                {config.label}
                <span className="text-sm font-normal text-slate-500">({decisions.length}件)</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {decisions.map(decision => (
                  <DecisionCard
                    key={decision.id}
                    decision={decision}
                    onClick={() => setSelectedDecision(decision)}
                    isHighlighted={selectedDecision?.id === decision.id}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {filteredDecisions.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            該当する意思決定がありません
          </div>
        )}
      </div>

      {/* 詳細モーダル */}
      {selectedDecision && (
        <DecisionDetailModal
          decision={selectedDecision}
          allDecisions={DEMO_DECISIONS}
          onClose={() => setSelectedDecision(null)}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
