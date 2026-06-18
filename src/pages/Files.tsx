import { useState } from 'react';
import FileExplorer from '@/components/FileExplorer';
import AiPanel from '@/components/AiPanel';
import type { FileItem, AiSuggestion } from '@/types/api';

function Files() {
  const [selected, setSelected] = useState<FileItem | null>(null);

  const suggestion: AiSuggestion | null = selected
    ? {
        file: selected.name,
        suggestedName: `2026-06-18_合同_${selected.name}`,
        suggestedCategory: '合同',
        confidence: 0.82,
        reason: `根据文件类型与名称关键词，AI 识别该文件属于"合同"类，建议按命名规则自动重命名。`,
      }
    : null;

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col gap-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">文件工作台</h1>
          <p className="mt-1 text-sm text-slate-500">浏览并整理你的工作文件，AI 将根据选中文件自动给出分类建议。</p>
        </div>
      </div>
      <div className="flex flex-1 gap-4 min-h-0">
        <div className="flex-1 min-w-0">
          <FileExplorer onSelectFile={(f) => setSelected(f)} />
        </div>
        <AiPanel suggestion={suggestion} />
      </div>
    </div>
  );
}

export default Files;
