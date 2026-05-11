// RegisterModal.tsx

import { useState } from 'react';
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

    if (!isOpen) {
        return null;
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        console.log('Register attempt:', {
            email,
            displayName,
            userName,
            password,
        });

        // Later:
        // const response = await register({
        //     email,
        //     displayName,
        //     userName,
        //     password,
        // });
        // localStorage.setItem("token", response.token);
        // onClose();
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
                        Start tracking your progress through LearnBasicTech.
                    </p>
                </div>

                <form className="register-modal__form" onSubmit={handleSubmit}>
                    <label className="register-modal__field">
                        <span>Email</span>
                        <input
                            type="email"
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
