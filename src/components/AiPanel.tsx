import { Sparkles, Check } from 'lucide-react';
import type { AiSuggestion } from '@/types/api';
import { useToast } from '@/store/useToast';

interface AiPanelProps {
  suggestion?: AiSuggestion | null;
  onApply?: (suggestion: AiSuggestion) => void;
}

const categoryOptions = ['合同', '财务', '会议纪要', '报告', '个人文档', '其他'];

function AiPanel({ suggestion, onApply }: AiPanelProps) {
  const { addToast } = useToast();

  const current: AiSuggestion | null =
    suggestion || {
      file: '未命名文档.pdf',
      suggestedName: '2026-06-18_合同_服务协议.pdf',
      suggestedCategory: '合同',
      confidence: 0.87,
      reason: '文档内容包含大量合同条款、甲方乙方信息、金额与服务期限等关键词，判断为商务合同文件。',
    };

  const badgeColor =
    current.confidence >= 0.8
      ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300'
      : current.confidence >= 0.6
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';

  const handleApply = () => {
    onApply?.(current);
    addToast('已应用 AI 建议', 'success');
  };

  return (
    <aside
      className="flex flex-col rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm"
      style={{ width: 340, minWidth: 340 }}
    >
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-sm animate-glow">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">AI 建议</div>
            <div className="text-xs text-slate-400">智能识别与整理</div>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeColor}`}>
          置信度 {(current.confidence * 100).toFixed(0)}%
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar p-5">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">源文件</label>
          <div className="truncate rounded-lg bg-slate-50 dark:bg-slate-700 px-3 py-2 text-sm text-slate-600 dark:text-slate-200">
            {current.file}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">建议文件名</label>
          <input
            type="text"
            defaultValue={current.suggestedName}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/60"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">建议分类</label>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((c) => {
              const active = c === current.suggestedCategory;
              return (
                <span
                  key={c}
                  className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                    active
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-teal-50 hover:text-teal-700 dark:hover:text-teal-300'
                  }`}
                >
                  {c}
                </span>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">AI 分析说明</label>
          <div className="rounded-xl border border-teal-200/60 dark:border-teal-900/60 bg-teal-50/60 dark:bg-teal-900/20 p-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {current.reason}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 p-4">
        <button
          type="button"
          onClick={handleApply}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:brightness-105"
        >
          <Check className="h-4 w-4" />
          应用建议
        </button>
      </div>
    </aside>
  );
}

export default AiPanel;
