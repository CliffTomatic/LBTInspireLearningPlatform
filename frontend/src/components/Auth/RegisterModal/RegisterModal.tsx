import { useState, type SyntheticEvent } from 'react';

import { useAuth } from '../../../context/useAuth';
import { registerUser } from '../../../services/authApi';
import './RegisterModal.css';
import { ApiError } from '../../../types/Api/Auth';

type RegisterModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
};

function getFirstFieldError(
    fieldErrors: Record<string, string[]>,
    fieldName: string,
) {
    return fieldErrors[fieldName]?.[0] ?? null;
}

function getPasswordChecks(password: string) {
    return {
        hasMinLength: password.length >= 8,
        hasLowercase: /[a-z]/.test(password),
        hasUppercase: /[A-Z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSymbol: /[^A-Za-z0-9]/.test(password),
    };
}

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RegisterModal({
    isOpen,
    onClose,
    onSwitchToLogin,
}: RegisterModalProps) {
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const [formError, setFormError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>(
        {},
    );

    // Password Checks
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const { login } = useAuth();

    const emailError = getFirstFieldError(fieldErrors, 'email');
    const displayNameError = getFirstFieldError(fieldErrors, 'displayName');
    const userNameError = getFirstFieldError(fieldErrors, 'userName');
    const passwordError = getFirstFieldError(fieldErrors, 'password');

    const passwordChecks = getPasswordChecks(password);

    const passwordIsStrong =
        passwordChecks.hasMinLength &&
        passwordChecks.hasLowercase &&
        passwordChecks.hasUppercase &&
        passwordChecks.hasNumber &&
        passwordChecks.hasSymbol;

    const passwordRules = [
        {
            label: 'At least 8 characters',
            isValid: passwordChecks.hasMinLength,
        },
        {
            label: 'One lowercase letter',
            isValid: passwordChecks.hasLowercase,
        },
        {
            label: 'One uppercase letter',
            isValid: passwordChecks.hasUppercase,
        },
        {
            label: 'One number',
            isValid: passwordChecks.hasNumber,
        },
        {
            label: 'One symbol',
            isValid: passwordChecks.hasSymbol,
        },
    ];

    const shouldShowPasswordChecklist = isPasswordFocused || !!passwordError;

    if (!isOpen) {
        return null;
    }

    function clearFieldError(fieldName: string) {
        setFieldErrors((current) => {
            const next = { ...current };
            delete next[fieldName];

            clearFormErrorIfNoFieldErrors(next);

            return next;
        });
    }

    function handleClose() {
        setFormError(null);
        setFieldErrors({});
        onClose();
    }

    function handleSwitchToLogin() {
        setFormError(null);
        setFieldErrors({});
        onSwitchToLogin();
    }

    function clearFormErrorIfNoFieldErrors(
        nextFieldErrors: Record<string, string[]>,
    ) {
        if (Object.keys(nextFieldErrors).length === 0) {
            setFormError(null);
        }
    }

    async function handleSubmit(
        event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
    ) {
        event.preventDefault();

        setFormError(null);
        setFieldErrors({});

        const nextFieldErrors: Record<string, string[]> = {};

        if (!email.trim()) {
            nextFieldErrors.email = ['Email is required.'];
        } else if (!isValidEmail(email.trim())) {
            nextFieldErrors.email = ['Enter a valid email address.'];
        }

        if (!displayName.trim()) {
            nextFieldErrors.displayName = ['Display name is required.'];
        }

        if (!userName.trim()) {
            nextFieldErrors.userName = ['Username is required.'];
        }

        if (!password.trim()) {
            nextFieldErrors.password = ['Password is required.'];
        } else if (!passwordIsStrong) {
            nextFieldErrors.password = [
                'Password does not meet the requirements.',
            ];
        }

        if (Object.keys(nextFieldErrors).length > 0) {
            setFieldErrors(nextFieldErrors);
            setFormError('Please fix the highlighted fields.');
            return;
        }

        try {
            const response = await registerUser({
                email: email.trim(),
                userName: userName.trim(),
                displayName: displayName.trim(),
                password,
            });

            if (!response) {
                return;
            }

            login(response.token, {
                userId: response.userId,
                email: response.email,
                userName: response.userName,
                displayName: response.displayName,
            });

            setEmail('');
            setDisplayName('');
            setUserName('');
            setPassword('');
            setFormError(null);
            setFieldErrors({});

            onClose();
        } catch (error) {
            if (error instanceof ApiError) {
                setFormError(error.message);
                setFieldErrors(error.fieldErrors);
                return;
            }

            setFormError('Something went wrong. Please try again.');
        }
    }

    return (
        <div className="register-modal">
            <div
                className="register-modal__backdrop"
                onClick={handleClose}
            ></div>

            <div className="register-modal__card">
                <button
                    className="register-modal__close"
                    type="button"
                    onClick={handleClose}
                    aria-label="Close register modal"
                >
                    ×
                </button>

                <div className="register-modal__header">
                    <h2 className="register-modal__title">Create an account</h2>

                    <p className="register-modal__subtitle">
                        Gain access to our technology based courses.
                    </p>
                </div>

                <form
                    className="register-modal__form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    {formError && (
                        <p className="auth-form-error">{formError}</p>
                    )}

                    <label className="register-modal__field">
                        <span>Email</span>
                        <input
                            className={emailError ? 'auth-input--error' : ''}
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="email"
                            value={email}
                            placeholder="you@example.com"
                            onChange={(event) => {
                                const nextEmail = event.target.value;

                                setEmail(nextEmail);

                                if (!nextEmail.trim()) {
                                    setFieldErrors((current) => ({
                                        ...current,
                                        email: ['Email is required.'],
                                    }));
                                    return;
                                }

                                if (!isValidEmail(nextEmail.trim())) {
                                    setFieldErrors((current) => ({
                                        ...current,
                                        email: ['Enter a valid email address.'],
                                    }));
                                    return;
                                }

                                clearFieldError('email');
                            }}
                        />

                        {emailError && (
                            <p className="auth-field-error">{emailError}</p>
                        )}
                    </label>

                    <label className="register-modal__field">
                        <span>Display name</span>
                        <input
                            className={
                                displayNameError ? 'auth-input--error' : ''
                            }
                            type="text"
                            id="displayName"
                            name="displayName"
                            autoComplete="name"
                            value={displayName}
                            placeholder="John Doe"
                            onChange={(event) => {
                                setDisplayName(event.target.value);
                                clearFieldError('displayName');
                            }}
                        />

                        {displayNameError && (
                            <p className="auth-field-error">
                                {displayNameError}
                            </p>
                        )}
                    </label>

                    <label className="register-modal__field">
                        <span>Username</span>
                        <input
                            className={userNameError ? 'auth-input--error' : ''}
                            type="text"
                            id="userName"
                            name="userName"
                            autoComplete="username"
                            value={userName}
                            placeholder="john_doe"
                            onChange={(event) => {
                                setUserName(event.target.value);
                                clearFieldError('userName');
                            }}
                        />

                        {userNameError && (
                            <p className="auth-field-error">{userNameError}</p>
                        )}
                    </label>

                    <label
                        className={`register-modal__field register-password-field ${
                            shouldShowPasswordChecklist
                                ? 'register-password-field--open'
                                : ''
                        }`}
                    >
                        <span>Password</span>

                        <input
                            className={passwordError ? 'auth-input--error' : ''}
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="new-password"
                            value={password}
                            placeholder="Create a password"
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                            onChange={(event) => {
                                setPassword(event.target.value);
                                clearFieldError('password');
                            }}
                        />

                        {shouldShowPasswordChecklist && (
                            <div className="password-popover">
                                <p className="password-popover__title">
                                    Password must have:
                                </p>

                                <ul className="password-checklist">
                                    {passwordRules.map((rule) => (
                                        <li
                                            className={
                                                rule.isValid
                                                    ? 'password-checklist__item password-checklist__item--valid'
                                                    : 'password-checklist__item'
                                            }
                                            key={rule.label}
                                        >
                                            <span className="password-checklist__icon">
                                                {rule.isValid ? '✓' : '○'}
                                            </span>

                                            {rule.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {passwordError && (
                            <p className="auth-field-error">{passwordError}</p>
                        )}
                    </label>

                    <button className="register-modal__submit" type="submit">
                        Create account
                    </button>
                </form>

                <p className="register-modal__footer">
                    Already have an account?{' '}
                    <button type="button" onClick={handleSwitchToLogin}>
                        Log in
                    </button>
                </p>
            </div>
        </div>
    );
}
