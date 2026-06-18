import { useState } from 'react';
import { Search, Plus, Send, FileText, BookOpen } from 'lucide-react';
import type { KnowledgeSpace, KnowledgeDocument, ChatMessage } from '@/types/api';

const spaces: KnowledgeSpace[] = [
  { id: 's1', name: '商务合同库', description: '公司日常合同与协议文档', docCount: 34, createdAt: '2026-03-12' },
  { id: 's2', name: '财务报告', description: '季度 / 年度财务分析报告', docCount: 18, createdAt: '2026-04-18' },
  { id: 's3', name: '产品文档', description: 'PRD、需求清单与评审记录', docCount: 22, createdAt: '2026-05-02' },
  { id: 's4', name: '会议纪要', description: '各团队周会与项目会议', docCount: 18, createdAt: '2026-05-20' },
];

const documents: KnowledgeDocument[] = [
  { id: 'd1', spaceId: 's1', title: '2026 服务合作协议 v3', filePath: '/合同/2026服务合作协议.pdf', createdAt: '2026-06-18 09:00' },
  { id: 'd2', spaceId: 's1', title: '甲方乙方 NDA 保密协议', filePath: '/合同/NDA.pdf', createdAt: '2026-06-16 10:20' },
  { id: 'd3', spaceId: 's2', title: 'Q2 财务分析报告', filePath: '/财务/Q2财务.pdf', createdAt: '2026-06-12 11:00' },
  { id: 'd4', spaceId: 's2', title: '年度预算规划表', filePath: '/财务/预算.xlsx', createdAt: '2026-06-08 14:10' },
  { id: 'd5', spaceId: 's3', title: 'AI 办公助手 PRD', filePath: '/产品/PRD.md', createdAt: '2026-06-10 16:40' },
  { id: 'd6', spaceId: 's4', title: '产品周会 06/17', filePath: '/会议/0617.md', createdAt: '2026-06-17 15:00' },
];

const initialMessages: ChatMessage[] = [
  { role: 'assistant', content: '你好，我是知识库助手。请向我提问当前空间内的文档内容，我会基于资料为你解答。' },
];

function Knowledge() {
  const [activeSpace, setActiveSpace] = useState<string>('s1');
  const [keyword, setKeyword] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const spaceName = spaces.find((s) => s.id === activeSpace)?.name || '';
  const filteredDocs = documents
    .filter((d) => d.spaceId === activeSpace)
    .filter((d) => (keyword ? d.title.includes(keyword) || d.filePath.includes(keyword) : true));

  const send = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: input.trim() };
    const replyMsg: ChatMessage = {
      role: 'assistant',
      content: `已在"${spaceName}"空间中检索相关文档。根据"${filteredDocs[0]?.title || '当前文档'}"中的内容，建议重点关注以下几点：\n1. 服务条款与责任划分；\n2. 金额与结算时间；\n3. 违约条款。`,
      sources: filteredDocs.slice(0, 3).map((d) => d.title),
    };
    setMessages((m) => [...m, userMsg, replyMsg]);
    setInput('');
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-4 animate-fade-in">
      <aside className="w-64 flex-shrink-0 flex flex-col rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">知识空间</h3>
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg bg-teal-600 px-2 py-1 text-xs text-white transition-all duration-200 hover:bg-teal-700"
          >
            <Plus className="h-3.5 w-3.5" />
            新建
          </button>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar p-3">
          {spaces.map((s) => {
            const active = s.id === activeSpace;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSpace(s.id)}
                className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
                  active
                    ? 'border-teal-300 bg-teal-50 dark:bg-slate-700 dark:border-teal-700'
                    : 'border-transparent bg-slate-50 dark:bg-slate-700/40 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-sm">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                    {s.name}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-400">{s.docCount} 篇文档</div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="flex flex-1 flex-col rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 px-5 py-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={`在"${spaceName}"中搜索文档...`}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 py-2 pl-9 pr-3 text-sm outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/60"
            />
          </div>
          <span className="text-xs text-slate-400">共 {filteredDocs.length} 篇</span>
        </div>

        <div className="flex-1 grid grid-cols-3 overflow-hidden">
          <div className="col-span-2 overflow-y-auto custom-scrollbar border-r border-slate-100 dark:border-slate-700 p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filteredDocs.map((d) => (
                <div
                  key={d.id}
                  className="flex items-start gap-3 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-700 shadow-sm">
                    <FileText className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {d.title}
                    </div>
                    <div className="mt-1 truncate text-xs text-slate-400">{d.filePath}</div>
                    <div className="mt-1 text-xs text-slate-400">导入：{d.createdAt}</div>
                  </div>
                </div>
              ))}
              {filteredDocs.length === 0 && (
                <div className="col-span-full py-16 text-center text-sm text-slate-400">
                  该空间暂无匹配文档
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col overflow-hidden">
            <div className="border-b border-slate-100 dark:border-slate-700 px-4 py-3 text-xs font-medium text-slate-500">
              对话助手 · {spaceName}
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar p-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {m.content}
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-2 border-t border-white/20 pt-2 text-[10px] opacity-80">
                        引用：{m.sources.join('；')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 dark:border-slate-700 p-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100 dark:focus-within:ring-teal-900/60 transition-all duration-200">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') send();
                  }}
                  placeholder="输入问题，按回车发送..."
                  className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 outline-none"
                />
                <button
                  type="button"
                  onClick={send}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white transition-all duration-200 hover:bg-teal-700"
                  aria-label="发送"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Knowledge;
