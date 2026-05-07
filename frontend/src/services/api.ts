const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(path: string, options?: RequestInit) {
    const response = await fetch(`${API_BASE_URL}${path}`, options);

    if (!response.ok) {
        throw new Error('API request failed');
    }

    return response.json();
}
