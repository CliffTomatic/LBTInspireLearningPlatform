/**
 * Toast is a temporary pop-up message.
 * Name came from old Android terminology because it
 *      "pops up briefly like toast."
 */

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';

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

type ToastItemProps = {
    toast: Toast;
    removeToast: (id: number) => void;
};

/**
 * Individual toast notification.
 *
 * Hover behavior:
 * - Toast starts with 8 seconds.
 * - If the user hovers over the toast, the timer pauses.
 * - When the user stops hovering, the timer resumes from the remaining time.
 * - This prevents the toast from disappearing while the user is reading it.
 */
function ToastItem({ toast, removeToast }: ToastItemProps) {
    const TOAST_DURATION_MS = 8000;

    const [remainingMs, setRemainingMs] = useState(TOAST_DURATION_MS);
    const [isHovered, setIsHovered] = useState(false);

    const timeoutRef = useRef<number | null>(null);
    const startedAtRef = useRef<number | null>(null);

    useEffect(() => {
        /**
         * If the user is hovering, pause the countdown.
         *
         * We clear the current timeout and subtract the time
         * that already passed from the remaining time.
         */
        if (isHovered) {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }

            if (startedAtRef.current !== null) {
                const elapsedMs = Date.now() - startedAtRef.current;

                setRemainingMs((currentRemainingMs) =>
                    Math.max(currentRemainingMs - elapsedMs, 0),
                );

                startedAtRef.current = null;
            }

            return;
        }

        /**
         * If the user is not hovering, start/resume the countdown.
         *
         * The timeout uses remainingMs instead of always restarting
         * from 8 seconds.
         */
        startedAtRef.current = Date.now();

        timeoutRef.current = window.setTimeout(() => {
            removeToast(toast.id);
        }, remainingMs);

        return () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [isHovered, remainingMs, removeToast, toast.id]);

    return (
        <div
            className={`toast toast--${toast.type}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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
    );
}

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
        },
        [],
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
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        removeToast={removeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}
