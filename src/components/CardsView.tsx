import { useState } from "react";
import {
  Layers3,
  LayoutGrid,
  Pencil,
  Plus,
  Sparkles,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
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
          {isStudyMode && (
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
            <div className="mb-4 flex gap-4 items-center justify-start flex-wrap">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#5a6764]">
                  Sort by
                </span>
                <select
                  value={browseSortBy}
                  onChange={(e) => {
                    const newSortBy = e.target.value as CardSortBy;
                    const defaultOrder =
                      newSortBy === CardSortBy.WORD
                        ? SortOrder.ASC
                        : SortOrder.DESC;
                    onBrowseSort(newSortBy, defaultOrder);
                  }}
                  className="field-input !mt-0"
                >
                  {CARD_SORT_BY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#5a6764]">
                  Order
                </span>
                <button
                  onClick={() => {
                    const newOrder =
                      browseSortOrder === SortOrder.DESC
                        ? SortOrder.ASC
                        : SortOrder.DESC;
                    onBrowseSort(browseSortBy, newOrder);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-[#d0d5d1] bg-white px-3 py-2 max-h-[48px] text-sm font-medium text-[#5a6764] transition hover:bg-[#f5f5f5] active:bg-[#e8e8e8]"
                  title={
                    browseSortBy === CardSortBy.WORD
                      ? browseSortOrder === SortOrder.ASC
                        ? "A-Z"
                        : "Z-A"
                      : browseSortOrder === SortOrder.DESC
                        ? "Newest First"
                        : "Oldest First"
                  }
                >
                  {browseSortOrder === SortOrder.DESC ? (
                    <>
                      <ArrowDown size={16} />
                      {browseSortBy === CardSortBy.WORD ? "Z-A" : "Newest"}
                    </>
                  ) : (
                    <>
                      <ArrowUp size={16} />
                      {browseSortBy === CardSortBy.WORD ? "A-Z" : "Oldest"}
                    </>
                  )}
                </button>
              </div>
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
