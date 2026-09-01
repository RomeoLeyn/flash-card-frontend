import { useState } from "react";
import { Layers3, LayoutGrid, Pencil, Plus, Sparkles } from "lucide-react";
import type { Card, Category, ReviewQuality } from "@/types/flashcards";
import {
  CardSortBy,
  SortOrder,
  CARD_SORT_BY_OPTIONS,
} from "@/common/constants/constants";
import { CardGrid } from "./CardGrid";
import { CollectionStudy } from "./CollectionStudy";

type CardsViewProps = {
  cards: Card[];
  categories: Category[];
  activeCategory: string;
  onCategory: (id: string) => void;
  onAdd: () => void;
  onAddAi: () => void;
  onEditCategory: () => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (id: string) => Promise<void> | void;
  onRate: (id: string, quality: ReviewQuality) => void;
  browseMode: boolean;
  browseLoading: boolean;
  onBrowseAll: () => void;
  onStudyMode: () => void;
  browseSortBy?: CardSortBy;
  browseSortOrder?: SortOrder;
  onBrowseSort?: (sortBy: CardSortBy, sortOrder: SortOrder) => void;
};

export function CardsView({
  cards,
  categories,
  activeCategory,
  onAdd,
  onAddAi,
  onEditCategory,
  onEditCard,
  onDeleteCard,
  onRate,
  browseMode,
  browseLoading,
  onBrowseAll,
  onStudyMode,
  browseSortBy = CardSortBy.WORD,
  browseSortOrder = SortOrder.ASC,
  onBrowseSort,
}: CardsViewProps) {
  const isStudyMode = activeCategory !== "all";
  const activeCategoryName =
    categories.find((category) => category.id === activeCategory)?.name ??
    "Collection";

  const showGrid = !isStudyMode || browseMode;

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-[-.03em]">
            {activeCategoryName}
          </h2>
          {isStudyMode && (
            <button
              onClick={onEditCategory}
              className="icon-button"
              aria-label="Edit collection"
            >
              <Pencil size={15} />
            </button>
          )}
        </div>

        <div className="flex gap-3">
          {isStudyMode && cards.length > 0 && (
            <button
              onClick={browseMode ? onStudyMode : onBrowseAll}
              className="secondary-button self-start"
            >
              {browseMode ? (
                <>
                  <Layers3 size={16} /> Study mode
                </>
              ) : (
                <>
                  <LayoutGrid size={16} /> Browse all
                </>
              )}
            </button>
          )}
          <button onClick={onAdd} className="primary-button self-start">
            <Plus size={17} /> New card
          </button>
          <button
            onClick={onAddAi}
            className="primary-button self-start"
            style={{ background: "#5fa8d3" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#4a90b8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#5fa8d3")}
          >
            <Sparkles size={17} /> AI Generate
          </button>
        </div>
      </div>
      {cards.length === 0 ? (
        <div className="panel flex flex-col items-center justify-center p-16 text-center">
          <Layers3 size={35} className="text-[#a8b9ad]" />
          <h3 className="mt-4 text-lg font-bold">No cards here yet</h3>
          <p className="mt-2 text-sm text-[#829087]">
            Add your first card to start building this collection.
          </p>
        </div>
      ) : showGrid ? (
        <>
          {browseMode && onBrowseSort && (
            <div className="mb-4 flex gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#5a6764]">
                  Sort by
                </span>
                <select
                  value={browseSortBy}
                  onChange={(e) => {
                    const newSortBy = e.target.value as CardSortBy;
                    // When switching to date sorting, default to "Newest First"
                    const defaultOrder =
                      newSortBy === CardSortBy.WORD
                        ? SortOrder.ASC
                        : SortOrder.DESC;
                    onBrowseSort(newSortBy, defaultOrder);
                  }}
                  className="field-input"
                >
                  {CARD_SORT_BY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#5a6764]">
                  Order
                </span>
                <select
                  value={browseSortOrder}
                  onChange={(e) =>
                    onBrowseSort(browseSortBy, e.target.value as SortOrder)
                  }
                  className="field-input"
                >
                  {browseSortBy === CardSortBy.WORD ? (
                    <>
                      <option value={SortOrder.ASC}>A-Z</option>
                      <option value={SortOrder.DESC}>Z-A</option>
                    </>
                  ) : (
                    <>
                      <option value={SortOrder.DESC}>Newest First</option>
                      <option value={SortOrder.ASC}>Oldest First</option>
                    </>
                  )}
                </select>
              </label>
            </div>
          )}
          <CardGrid cards={cards} onEdit={onEditCard} onDelete={onDeleteCard} />
        </>
      ) : (
        <CollectionStudy
          cards={cards}
          categoryName={activeCategoryName}
          onRate={onRate}
          onAdd={onAdd}
        />
      )}
    </>
  );
}
