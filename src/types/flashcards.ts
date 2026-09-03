export type Card = {
  id: string;
  word: string;
  sourceLanguage: string;
  targetLanguage: string;
  translation: string;
  explanation: string;
  createdByAi: boolean;
  easeFactor: number;
  repetitions: number;
  interval: number;
  nextReviewDate: string | null;
  lastReviewedAt: string | null;
  isLeech: boolean;
  categoryId: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Category = {
  id: string;
  name: string;
  sourceLanguage: string;
  targetLanguage: string;
  createdAt: string;
  updatedAt?: string;
};
export type ReviewQuality = "bad" | "good" | "perfect";
export type AuthResponse = {
  accessToken: string;
  user?: { id: string; email: string };
};
export type User = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
};
export type ReviewStats = Record<string, number> & {
  total?: number;
  reviewedToday?: number;
  streak?: number;
};

export type CreateCardInput = Pick<
  Card,
  "word" | "sourceLanguage" | "targetLanguage" | "translation" | "categoryId"
> & { explanation?: string; createdByAi?: boolean };
export type UpdateCardInput = Partial<Omit<CreateCardInput, "categoryId">> &
  Pick<CreateCardInput, "categoryId">;
