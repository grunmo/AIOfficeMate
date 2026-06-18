import {
  Folder,
  FileCheck,
  Sparkles,
  BookOpen,
  ArrowRight,
  Scan,
  FolderOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const mockRecent = [
  { name: '2024合同.pdf', size: '240 KB', time: '2026-06-18 09:00', category: '合同' },
  { name: '服务协议.docx', size: '100 KB', time: '2026-06-16 15:30', category: '合同' },
  { name: '发票扫描件.pdf', size: '500 KB', time: '2026-06-12 11:00', category: '财务' },
  { name: '季度报表.xlsx', size: '80 KB', time: '2026-06-10 16:40', category: '财务' },
  { name: '会议纪要.md', size: '12 KB', time: '2026-06-08 10:20', category: '会议' },
];

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  subtitle: string;
  gradient: string;
}

function StatCard({ icon: Icon, title, value, subtitle, gradient }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white dark:bg-slate-800 p-5 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-200 hover:shadow-md">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm ${gradient}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <div className="text-xs text-slate-400">{title}</div>
        <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{value}</div>
        <div className="text-xs text-slate-400">{subtitle}</div>
      </div>
    </div>
  );
}

interface QuickCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  to: string;
  gradient: string;
}

function QuickCard({ icon: Icon, title, description, to, gradient }: QuickCardProps) {
  return (
    <Link
      to={to}
      className={`group relative flex items-center justify-between overflow-hidden rounded-2xl p-5 text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${gradient}`}
    >
      <div>
        <div className="text-base font-semibold">{title}</div>
        <div className="mt-1 text-xs opacity-90">{description}</div>
      </div>
      <div className="flex items-center gap-1.5">
        <Icon className="h-5 w-5" />
        <ArrowRight className="h-4 w-4 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
      </div>
    </Link>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Folder}
          title="文件总数"
          value="128"
          subtitle="覆盖 12 个分类"
          gradient="bg-gradient-to-br from-indigo-500 to-violet-600"
        />
        <StatCard
          icon={FileCheck}
          title="今日整理"
          value="18"
          subtitle="AI 自动识别"
          gradient="bg-gradient-to-br from-teal-500 to-emerald-600"
        />
        <StatCard
          icon={Sparkles}
          title="AI 使用次数"
          value="342"
          subtitle="本月累计"
          gradient="bg-gradient-to-br from-amber-500 to-orange-600"
        />
        <StatCard
          icon={BookOpen}
          title="知识空间"
          value="6"
          subtitle="共 92 篇文档"
          gradient="bg-gradient-to-br from-rose-500 to-pink-600"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">最近文件</h2>
          <Link to="/files" className="text-xs text-teal-600 hover:text-teal-700">
            查看全部 →
          </Link>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {mockRecent.map((f, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 px-5 py-3 text-sm transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-900/40">
                <FileCheck className="h-4 w-4 text-teal-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-700 dark:text-slate-200">{f.name}</div>
                <div className="text-xs text-slate-400">{f.time} · {f.size}</div>
              </div>
              <span className="rounded-full bg-slate-100 dark:bg-slate-700 px-2.5 py-1 text-xs text-slate-500 dark:text-slate-300">
                {f.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <QuickCard
          icon={FolderOpen}
          title="文件工作台"
          description="浏览、管理本地文件"
          to="/files"
          gradient="bg-gradient-to-br from-indigo-500 to-violet-600"
        />
        <QuickCard
          icon={Scan}
          title="扫描件处理"
          description="纠偏 · 增强 · 旋转"
          to="/scan"
          gradient="bg-gradient-to-br from-teal-500 to-emerald-600"
        />
        <QuickCard
          icon={Sparkles}
          title="AI 智能命名"
          description="一键生成规范文件名"
          to="/ai"
          gradient="bg-gradient-to-br from-amber-500 to-orange-600"
        />
      </div>
    </div>
  );
}

export default Dashboard;
