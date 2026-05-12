import { useState, type SyntheticEvent } from 'react';

import { useAuth } from '../../../context/useAuth';
import { registerUser } from '../../../services/authApi';
import './RegisterModal.css';

type RegisterModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
};

export default function RegisterModal({
    isOpen,
    onClose,
    onSwitchToLogin,
}: RegisterModalProps) {
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const { login } = useAuth();

    if (!isOpen) {
        return null;
    }

    async function handleSubmit(
        event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
    ) {
        event.preventDefault();

        try {
            const response = await registerUser({
                email,
                userName,
                displayName,
                password,
            });

            login(response.token, {
                userId: response.userId,
                email: response.email,
                userName: response.userName,
                displayName: response.displayName,
            });

            onClose();
        } catch (error) {
            console.error('Registration failed:', error);
        }
    }

    return (
        <div className="register-modal">
            <div className="register-modal__backdrop" onClick={onClose}></div>

            <div className="register-modal__card">
                <button
                    className="register-modal__close"
                    type="button"
                    onClick={onClose}
                    aria-label="Close register modal"
                >
                    ×
                </button>

                <div className="register-modal__header">
                    <h2 className="register-modal__title">Create an account</h2>

                    <p className="register-modal__subtitle">
                        Gain access to our teachnology based courses.
                    </p>
                </div>

                <form className="register-modal__form" onSubmit={handleSubmit}>
                    <label className="register-modal__field">
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

                    <label className="register-modal__field">
                        <span>Display name</span>
                        <input
                            type="text"
                            id="displayName"
                            name="displayName"
                            autoComplete="name"
                            value={displayName}
                            placeholder="John Doe"
                            onChange={(event) =>
                                setDisplayName(event.target.value)
                            }
                            required
                        />
                    </label>

                    <label className="register-modal__field">
                        <span>Username</span>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            autoComplete="username"
                            value={userName}
                            placeholder="john_doe"
                            onChange={(event) =>
                                setUserName(event.target.value)
                            }
                            required
                        />
                    </label>

                    <label className="register-modal__field">
                        <span>Password</span>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="new-password"
                            value={password}
                            placeholder="Create a password"
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />
                    </label>

                    <button className="register-modal__submit" type="submit">
                        Create account
                    </button>
                </form>

                <p className="register-modal__footer">
                    Already have an account?{' '}
                    <button type="button" onClick={onSwitchToLogin}>
                        Log in
                    </button>
                </p>
            </div>
        </div>
    );
}
