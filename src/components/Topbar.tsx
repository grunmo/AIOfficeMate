import { useLocation } from 'react-router-dom';
import { Sun, Moon, Folder, ChevronsRight } from 'lucide-react';
import { useSettings } from '@/store/useSettings';

const pathLabels: Record<string, string> = {
  '/': '仪表盘',
  '/files': '文件工作台',
  '/scan': '扫描件处理',
  '/ai': 'AI智能命名',
  '/knowledge': '知识库',
  '/settings': '系统设置',
};

function Topbar() {
  const location = useLocation();
  const { workDir, theme, setSetting } = useSettings();

  const currentLabel = pathLabels[location.pathname] || '首页';
  const isDark = theme === 'dark';

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 px-6 py-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400">AI办公助手</span>
        <ChevronsRight className="h-4 w-4 text-slate-300" />
        <span className="font-medium text-slate-800 dark:text-slate-100">{currentLabel}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-700 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300">
          <Folder className="h-3.5 w-3.5 text-teal-600" />
          <span className="max-w-[280px] truncate">{workDir}</span>
        </div>
        <button
          type="button"
          onClick={() => setSetting('theme', isDark ? 'light' : 'dark')}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700"
          aria-label="切换主题"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}

export default Topbar;
