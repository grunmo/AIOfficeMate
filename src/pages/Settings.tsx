import { useState } from 'react';
import { Save, Folder, Bot, Type, Info } from 'lucide-react';
import { useSettings } from '@/store/useSettings';
import { useToast } from '@/store/useToast';

type TabKey = 'general' | 'model' | 'naming' | 'about';

const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'general', label: '常规', icon: Folder },
  { key: 'model', label: '模型', icon: Bot },
  { key: 'naming', label: '命名规则', icon: Type },
  { key: 'about', label: '关于', icon: Info },
];

function Settings() {
  const [tab, setTab] = useState<TabKey>('general');
  const store = useSettings();
  const { addToast } = useToast();

  const save = () => {
    void store.saveSettings();
    addToast('设置已保存', 'success');
  };

  const setTheme = (theme: 'light' | 'dark') => {
    store.setSetting('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-4 animate-fade-in">
      <aside className="w-56 flex-shrink-0 rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-3 shadow-sm">
        <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">设置</div>
        <nav className="space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = t.key === tab;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                  active
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 dark:border-slate-700 px-6 py-4">
          <h1 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            {tabs.find((t) => t.key === tab)?.label}设置
          </h1>
          <p className="mt-1 text-xs text-slate-400">根据使用习惯配置应用行为，所有修改将自动同步至当前设备。</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {tab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">工作目录</label>
                <input
                  type="text"
                  value={store.workDir}
                  onChange={(e) => store.setSetting('workDir', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/60"
                />
                <p className="mt-1 text-xs text-slate-400">指定默认扫描与文件操作的根目录。</p>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-slate-500">主题</label>
                <div className="flex gap-3">
                  {(['light', 'dark'] as const).map((t) => {
                    const active = store.theme === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTheme(t)}
                        className={`flex-1 rounded-2xl border px-4 py-3 text-sm transition-all duration-200 ${
                          active
                            ? 'border-teal-400 bg-teal-50 dark:bg-slate-700 dark:border-teal-700 text-teal-700 dark:text-teal-300 shadow-sm'
                            : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-teal-300'
                        }`}
                      >
                        {t === 'light' ? '浅色模式' : '深色模式'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === 'model' && (
            <div className="space-y-6">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">大模型 Provider</label>
                <select
                  value={store.llmProvider}
                  onChange={(e) => store.setSetting('llmProvider', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/60"
                >
                  <option value="mock">Mock（本地演示）</option>
                  <option value="openai">OpenAI / 兼容协议</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">模型名称</label>
                <input
                  type="text"
                  value={store.llmModel}
                  onChange={(e) => store.setSetting('llmModel', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/60"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">API Key</label>
                <input
                  type="password"
                  value={store.llmApiKey}
                  onChange={(e) => store.setSetting('llmApiKey', e.target.value)}
                  placeholder="sk-..."
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/60"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">Base URL</label>
                <input
                  type="text"
                  value={store.llmBaseUrl}
                  onChange={(e) => store.setSetting('llmBaseUrl', e.target.value)}
                  placeholder="https://api.example.com/v1"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/60"
                />
              </div>
            </div>
          )}

          {tab === 'naming' && (
            <div className="space-y-6">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">命名模板</label>
                <input
                  type="text"
                  value={store.namingTemplate}
                  onChange={(e) => store.setSetting('namingTemplate', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/60"
                />
                <p className="mt-1 text-xs text-slate-400">
                  支持占位符：{'{日期}'}、{'{分类}'}、{'{原始文件名}'}
                </p>
              </div>

              <div className="rounded-xl border border-teal-200/60 dark:border-teal-900/60 bg-teal-50/60 dark:bg-teal-900/20 p-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                <div className="mb-1 text-xs font-semibold text-teal-700 dark:text-teal-300">示例</div>
                <div className="font-mono text-xs">
                  原始文件：未命名文档.pdf
                  <br />
                  命名结果：2026-06-18_合同_未命名文档.pdf
                </div>
              </div>
            </div>
          )}

          {tab === 'about' && (
            <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300">
              <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 p-5">
                <div className="text-base font-semibold text-slate-800 dark:text-slate-100">AI 办公助手</div>
                <div className="mt-1 text-xs text-slate-400">版本 v0.1.0 · 构建于 2026-06-18</div>
                <p className="mt-3 leading-relaxed text-slate-500 dark:text-slate-300">
                  一款专注于办公文件整理、扫描件处理与知识库问答的桌面工具，通过 AI 能力帮助你快速梳理文档、生成规范命名，并沉淀成可检索的企业知识。
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { label: '前端框架', value: 'React 18 + Vite' },
                  { label: '样式方案', value: 'Tailwind CSS 3' },
                  { label: '状态管理', value: 'Zustand + TypeScript' },
                ].map((it, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4"
                  >
                    <div className="text-xs text-slate-400">{it.label}</div>
                    <div className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                      {it.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 text-xs leading-relaxed text-slate-500 dark:text-slate-300">
                <div className="mb-1 text-sm font-semibold text-slate-700 dark:text-slate-200">开源协议</div>
                本项目遵循 MIT 协议，欢迎基于本项目进行二次开发与商业使用。使用过程中遇到问题或建议，欢迎提交 Issue / PR 进行反馈。
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-700/30 px-6 py-4">
          <button
            type="button"
            onClick={() => {
              void store.loadSettings();
              addToast('已重置为保存的设置', 'info');
            }}
            className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-xs text-slate-600 dark:text-slate-300 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-600"
          >
            取消修改
          </button>
          <button
            type="button"
            onClick={save}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-teal-700 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:brightness-105"
          >
            <Save className="h-3.5 w-3.5" />
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
