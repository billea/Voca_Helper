"use client";
import * as React from 'react';

type ToastItem = { id: string; message: string; type?: 'info' | 'success' | 'warn' | 'error'; duration?: number };

type Ctx = { show: (message: string, opts?: Omit<ToastItem, 'id' | 'message'>) => void };

const ToastContext = React.createContext<Ctx | null>(null);

export function useToast(): Ctx {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const show = (message: string, opts?: Omit<ToastItem, 'id' | 'message'>) => {
    const item: ToastItem = { id: Math.random().toString(36).slice(2, 9), message, ...opts };
    setToasts((t) => [...t, item]);
    const d = opts?.duration ?? 1600;
    if (d !== 0) setTimeout(() => setToasts((t) => t.filter((x) => x.id !== item.id)), Math.max(600, d));
  };
  const value = React.useMemo(() => ({ show }), []);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2 space-y-2">
        {toasts.map((t) => {
          const styles =
            t.type === 'success' ? 'bg-emerald-700 border-emerald-400 text-emerald-50' :
            t.type === 'warn' ? 'bg-amber-800 border-amber-400 text-amber-50' :
            t.type === 'error' ? 'bg-rose-800 border-rose-400 text-rose-50' :
            'bg-slate-800 border-slate-500 text-slate-100';
          return (
            <div key={t.id} role="status" className={`pointer-events-auto rounded-md border px-4 py-2 text-sm shadow-lg ${styles}`}>
              {t.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

