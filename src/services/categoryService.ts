import { LanguageCode } from '@/common/constants/constants';
import { http, json, patchJson } from '@/lib/httpClient';
import type { Category } from '@/types/flashcards';

export const categoryService = {
  list: () => http<Category[]>('/categories'),
  create: (name: string, sourceLanguage: string, targetLanguage: string) => http<Category>('/categories', json({ name, sourceLanguage, targetLanguage })),
  update: (
    id: string,
    data: { name: string; sourceLanguage: LanguageCode; targetLanguage: LanguageCode },
  ) => http<Category>(`/categories/${id}`, patchJson(data)),
  remove: (id: string) => http<void>(`/categories/${id}`, { method: 'DELETE' }),
};
