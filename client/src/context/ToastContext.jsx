import { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 transform transition-all duration-500 animate-slide-in z-[9999] ${
            toast.type === "success" ? "bg-slate-900 text-white" : "bg-red-500 text-white"
        }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                toast.type === "success" ? "bg-green-500 text-white" : "bg-white text-red-500"
            }`}>
                <i className={`fa-solid ${toast.type === "success" ? "fa-check" : "fa-xmark"}`}></i>
            </div>
            <p className="font-bold text-sm">{toast.message}</p>
        </div>
      )}
    </ToastContext.Provider>
  );
}