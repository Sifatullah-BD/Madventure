import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

const icons = {
    success: { Icon: CheckCircle, bg: 'bg-green-50 dark:bg-green-900/30', border: 'border-green-200 dark:border-green-800', text: 'text-green-600 dark:text-green-400' },
    error: { Icon: AlertCircle, bg: 'bg-red-50 dark:bg-red-900/30', border: 'border-red-200 dark:border-red-800', text: 'text-red-600 dark:text-red-400' },
    warning: { Icon: AlertTriangle, bg: 'bg-orange-50 dark:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-600 dark:text-orange-400' },
    info: { Icon: Info, bg: 'bg-blue-50 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-600 dark:text-blue-400' },
};

const ToastItem = ({ toast, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const config = icons[toast.type] || icons.info;

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setIsVisible(true));
    }, []);

    const handleDismiss = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => onDismiss(toast.id), 300);
    }, [toast.id, onDismiss]);

    useEffect(() => {
        const timer = setTimeout(handleDismiss, toast.duration || 4000);
        return () => clearTimeout(timer);
    }, [handleDismiss, toast.duration]);

    return (
        <div
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md max-w-sm w-full
                ${config.bg} ${config.border}
                transition-all duration-300 ease-out
                ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
        >
            <config.Icon size={20} className={`${config.text} flex-shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
                {toast.title && (
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{toast.title}</p>
                )}
                <p className="text-gray-600 dark:text-gray-300 text-sm">{toast.message}</p>
            </div>
            <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message, options = {}) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, type, message, ...options }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = useCallback({
        success: (msg, opts) => addToast('success', msg, opts),
        error: (msg, opts) => addToast('error', msg, opts),
        warning: (msg, opts) => addToast('warning', msg, opts),
        info: (msg, opts) => addToast('info', msg, opts),
    }, [addToast]);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map(t => (
                    <div key={t.id} className="pointer-events-auto">
                        <ToastItem toast={t} onDismiss={removeToast} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within a ToastProvider');
    return ctx;
};

export default ToastProvider;
