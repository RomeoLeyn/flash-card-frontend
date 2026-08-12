import { http, json, patchJson } from '@/lib/httpClient';
import type { Category } from '@/types/flashcards';

export const categoryService = {
  list: () => http<Category[]>('/categories'),
  create: (name: string, sourceLanguage: string, targetLanguage: string) => http<Category>('/categories', json({ name, sourceLanguage, targetLanguage })),
  update: (id: string, name: string) => http<Category>(`/categories/${id}`, patchJson({ name })),
  remove: (id: string) => http<void>(`/categories/${id}`, { method: 'DELETE' }),
};
