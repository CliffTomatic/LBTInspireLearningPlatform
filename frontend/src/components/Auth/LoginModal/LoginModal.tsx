import { useState } from 'react';
import { login } from '../../../services/authApi';
import './LoginModal.css';

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

    if (!isOpen) {
        return null;
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        console.log('Login attempt:', {
            email,
            password,
        });

        const response = await login({ email, password });
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('userName', response.userName);
        localStorage.setItem('userDisplayName', response.displayName);
        onClose();
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
                            autoComplete="password"
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
