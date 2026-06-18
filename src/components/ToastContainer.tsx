import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useToast } from '@/store/useToast';

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed right-6 top-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => {
        const styles =
          t.type === 'success'
            ? 'bg-teal-600 text-white'
            : t.type === 'error'
              ? 'bg-rose-600 text-white'
              : 'bg-sky-600 text-white';

        const Icon =
          t.type === 'success' ? CheckCircle2 : t.type === 'error' ? XCircle : Info;

        return (
          <div
            key={t.id}
            className={`flex min-w-[240px] items-center gap-3 rounded-xl px-4 py-3 shadow-lg animate-slide-in ${styles}`}
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1 text-sm">{t.message}</span>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="text-white/80 hover:text-white"
              aria-label="关闭"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;
