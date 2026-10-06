export type Card = {
  id: string;
  word: string;
  sourceLanguage: string;
  targetLanguage: string;
  translation: string;
  transcription: string | null;
  explanation: string;
  example: string | null;
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
> & {
  transcription?: string;
  explanation?: string;
  example?: string;
  createdByAi?: boolean;
};
export type UpdateCardInput = Partial<Omit<CreateCardInput, "categoryId">> &
  Pick<CreateCardInput, "categoryId">;
export type AiGenerationRequest =
  | {
      mode: "generate";
      categoryId: string;
      count: number;
      prompt: string;
    }
  | {
      mode: "from_list";
      categoryId: string;
      words: string[];
      prompt?: string;
    };

export type AiGenerationResult = {
  requestedCount: number;
  generatedCount: number;
  retryAttempts: number;
  unfulfilledCount: number;
  created: number;
  createdCards: Card[];
  skippedWords: string[];
};
