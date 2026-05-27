import { ApiError, type ApiErrorResponse } from '../types/Api/Auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');

export async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
): Promise<T | null> {
    // Prevent double // in path. Ex: localhost:0000//api
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token
                ? {
                      Authorization: `Bearer ${token}`,
                  }
                : {}),
            ...options.headers,
        },
    });

    if (response.status === 204) {
        return null;
    }

    if (!response.ok) {
        try {
            const errorBody = (await response.json()) as ApiErrorResponse;

            throw new ApiError(errorBody);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            throw new Error(`API error: ${response.status}`, {
                cause: error,
            });
        }
    }

    const text = await response.text();

    if (!text) {
        return null;
    }

    return JSON.parse(text) as T;
}
