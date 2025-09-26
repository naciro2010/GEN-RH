import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import clsx from 'clsx';
import '../../styles/toasts.css';

type ToastVariant = 'info' | 'warn' | 'success';

type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  notify: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const createId = () => Math.random().toString(36).slice(2, 10);

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = (message: string, variant: ToastVariant = 'info') => {
    const id = createId();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  };

  const value = useMemo(() => ({ notify }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-corner" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={clsx('toast', `toast--${toast.variant}`)}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
};
