import { useState } from "react";
import { Layers3, LayoutGrid, Pencil, Plus, Sparkles } from "lucide-react";
import type { Card, Category, ReviewQuality } from "@/types/flashcards";
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
        <CardGrid cards={cards} onEdit={onEditCard} onDelete={onDeleteCard} />
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
