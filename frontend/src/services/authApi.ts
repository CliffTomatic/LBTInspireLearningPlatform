import { apiFetch } from './api';

export type AuthResponse = {
    token: string;
    userId: string;
    email: string;
    userName: string;
    displayName: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    email: string;
    userName: string;
    displayName: string;
    password: string;
};

export function login(request: LoginRequest) {
    return apiFetch<AuthResponse>('api/Auth/login', {
        method: 'POST',
        body: JSON.stringify(request),
    });
}

export function register(request: RegisterRequest) {
    return apiFetch<AuthResponse>('api/Auth/register', {
        method: 'POST',
        body: JSON.stringify(request),
    });
}

export function getMe() {
    return apiFetch<AuthResponse>('api/Auth/me');
}
