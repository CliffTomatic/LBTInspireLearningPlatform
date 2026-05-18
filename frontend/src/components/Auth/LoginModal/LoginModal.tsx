import { useState, type SyntheticEvent } from 'react';

import { useAuth } from '../../../context/useAuth';
import { loginUser } from '../../../services/authApi';
import './LoginModal.css';
import { ApiError } from '../../../types/Api/Auth';

type LoginModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
};

export default function LoginModal({
    isOpen,
    onClose,
    onSwitchToRegister,
}: LoginModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login } = useAuth();

    const [formError, setFormError] = useState<string | null>(null);

    if (!isOpen) {
        return null;
    }

    async function handleSubmit(
        event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
    ) {
        event.preventDefault();

        setFormError(null);

        const nextFieldErrors: Record<string, string[]> = {};

        if (!email.trim()) {
            nextFieldErrors.email = ['Email is required.'];
        }

        if (!password.trim()) {
            nextFieldErrors.password = ['Password is required.'];
        }

        if (Object.keys(nextFieldErrors).length > 0) {
            setFormError('Please fix the highlighted fields.');
            return;
        }

        try {
            const response = await loginUser({
                email,
                password,
            });

            if (response == null) {
                return;
            }

            login(response.token, {
                userId: response.userId,
                email: response.email,
                userName: response.userName,
                displayName: response.displayName,
            });

            onClose();
        } catch (error) {
            if (error instanceof ApiError) {
                setFormError(error.message);
                return;
            }

            setFormError('Something went wrong. Please try again.');
        }
    }

    return (
        <div className="login-modal">
            <div className="login-modal__backdrop" onClick={onClose}></div>

            <div className="login-modal__card">
                <button
                    className="login-modal__close"
                    type="button"
                    onClick={onClose}
                    aria-label="Close login modal"
                >
                    ×
                </button>

                <div className="login-modal__header">
                    <h2 className="login-modal__title">Welcome back</h2>
                    <p className="login-modal__subtitle">
                        Log in to continue your learning progress.
                    </p>
                </div>

                <form className="login-modal__form" onSubmit={handleSubmit}>
                    <label className="login-modal__field">
                        <span>Email</span>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="email"
                            value={email}
                            placeholder="you@example.com"
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </label>

                    <label className="login-modal__field">
                        <span>Password</span>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="current-password"
                            value={password}
                            placeholder="Enter your password"
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />
                    </label>

                    <button className="login-modal__submit" type="submit">
                        Log in
                    </button>
                    {formError && (
                        <p className="auth-form-error">{formError}</p>
                    )}
                </form>

                <p className="login-modal__footer">
                    New to Pulse?{' '}
                    <button type="button" onClick={onSwitchToRegister}>
                        Create an account
                    </button>
                </p>
            </div>
        </div>
    );
}
