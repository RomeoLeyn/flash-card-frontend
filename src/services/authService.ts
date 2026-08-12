import { http, json, tokenStorage } from '@/lib/httpClient';
import type { AuthResponse } from '@/types/flashcards';

export const authService = {
  register: async (email: string, password: string) => {
    const result = await http<AuthResponse>('/auth/signup', json({ email, password }));
    if (result.accessToken) tokenStorage.set(result.accessToken);
    return result;
  },
  login: async (email: string, password: string) => {
    const result = await http<AuthResponse>('/auth/signin', json({ email, password }));
    if (result.accessToken) tokenStorage.set(result.accessToken);
    return result;
  },
  me: async () => {
    const result = await http<{ id: string; email: string; createdAt: string }>('/auth/me');
    return result;
  },
  logout: () => tokenStorage.clear(),
  isAuthenticated: () => Boolean(tokenStorage.get()),
};
