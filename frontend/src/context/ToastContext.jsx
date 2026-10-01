import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = 'info', duration = 4000) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur)
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container overlay */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              item.type === 'success'
                ? 'bg-emerald-500/90 text-white border-emerald-400'
                : item.type === 'error'
                ? 'bg-rose-500/90 text-white border-rose-400'
                : item.type === 'warning'
                ? 'bg-amber-500/90 text-white border-amber-400'
                : 'bg-slate-800/90 text-white border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
              {item.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
              {item.type === 'warning' && <AlertCircle className="w-5 h-5 shrink-0" />}
              {item.type === 'info' && <Info className="w-5 h-5 shrink-0" />}
              <p className="text-sm font-medium leading-snug">{item.message}</p>
            </div>
            <button
              onClick={() => removeToast(item.id)}
              className="p-1 rounded-md hover:bg-black/20 text-white/80 hover:text-white transition"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
