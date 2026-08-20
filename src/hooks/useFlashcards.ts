import { useCallback, useEffect, useState } from "react";
import { cardService } from "@/services/cardService";
import { categoryService } from "@/services/categoryService";
import { reviewService } from "@/services/reviewService";
import type {
  Card,
  Category,
  CreateCardInput,
  ReviewQuality,
  ReviewStats,
  UpdateCardInput,
} from "@/types/flashcards";
import { LanguageCode } from "@/common/constants/constants";

function normalizeCard(card: any): Card {
  return {
    ...card,
    categoryId: card.category?.id ?? card.categoryId ?? "",
    nextReviewDate:
      typeof card.nextReviewDate === "string"
        ? card.nextReviewDate
        : card.nextReviewDate instanceof Date
          ? card.nextReviewDate.toISOString()
          : (card.nextReviewDate ?? null),
    lastReviewedAt:
      typeof card.lastReviewedAt === "string"
        ? card.lastReviewedAt
        : card.lastReviewedAt instanceof Date
          ? card.lastReviewedAt.toISOString()
          : (card.lastReviewedAt ?? null),
  };
}

function normalizeCards(cards: any[]): Card[] {
  return cards.map(normalizeCard);
}

export function useFlashcards(enabled = true) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [categoryDueCounts, setCategoryDueCounts] = useState<
    Record<string, number>
  >({});
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const [browsedCards, setBrowsedCards] = useState<Card[]>([]);
  const [browsedCategoryId, setBrowsedCategoryId] = useState<string | null>(
    null,
  );
  const [browseLoading, setBrowseLoading] = useState(false);

  const load = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const loadedCategories = await categoryService.list();
      const categoriesWithAll = [
        {
          id: "all",
          name: "All cards",
          sourceLanguage: "",
          targetLanguage: "",
          createdAt: "",
        },
        ...loadedCategories,
      ];
      setCategories(categoriesWithAll);

      const [allDueCards, ...categoryResponses] = await Promise.all([
        cardService.listDue(undefined, 1000),
        ...loadedCategories.map((category) =>
          cardService.listDue(category.id, 1000),
        ),
      ]);

      const normalizedAllCards = normalizeCards(allDueCards);
      const normalizedCategoryResponses = categoryResponses.map((response) =>
        normalizeCards(response),
      );
      const nextCounts = Object.fromEntries(
        loadedCategories.map((category, index) => [
          category.id,
          normalizedCategoryResponses[index].length,
        ]),
      );

      setCards(normalizedAllCards);
      setCategoryDueCounts({ all: normalizedAllCards.length, ...nextCounts });

      // fetch review stats (due/leech/total/reviewedToday)
      try {
        const stats = await reviewService.stats();
        // normalize backend shape to frontend ReviewStats type
        setReviewStats({
          dueCount: stats.dueCount ?? stats.due ?? 0,
          leechCount: stats.leechCount ?? 0,
          total: stats.totalCards ?? stats.total ?? 0,
          reviewedToday: stats.reviewedToday ?? 0,
        });
      } catch (e) {
        // ignore stats errors — non-critical
      }
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not load your cards.",
      );
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  const loadAllCardsByCategory = useCallback(async (categoryId: string) => {
    setBrowseLoading(true);
    setError(null);
    try {
      const categoryCards = await cardService.getCardsByCategoryId(categoryId);
      setBrowsedCards(normalizeCards(categoryCards));
      setBrowsedCategoryId(categoryId);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not load all cards.",
      );
    } finally {
      setBrowseLoading(false);
    }
  }, []);

  const loadCardsByCategory = useCallback(
    async (categoryId: string) => {
      if (!enabled) return;
      setLoading(true);
      setError(null);

      try {
        const categoryCards = await cardService.listDue(categoryId);
        setCards(normalizeCards(categoryCards));
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Could not load cards for this category.",
        );
      } finally {
        setLoading(false);
      }
    },
    [categories, enabled],
  );

  useEffect(() => {
    if (!enabled) return;
    void load();
  }, [load, enabled]);

  const createCategory = async (
    name: string,
    sourceLanguage: string,
    targetLanguage: string,
  ) => {
    const category = await categoryService.create(
      name,
      sourceLanguage,
      targetLanguage,
    );
    setCategories((current) => [...current, category]);
    return category;
  };

  const createCard = async (input: CreateCardInput) => {
    const card = await cardService.create(input);
    setCards((current) => [card, ...current]);
    return card;
  };

  const updateCard = async (id: string, input: UpdateCardInput) => {
    const updated = await cardService.update(id, input);
    const normalized = normalizeCard(updated);
    setCards((current) => current.map((c) => (c.id === id ? normalized : c)));
    return normalized;
  };

  const reviewCard = async (id: string, quality: ReviewQuality) => {
    const updated = await reviewService.submit(id, quality);
    setCards((current) =>
      current.map((card) => (card.id === id ? updated : card)),
    );
    setCategoryDueCounts((current) => {
      if (!updated.categoryId) return current;
      const next = { ...current };
      if (typeof next[updated.categoryId] === "number")
        next[updated.categoryId] = Math.max(0, next[updated.categoryId] - 1);
      if (typeof next.all === "number") next.all = Math.max(0, next.all - 1);
      return next;
    });
  };

  const generateCardsFromAi = async (prompt: string, categoryId: string) => {
    const resp = await cardService.generateFromAi(prompt, categoryId);
    const generatedCards = resp.createdCards ?? [];
    const normalizedGenerated = normalizeCards(generatedCards);
    setCards((current) => [...normalizedGenerated, ...current]);
    setCategoryDueCounts((current) => {
      const next = { ...current };
      if (typeof next[categoryId] === "number")
        next[categoryId] += normalizedGenerated.length;
      if (typeof next.all === "number") next.all += normalizedGenerated.length;
      return next;
    });

    return resp.skippedWords ?? [];
  };

  const getCardsByCategoryId = async (categoryId: string) => {
    const categoryCards = await cardService.getCardsByCategoryId(categoryId);
    return normalizeCards(categoryCards);
  };

  const updateCategory = async (
    id: string,
    data: {
      name: string;
      sourceLanguage: LanguageCode;
      targetLanguage: LanguageCode;
    },
  ) => {
    const updated = await categoryService.update(id, data);
    setCategories((current) =>
      current.map((category) => (category.id === id ? updated : category)),
    );
    return updated;
  };

  const deleteCard = async (id: string) => {
    await cardService.remove(id);
    setCards((current) => current.filter((c) => c.id !== id));
  };

  return {
    categories,
    cards,
    categoryDueCounts,
    reviewStats,
    loading,
    error,
    reload: load,
    loadCardsByCategory,
    createCategory,
    createCard,
    getCardsByCategoryId,
    updateCard,
    deleteCard,
    reviewCard,
    generateCardsFromAi,
    updateCategory,
    browsedCards,
    browsedCategoryId,
    browseLoading,
    loadAllCardsByCategory,
  };
}
