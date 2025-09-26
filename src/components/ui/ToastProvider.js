import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useState } from 'react';
import clsx from 'clsx';
import '../../styles/toasts.css';
const ToastContext = createContext(undefined);
const createId = () => Math.random().toString(36).slice(2, 10);
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const notify = (message, variant = 'info') => {
        const id = createId();
        setToasts((prev) => [...prev, { id, message, variant }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3500);
    };
    const value = useMemo(() => ({ notify }), []);
    return (_jsxs(ToastContext.Provider, { value: value, children: [children, _jsx("div", { className: "toast-corner", role: "status", "aria-live": "polite", children: toasts.map((toast) => (_jsx("div", { className: clsx('toast', `toast--${toast.variant}`), children: toast.message }, toast.id))) })] }));
};
export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return ctx;
};
