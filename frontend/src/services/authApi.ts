import { apiFetch } from './api';

export type AuthResponse = {
    token: string;
    userId: string;
    email: string;
    userName: string;
    displayName: string;
};

export type CurrentUser = {
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

export function loginUser(data: LoginRequest) {
    return apiFetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function registerUser(data: RegisterRequest) {
    return apiFetch<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function getCurrentUser() {
    return apiFetch<CurrentUser>('/api/auth/me');
}
