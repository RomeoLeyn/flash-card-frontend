import { http, json, patchJson } from "@/lib/httpClient";
import type {
  Card,
  CreateCardInput,
  UpdateCardInput,
} from "@/types/flashcards";

export const cardService = {
  create: (input: CreateCardInput) => http<Card>("/cards", json(input)),
  listDue: (categoryId?: string, limit = 20) => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (categoryId && categoryId !== "all")
      params.set("categoryId", categoryId);

    const query = params.toString();
    return http<Card[]>(`/cards/due${query ? `?${query}` : ""}`);
  },
  getById: (id: string) => http<Card>(`/cards/card/${id}`),
  getCardsByCategoryId: (categoryId: string) =>
    http<Card[]>(`/cards/category/${categoryId}`),
  update: (id: string, input: UpdateCardInput) =>
    http<Card>(`/cards/update/${id}`, patchJson(input)),
  remove: (id: string) => http<void>(`/cards/${id}`, { method: "DELETE" }),
  generateFromAi: (prompt: string, categoryId: string) =>
    http<{ created: number; createdCards: Card[]; skippedWords: string[] }>(
      "/ai/generate",
      json({ prompt, categoryId }),
    ),
};
