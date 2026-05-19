/**
 * Toast is a temporary pop-up message.
 * Name came from old Android terminology because it
 *      "pops up briefly like toast."
 */

import { useCallback, useMemo, useState, type ReactNode } from 'react';

import {
    ToastContext,
    type Toast,
    type ToastContextValue,
    type ToastType,
} from './ToastContext';

import './ToastProvider.css';

type ToastProviderProps = {
    children: ReactNode;
};

export default function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts((currentToasts) =>
            currentToasts.filter((toast) => toast.id !== id),
        );
    }, []);

    const showToast = useCallback(
        (message: string, type: ToastType = 'info') => {
            const id = Date.now() + Math.random();

            const newToast: Toast = {
                id,
                message,
                type,
            };

            console.log('Toast Message:', message);

            setToasts((currentToasts) => [...currentToasts, newToast]);

            window.setTimeout(() => {
                removeToast(id);
            }, 8000);
        },
        [removeToast],
    );

    const value = useMemo<ToastContextValue>(
        () => ({
            showToast,
            showError: (message: string) => showToast(message, 'error'),
            showSuccess: (message: string) => showToast(message, 'success'),
            showInfo: (message: string) => showToast(message, 'info'),
        }),
        [showToast],
    );

    return (
        <ToastContext.Provider value={value}>
            {children}

            <div className="toast-container">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`toast toast--${toast.type}`}
                    >
                        <p className="toast__message">{toast.message}</p>

                        <button
                            className="toast__close"
                            type="button"
                            onClick={() => removeToast(toast.id)}
                            aria-label="Close notification"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
