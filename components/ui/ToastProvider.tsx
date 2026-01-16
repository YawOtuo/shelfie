import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Toast } from "./Toast";

type ToastVariant = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, message, variant }]);
    },
    []
  );

  const showSuccess = useCallback(
    (message: string) => showToast(message, "success"),
    [showToast]
  );

  const showError = useCallback(
    (message: string) => showToast(message, "error"),
    [showToast]
  );

  const showInfo = useCallback(
    (message: string) => showToast(message, "info"),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo }}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          variant={toast.variant}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
