import { ReactNode, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { useSettings } from '@/store/useSettings';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { theme, loadSettings } = useSettings();

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex h-full w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-auto custom-scrollbar p-6">{children}</div>
      </main>
    </div>
  );
}

export default Layout;
