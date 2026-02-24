// API client — replaces the Supabase client
// All requests go to the Express backend

// In production (Vercel), VITE_API_URL is not set, so we default to '' (relative
// paths like /api/...) which routes to the serverless function on the same domain.
// In local dev, we default to http://localhost:4000
const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:4000' : '');

const getToken = () => localStorage.getItem('auth_token');

type RequestOptions = {
    method?: string;
    body?: Record<string, unknown> | FormData;
    auth?: boolean;
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, auth = true } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (auth) {
        const token = getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || `Request failed: ${response.status}`);
    }

    return data as T;
}

export const api = {
    get: <T>(endpoint: string) => request<T>(endpoint),
    post: <T>(endpoint: string, body: Record<string, unknown>) =>
        request<T>(endpoint, { method: 'POST', body }),
    put: <T>(endpoint: string, body: Record<string, unknown>) =>
        request<T>(endpoint, { method: 'PUT', body }),
    delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
    /** Public (no auth header) */
    publicPost: <T>(endpoint: string, body: Record<string, unknown>) =>
        request<T>(endpoint, { method: 'POST', body, auth: false }),
};

export { getToken };
export const setToken = (token: string) => localStorage.setItem('auth_token', token);
export const removeToken = () => localStorage.removeItem('auth_token');
