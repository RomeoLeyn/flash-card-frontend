import { http, json } from '@/lib/httpClient';
import type { Card, ReviewQuality, ReviewStats } from '@/types/flashcards';

export const reviewService = {
  due: () => http<Card[]>(`/cards/due`),
  submit: (cardId: string, quality: ReviewQuality) => http<Card>(`/cards/${cardId}/review`, json({ quality })),
  stats: () => http<ReviewStats>('/cards/stats'),
};
