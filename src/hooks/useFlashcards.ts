import { useCallback, useEffect, useState } from "react";
import { cardService } from "@/services/cardService";
import { categoryService } from "@/services/categoryService";
import { reviewService } from "@/services/reviewService";
import type {
  Card,
  Category,
  CreateCardInput,
  AiGenerationResult,
  ReviewQuality,
  ReviewStats,
  UpdateCardInput,
} from "@/types/flashcards";
import {
  LanguageCode,
  CardSortBy,
  SortOrder,
} from "@/common/constants/constants";

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

function isDue(card: Card): boolean {
  return Boolean(
    card.nextReviewDate &&
    new Date(card.nextReviewDate).getTime() <= Date.now(),
  );
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
  const [browseSortBy, setBrowseSortBy] = useState<CardSortBy>(CardSortBy.WORD);
  const [browseSortOrder, setBrowseSortOrder] = useState<SortOrder>(
    SortOrder.ASC,
  );

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

  const loadAllCardsByCategory = useCallback(
    async (categoryId: string) => {
      setBrowseLoading(true);
      setError(null);
      try {
        const categoryCards = await cardService.getCardsByCategoryId(
          categoryId,
          browseSortBy,
          browseSortOrder,
        );
        setBrowsedCards(normalizeCards(categoryCards));
        setBrowsedCategoryId(categoryId);
      } catch (cause) {
        setError(
          cause instanceof Error ? cause.message : "Could not load all cards.",
        );
      } finally {
        setBrowseLoading(false);
      }
    },
    [browseSortBy, browseSortOrder],
  );

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
    const card = normalizeCard(await cardService.create(input));
    if (!card.categoryId) {
      card.categoryId = input.categoryId;
    }
    await load();
    if (browsedCategoryId === card.categoryId) {
      await loadAllCardsByCategory(card.categoryId);
    }
    return card;
  };

  const updateCard = async (id: string, input: UpdateCardInput) => {
    const currentCard =
      cards.find((card) => card.id === id) ??
      browsedCards.find((card) => card.id === id);
    const updated = await cardService.update(id, {
      ...input,
      categoryId: input.categoryId ?? currentCard?.categoryId ?? "",
    });
    const normalized = normalizeCard(updated);
    if (!normalized.categoryId) {
      normalized.categoryId = input.categoryId ?? currentCard?.categoryId ?? "";
    }
    setCards((current) => current.map((c) => (c.id === id ? normalized : c)));
    setBrowsedCards((current) =>
      current.map((card) => (card.id === id ? normalized : card)),
    );
    if (currentCard) {
      const wasDue = isDue(currentCard);
      const isNowDue = isDue(normalized);
      if (
        wasDue !== isNowDue ||
        currentCard.categoryId !== normalized.categoryId
      ) {
        setCategoryDueCounts((current) => {
          const next = { ...current };
          if (wasDue) {
            next.all = Math.max(0, (next.all ?? 0) - 1);
            next[currentCard.categoryId] = Math.max(
              0,
              (next[currentCard.categoryId] ?? 0) - 1,
            );
          }
          if (isNowDue) {
            next.all = (next.all ?? 0) + 1;
            next[normalized.categoryId] =
              (next[normalized.categoryId] ?? 0) + 1;
          }
          return next;
        });
      }
    }
    return normalized;
  };

  const reviewCard = async (id: string, quality: ReviewQuality) => {
    const currentCard = cards.find((card) => card.id === id);
    const updated = normalizeCard(await reviewService.submit(id, quality));
    if (!updated.categoryId && currentCard) {
      updated.categoryId = currentCard.categoryId;
    }
    setCards((current) =>
      current.map((card) => (card.id === id ? updated : card)),
    );
    setBrowsedCards((current) =>
      current.map((card) => (card.id === id ? updated : card)),
    );
    if (currentCard && isDue(currentCard) && !isDue(updated)) {
      setCategoryDueCounts((current) => {
        if (!currentCard.categoryId) return current;
        const next = { ...current };
        next[currentCard.categoryId] = Math.max(
          0,
          (next[currentCard.categoryId] ?? 0) - 1,
        );
        next.all = Math.max(0, (next.all ?? 0) - 1);
        return next;
      });
    }
    if (currentCard && isDue(currentCard) && !isDue(updated)) {
      setReviewStats((current) =>
        current
          ? {
              ...current,
              dueCount: Math.max(0, (current.dueCount ?? 0) - 1),
              reviewedToday: (current.reviewedToday ?? 0) + 1,
            }
          : current,
      );
    }
  };

  const generateCardsFromAi = async (
    prompt: string,
    categoryId: string,
  ): Promise<AiGenerationResult> => {
    const resp = await cardService.generateFromAi(prompt, categoryId);
    const generatedCards = resp.createdCards ?? [];
    const normalizedGenerated = normalizeCards(generatedCards);
    setCards((current) => [...normalizedGenerated, ...current]);
    setBrowsedCards((current) =>
      current.length > 0 && current[0]?.categoryId === categoryId
        ? [...normalizedGenerated, ...current]
        : current,
    );
    setReviewStats((current) =>
      current
        ? {
            ...current,
            total: (current.total ?? 0) + normalizedGenerated.length,
            dueCount:
              (current.dueCount ?? 0) +
              normalizedGenerated.filter(isDue).length,
          }
        : current,
    );
    setCategoryDueCounts((current) => {
      const next = { ...current };
      if (typeof next[categoryId] === "number")
        next[categoryId] += normalizedGenerated.length;
      if (typeof next.all === "number") next.all += normalizedGenerated.length;
      return next;
    });

    return {
      createdCards: normalizedGenerated,
      skippedWords: resp.skippedWords ?? [],
    };
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

  const deleteCategory = async (id: string) => {
    await categoryService.remove(id);
    setCategories((current) => current.filter((c) => c.id !== id));
    setCards((current) => current.filter((c) => c.categoryId !== id));
    setCategoryDueCounts((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const deleteCard = async (id: string) => {
    const deletedCard =
      cards.find((card) => card.id === id) ??
      browsedCards.find((card) => card.id === id);
    await cardService.remove(id);
    setCards((current) => current.filter((c) => c.id !== id));
    setBrowsedCards((current) => current.filter((card) => card.id !== id));
    if (deletedCard) {
      setReviewStats((current) =>
        current
          ? {
              ...current,
              total: Math.max(0, (current.total ?? 0) - 1),
              dueCount: Math.max(
                0,
                (current.dueCount ?? 0) - (isDue(deletedCard) ? 1 : 0),
              ),
            }
          : current,
      );
      if (isDue(deletedCard)) {
        setCategoryDueCounts((current) => ({
          ...current,
          all: Math.max(0, (current.all ?? 0) - 1),
          [deletedCard.categoryId]: Math.max(
            0,
            (current[deletedCard.categoryId] ?? 0) - 1,
          ),
        }));
      }
    }
  };

  const setBrowseSort = useCallback(
    (sortBy: CardSortBy, sortOrder: SortOrder) => {
      setBrowseSortBy(sortBy);
      setBrowseSortOrder(sortOrder);
    },
    [],
  );

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
    deleteCategory,
    browsedCards,
    browsedCategoryId,
    browseLoading,
    loadAllCardsByCategory,
    browseSortBy,
    browseSortOrder,
    setBrowseSort,
  };
}
