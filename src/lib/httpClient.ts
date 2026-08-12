const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const TOKEN_KEY = 'lexicon_access_token';

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

function unwrap<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in payload) return (payload as { data: T }).data;
  return payload as T;
}

export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const contentType = response.headers.get('content-type') ?? '';
  const payload: unknown = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    const message = typeof payload === 'object' && payload !== null && 'message' in payload ? String((payload as { message: unknown }).message) : 'Request failed';
    throw new ApiError(response.status, message, payload);
  }
  return unwrap<T>(payload);
}

export const json = (body: unknown): RequestInit => ({ method: 'POST', body: JSON.stringify(body) });
export const patchJson = (body: unknown): RequestInit => ({ method: 'PATCH', body: JSON.stringify(body) });
