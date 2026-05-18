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

    if (!response.ok) {
        const message = await response.text();

        throw new Error(message || `API error: ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    const text = await response.text();

    if (!text) {
        return null;
    }

    return JSON.parse(text) as T;
}
