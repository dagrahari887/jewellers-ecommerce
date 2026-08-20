import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../store/useStore';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  success: 'bg-white border-l-4 border-green-500 text-green-800',
  error: 'bg-white border-l-4 border-red-500 text-red-800',
  warning: 'bg-white border-l-4 border-amber-500 text-amber-800',
  info: 'bg-white border-l-4 border-bj-gold text-bj-charcoal',
};

export const ToastContainer = () => {
  const toasts = useStore((s) => s.toasts);
  const removeToast = useStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`toast-enter flex items-start gap-3 px-4 py-3.5 shadow-card rounded-sm ${styles[toast.type]}`}
          >
            <Icon size={18} className="shrink-0 mt-0.5" />
            <p className="text-sm flex-1 font-medium">{toast.message}</p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
