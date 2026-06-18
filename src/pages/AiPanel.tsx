import { useState } from 'react';
import { Sparkles, CheckCheck, Wand2 } from 'lucide-react';
import { useToast } from '@/store/useToast';
import type { AiSuggestion } from '@/types/api';

const initialSuggestions: AiSuggestion[] = [
  {
    file: '未命名文档-01.pdf',
    suggestedName: '2026-06-18_合同_服务协议.pdf',
    suggestedCategory: '合同',
    confidence: 0.92,
    reason: '包含合同条款与甲方乙方信息。',
  },
  {
    file: 'scan_20260612.jpg',
    suggestedName: '2026-06-12_财务_增值税发票.jpg',
    suggestedCategory: '财务',
    confidence: 0.87,
    reason: '图像中含发票抬头、金额与税号。',
  },
  {
    file: 'meeting-notes.md',
    suggestedName: '2026-06-08_会议纪要_产品周会.md',
    suggestedCategory: '会议纪要',
    confidence: 0.81,
    reason: '包含日期、参会人、议题与结论。',
  },
  {
    file: 'report_v3.docx',
    suggestedName: '2026-05-30_报告_季度业务分析.docx',
    suggestedCategory: '报告',
    confidence: 0.65,
    reason: '包含数据图表与结论性段落，建议人工复核。',
  },
  {
    file: 'scan_0015.png',
    suggestedName: '2026-06-01_合同_合作意向书.png',
    suggestedCategory: '合同',
    confidence: 0.52,
    reason: 'OCR 文本较模糊，置信度偏低，请人工确认。',
  },
];

function AiPanelPage() {
  const [list, setList] = useState<AiSuggestion[]>(initialSuggestions);
  const { addToast } = useToast();

  const applyOne = (idx: number) => {
    setList((l) => l.filter((_, i) => i !== idx));
    addToast('已应用命名建议', 'success');
  };

  const applyAll = () => {
    setList([]);
    addToast('已批量应用全部建议', 'success');
  };

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col gap-4 animate-fade-in">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-800 dark:text-slate-100">AI 智能命名</h1>
            <p className="mt-0.5 text-xs text-slate-500">
              基于文件内容自动生成规范文件名与分类，点击"应用"即可批量重命名。
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-600"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            选择文件进行分析
          </button>
          <button
            type="button"
            onClick={applyAll}
            disabled={list.length === 0}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-teal-700 px-3 py-2 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Wand2 className="h-3.5 w-3.5" />
            一键应用全部 ({list.length})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm">
        <div className="grid grid-cols-12 gap-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-700/40 px-5 py-3 text-xs font-medium text-slate-500">
          <div className="col-span-3">原始文件名</div>
          <div className="col-span-3">建议文件名</div>
          <div className="col-span-2">建议分类</div>
          <div className="col-span-2">置信度</div>
          <div className="col-span-2 text-right">操作</div>
        </div>
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Sparkles className="h-10 w-10" />
              <p className="mt-3 text-sm">暂无待处理文件</p>
              <p className="mt-1 text-xs">点击顶部"选择文件进行分析"添加文件</p>
            </div>
          ) : (
            list.map((item, idx) => {
              const badgeColor =
                item.confidence >= 0.8
                  ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300'
                  : item.confidence >= 0.6
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300';
              return (
                <div
                  key={idx}
                  className="grid grid-cols-12 items-center gap-2 border-b border-slate-100 dark:border-slate-700 px-5 py-4 text-sm transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/40"
                >
                  <div className="col-span-3 truncate text-slate-700 dark:text-slate-200">{item.file}</div>
                  <div className="col-span-3 truncate font-medium text-teal-700 dark:text-teal-300">
                    {item.suggestedName}
                  </div>
                  <div className="col-span-2">
                    <span className="inline-block rounded-full bg-slate-100 dark:bg-slate-700 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300">
                      {item.suggestedCategory}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${badgeColor}`}>
                      {(item.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <button
                      type="button"
                      onClick={() => applyOne(idx)}
                      className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:bg-teal-700"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      应用
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default AiPanelPage;
