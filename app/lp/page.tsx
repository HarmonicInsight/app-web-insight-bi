'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-800">InsightBI <span className="text-indigo-600">Suite</span></span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#features" className="text-slate-600 hover:text-slate-900">特徴</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900">料金</a>
              <a href="#cases" className="text-slate-600 hover:text-slate-900">導入事例</a>
              <a href="#faq" className="text-slate-600 hover:text-slate-900">よくある質問</a>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">ログイン</Link>
              <a href="#cta" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                無料で試す
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ① ヒーローセクション */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              CSVを入れるだけ。<br />
              <span className="text-indigo-600">経営が見える。</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              高額なBIツールはもう要らない。<br />
              会計ソフトのデータを入れるだけで、<br className="sm:hidden" />
              プロ品質の経営ダッシュボードが手に入ります。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <a href="#cta" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-colors shadow-lg shadow-indigo-600/30">
                無料で試す
              </a>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 text-slate-700 hover:text-slate-900 px-6 py-4">
                <span className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span className="font-medium">デモを見る</span>
              </button>
            </div>
          </div>

          {/* ダッシュボードプレビュー */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-800 px-4 py-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="p-4 bg-slate-50">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: '売上高', value: '92.5億', rate: '93%', color: 'bg-amber-50' },
                    { label: '粗利益', value: '13.5億', rate: '90%', color: 'bg-amber-50' },
                    { label: '粗利率', value: '14.6%', rate: '目標15%', color: 'bg-slate-50' },
                    { label: '受注残', value: '115億', rate: '順調', color: 'bg-emerald-50' },
                  ].map((kpi, i) => (
                    <div key={i} className={`${kpi.color} rounded-lg p-3`}>
                      <div className="text-[10px] text-slate-500">{kpi.label}</div>
                      <div className="text-lg font-bold text-slate-800">{kpi.value}</div>
                      <div className="text-[10px] text-slate-500">{kpi.rate}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-lg p-3 h-32 flex items-end gap-1">
                  {[40, 65, 55, 75, 60, 80, 45, 70, 85, 50, 30, 20].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-400 rounded-t" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg border border-slate-100">
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  導入企業 50社+
                </span>
                <span className="text-slate-300">|</span>
                <span>建設業専門</span>
                <span className="text-slate-300">|</span>
                <span>初期費用0円</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ② 痛みの共感セクション */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-12">
            こんなお悩み、ありませんか？
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '😓', title: '毎月の報告書作成に3日かかる', desc: '会計データをExcelに手作業で転記...' },
              { icon: '📊', title: 'Power BIは難しすぎて挫折した', desc: 'SQLって何？ETLツールって必要なの？' },
              { icon: '💰', title: 'BIツールに年100万は出せない', desc: '中小企業には負担が大きすぎる' },
              { icon: '📈', title: 'データはあるのに活用できていない', desc: '会計ソフトに眠ったまま...' },
              { icon: '🏗️', title: '建設業の勘定科目に対応したツールがない', desc: '工事別原価、出来高、完成工事高...' },
              { icon: '❓', title: '「今月の粗利いくら？」に即答できない', desc: '社長に聞かれてもすぐ出せない' },
            ].map((pain, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">{pain.icon}</div>
                <h3 className="font-bold text-slate-800 mb-2">{pain.title}</h3>
                <p className="text-sm text-slate-500">{pain.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <div className="inline-flex items-center gap-2 text-indigo-600 font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              すべて、InsightBI Suite が解決します
            </div>
          </div>
        </div>
      </section>

      {/* ③ 解決策セクション */}
      <section className="py-20 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-4">
            3ステップで、経営ダッシュボードが手に入る
          </h2>
          <p className="text-center text-slate-600 mb-12">専門知識は一切不要です</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { step: '1', icon: '📁', title: 'CSVをアップロード', desc: '会計ソフトからCSVをエクスポートして、ドラッグ＆ドロップ' },
              { step: '2', icon: '🔄', title: '自動で変換', desc: 'AIが自動でデータを整形。列の対応付けも自動提案' },
              { step: '3', icon: '📊', title: 'ダッシュボード完成！', desc: 'すぐに経営状況が見える。更新も毎月CSVを入れるだけ' },
            ].map((s, i) => (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 text-indigo-300 text-2xl">→</div>
                )}
                <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-indigo-100">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl mx-auto mb-4">
                    {s.step}
                  </div>
                  <div className="text-4xl mb-4">{s.icon}</div>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 border border-indigo-200 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">ポイント：ETLツールは不要です</h4>
                <p className="text-sm text-slate-600">
                  通常、BIツールを使うには「ETL」と呼ばれるデータ変換ツール（年間50〜200万円）が必要です。
                  InsightBI Suite は独自の変換エンジンを内蔵。追加費用なしで、CSVを入れるだけで使えます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ④ 機能紹介セクション */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-4">
            建設会社に必要な数字が、ひと目でわかる
          </h2>
          <p className="text-center text-slate-600 mb-12">経営者が本当に見たい指標を厳選</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📈', title: 'P/L推移', desc: '月次の売上・原価・利益を時系列で把握' },
              { icon: '🏗️', title: '工事別採算', desc: '案件ごとの粗利・進捗・原価推移を確認' },
              { icon: '⚠️', title: 'アラート', desc: '粗利率低下、滞留債権を自動で検知・通知' },
              { icon: '📱', title: 'スマホ対応', desc: '外出先でもスマホで数字をチェック' },
              { icon: '💬', title: 'アクション管理', desc: '課題をその場で担当者にアサイン' },
              { icon: '🔒', title: 'セキュリティ', desc: '銀行レベルの暗号化で安心' },
            ].map((f, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-6 hover:bg-slate-100 transition-colors">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑤ 比較セクション */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-12">
            他のBIツールとの違い
          </h2>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="py-4 px-4 text-left font-medium"></th>
                    <th className="py-4 px-4 text-center font-bold bg-indigo-600">InsightBI Suite</th>
                    <th className="py-4 px-4 text-center font-medium">Power BI</th>
                    <th className="py-4 px-4 text-center font-medium">Tableau</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { label: '月額費用', genba: '3万円〜', power: '無料〜', tableau: '9万円〜' },
                    { label: 'ETLツール', genba: '✅ 不要', power: '別途必要', tableau: '別途必要' },
                    { label: '導入期間', genba: '✅ 即日', power: '1-3ヶ月', tableau: '1-3ヶ月' },
                    { label: '専門知識', genba: '✅ 不要', power: 'SQL必要', tableau: 'SQL必要' },
                    { label: '建設業対応', genba: '✅ 標準', power: '要カスタム', tableau: '要カスタム' },
                    { label: '日本語サポート', genba: '✅ 完全対応', power: '限定的', tableau: '限定的' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-700">{row.label}</td>
                      <td className="py-3 px-4 text-center font-bold text-indigo-600 bg-indigo-50">{row.genba}</td>
                      <td className="py-3 px-4 text-center text-slate-600">{row.power}</td>
                      <td className="py-3 px-4 text-center text-slate-600">{row.tableau}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 bg-amber-50 rounded-lg p-4 border border-amber-200">
            <p className="text-sm text-amber-800">
              💡 Power BI は「無料」でも、使うには専門知識が必要です。InsightBI Suite は「すぐ使える」にこだわりました。
            </p>
          </div>
        </div>
      </section>

      {/* ⑥ 料金セクション */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-4">
            シンプルな料金体系
          </h2>
          <p className="text-center text-slate-600 mb-12">初期費用0円、いつでも解約OK</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* スタンダード */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-2">スタンダード</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-800">¥30,000</span>
                <span className="text-slate-500">/月（税別）</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['ダッシュボード', 'CSV取込', 'ユーザー3名', 'メールサポート'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-600">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#cta" className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-lg font-medium transition-colors">
                無料で試す
              </a>
            </div>

            {/* プロ */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                おすすめ
              </div>
              <h3 className="text-lg font-bold mb-2">プロ</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">¥50,000</span>
                <span className="text-white/80">/月（税別）</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['スタンダード全機能', 'ユーザー10名', '専任サポート', '工事別分析', 'API連携'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#cta" className="block w-full text-center bg-white text-indigo-600 py-3 rounded-lg font-bold hover:bg-indigo-50 transition-colors">
                無料で試す
              </a>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-slate-600">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              初期費用 0円
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              14日間無料トライアル
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              いつでも解約OK
            </span>
          </div>
        </div>
      </section>

      {/* ⑦ 導入事例セクション */}
      <section id="cases" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-12">
            導入企業の声
          </h2>

          <div className="space-y-6">
            {[
              {
                quote: '毎月の経営会議が、数字を見ながら議論できるようになりました',
                name: '山田 太郎',
                role: '株式会社○○建設 代表取締役',
                company: '従業員50名 / 売上高30億円',
                problem: 'Excelでの報告資料作成に毎月3日かかっていた',
                result: '報告資料が不要に。会議時間も半減。',
              },
              {
                quote: 'Power BI で挫折した経験がありましたが、これは本当にCSVを入れるだけでした',
                name: '佐藤 花子',
                role: '株式会社△△組 経理部長',
                company: '従業員120名 / 売上高80億円',
                problem: 'BIツール導入に何度も失敗',
                result: '導入初日から稼働。社長も毎日見ている。',
              },
            ].map((case_, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {case_.name[0]}
                  </div>
                  <div className="flex-1">
                    <blockquote className="text-lg font-medium text-slate-800 mb-4">
                      &quot;{case_.quote}&quot;
                    </blockquote>
                    <div className="text-sm text-slate-600 mb-4">
                      <div className="font-medium">{case_.name}</div>
                      <div>{case_.role}</div>
                      <div className="text-slate-400">{case_.company}</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-400 text-xs mb-1">課題</div>
                        <div className="text-slate-600">{case_.problem}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-xs mb-1">効果</div>
                        <div className="text-emerald-600 font-medium">{case_.result}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑧ よくある質問 */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-12">
            よくある質問
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'どの会計ソフトに対応していますか？',
                a: '勘定奉行、弥生会計、freee、マネーフォワード、建設大臣など、CSVエクスポートできるソフトならすべて対応しています。',
              },
              {
                q: '本当にCSVを入れるだけですか？',
                a: 'はい。初回のみ「この列が売上」「この列が原価」という対応付けが必要ですが、AIが自動提案します。2回目以降は完全自動です。',
              },
              {
                q: 'セキュリティは大丈夫ですか？',
                a: '銀行と同レベルの暗号化（SSL/TLS）を採用。データは日本国内のサーバーに保存されます。',
              },
              {
                q: '建設業以外でも使えますか？',
                a: 'はい。製造業、卸売業向けのテンプレートもご用意しています。お問い合わせください。',
              },
              {
                q: '無料トライアルで何ができますか？',
                a: '14日間、すべての機能をお試しいただけます。クレジットカード登録不要で始められます。',
              },
            ].map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-800">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-slate-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑨ CTAセクション */}
      <section id="cta" className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            今すぐ、経営の見える化を始めよう
          </h2>
          <p className="text-white/90 mb-8">
            14日間無料。クレジットカード不要。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-indigo-50 transition-colors shadow-lg"
            >
              無料で試す
            </Link>
            <a
              href="mailto:contact@insightbi.jp"
              className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-white/10 transition-colors"
            >
              お問い合わせ
            </a>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-white font-bold">InsightBI Suite</span>
              </div>
              <p className="text-sm">建設会社のための経営ダッシュボード</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">サービス</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white">機能紹介</a></li>
                <li><a href="#pricing" className="hover:text-white">料金</a></li>
                <li><a href="#cases" className="hover:text-white">導入事例</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">サポート</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#faq" className="hover:text-white">よくある質問</a></li>
                <li><a href="mailto:support@insightbi.jp" className="hover:text-white">お問い合わせ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">会社情報</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-white">利用規約</Link></li>
                <li><Link href="/privacy" className="hover:text-white">プライバシーポリシー</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            © 2025 InsightBI Suite. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
