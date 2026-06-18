import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  Scan,
  Sparkles,
  BookOpen,
  Settings2,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: '仪表盘', path: '/', icon: LayoutDashboard },
  { label: '文件工作台', path: '/files', icon: FolderOpen },
  { label: '扫描件处理', path: '/scan', icon: Scan },
  { label: 'AI智能命名', path: '/ai', icon: Sparkles },
  { label: '知识库', path: '/knowledge', icon: BookOpen },
  { label: '系统设置', path: '/settings', icon: Settings2 },
];

function Sidebar() {
  return (
    <aside
      className="flex h-full flex-col border-r border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm"
      style={{ width: 220, minWidth: 220 }}
    >
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white font-bold shadow-sm animate-glow">
          AI
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">AI办公助手</div>
          <div className="text-xs text-slate-400">Office Assistant</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 dark:border-slate-700 px-5 py-4 text-xs text-slate-400">
        v0.1.0 · Powered by AI
      </div>
    </aside>
  );
}

export default Sidebar;
