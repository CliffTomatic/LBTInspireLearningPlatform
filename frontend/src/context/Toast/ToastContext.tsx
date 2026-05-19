import { createContext } from 'react';

export type ToastType = 'error' | 'success' | 'info';

export type Toast = {
    id: number;
    message: string;
    type: ToastType;
};

export type ToastContextValue = {
    showToast: (message: string, type?: ToastType) => void;
    showError: (message: string) => void;
    showSuccess: (message: string) => void;
    showInfo: (message: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
