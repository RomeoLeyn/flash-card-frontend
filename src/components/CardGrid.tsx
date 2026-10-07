import { useEffect, useState } from "react";
import {
  Check,
  CheckSquare,
  Pencil,
  Sparkles,
  Square,
  Trash2,
} from "lucide-react";
import type { Card } from "@/types/flashcards";
import { relativeDate } from "@/lib/relativeDate";
import { ConfirmationModal } from "./ConfirmationModal";

type CardGridProps = {
  cards: Card[];
  onEdit: (card: Card) => void;
  onDelete: (id: string) => Promise<void> | void;
  onDeleteMany: (ids: string[]) => Promise<void>;
  bulkSelectionEnabled?: boolean;
};

export function CardGrid({
  cards,
  onEdit,
  onDelete,
  onDeleteMany,
  bulkSelectionEnabled = false,
}: CardGridProps) {
  const [flipped, setFlipped] = useState<string | null>(null);
  const [deletingCard, setDeletingCard] = useState<Card | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [deletingSelected, setDeletingSelected] = useState(false);
  const selectedCards = cards.filter((card) => selectedIds.has(card.id));
  const allCardsSelected =
    cards.length > 0 && selectedCards.length === cards.length;

  useEffect(() => {
    if (!bulkSelectionEnabled) {
      setSelectedIds(new Set());
    }
  }, [bulkSelectionEnabled]);

  const toggleCardSelection = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <>
      {bulkSelectionEnabled && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() =>
              setSelectedIds(
                allCardsSelected
                  ? new Set()
                  : new Set(cards.map((card) => card.id)),
              )
            }
            className="secondary-button"
          >
            {allCardsSelected ? (
              <CheckSquare size={16} />
            ) : (
              <Square size={16} />
            )}
            {allCardsSelected ? "Deselect all" : "Select all"}
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#718278]">
              {selectedCards.length} selected
            </span>
            {selectedCards.length > 0 && (
              <button
                type="button"
                onClick={() => setDeletingSelected(true)}
                className="primary-button bg-[#c7563a] hover:bg-[#b04b31]"
              >
                <Trash2 size={16} /> Delete selected
              </button>
            )}
          </div>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const isSelected = selectedIds.has(card.id);

          return (
            <div
              key={card.id}
              onClick={() => setFlipped(flipped === card.id ? null : card.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setFlipped(flipped === card.id ? null : card.id);
                }
              }}
              className={`card-flip cursor-pointer text-left ${isSelected ? "rounded-2xl ring-2 ring-[#55ad7d] ring-offset-2" : ""}`}
            >
              <div
                className={`card-inner ${flipped === card.id ? "is-flipped" : ""}`}
              >
                <div className="card-face panel p-6">
                  <div className="flex items-start justify-between">
                    <span className="language-tag">
                      {card.sourceLanguage} → {card.targetLanguage}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {bulkSelectionEnabled && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCardSelection(card.id);
                          }}
                          className={`icon-button ${isSelected ? "bg-[#e5f2e8] text-[#438960]" : ""}`}
                          aria-label={
                            isSelected ? "Deselect card" : "Select card"
                          }
                          aria-pressed={isSelected}
                          title={isSelected ? "Deselect card" : "Select card"}
                        >
                          {isSelected ? (
                            <CheckSquare size={15} />
                          ) : (
                            <Square size={15} />
                          )}
                        </button>
                      )}
                      {card.createdByAi && (
                        <Sparkles size={16} className="mr-1 text-[#58a77a]" />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(card);
                        }}
                        className="icon-button"
                        aria-label="Edit card"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingCard(card);
                        }}
                        className="icon-button hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Delete card"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-12">
                    <p className="text-2xl font-bold tracking-[-.04em]">
                      {card.word}
                    </p>
                    {card.transcription && (
                      <p className="mt-1 text-sm text-[#718278]">
                        {card.transcription}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-[#8d9991]">
                      Tap to reveal translation
                    </p>
                  </div>
                  <div className="mt-8 flex items-center justify-between border-t border-[#edf0ed] pt-4 text-xs text-[#91a098]">
                    <span>{card.repetitions} reviews</span>
                    <span className={card.isLeech ? "text-[#c7813c]" : ""}>
                      {card.isLeech
                        ? "Needs attention"
                        : relativeDate(card.nextReviewDate)}
                    </span>
                  </div>
                </div>
                <div className="card-face card-back rounded-2xl p-6">
                  <div className="flex items-start justify-between">
                    <span className="rounded-full bg-white/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.13em] text-[#508566]">
                      Translation
                    </span>
                    <Check size={17} className="text-[#4a9b6e]" />
                  </div>
                  <div className="mt-12">
                    <p className="text-2xl font-bold tracking-[-.04em]">
                      {card.translation}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[#65806e]">
                      {card.explanation}
                    </p>
                    {card.example && (
                      <p className="mt-3 text-sm italic leading-6 text-[#718278]">
                        {card.example}
                      </p>
                    )}
                  </div>
                  <div className="mt-8 border-t border-[#cce1d1] pt-4 text-xs text-[#698170]">
                    Click to turn back
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {deletingCard && (
        <ConfirmationModal
          open={!!deletingCard}
          onOpenChange={(open) => !open && setDeletingCard(null)}
          title="Delete card?"
          description={`Are you sure you want to delete "${deletingCard.word}"? This cannot be undone.`}
          confirmLabel="Delete card"
          variant="destructive"
          onConfirm={async () => {
            await onDelete(deletingCard.id);
          }}
          onSuccess={() => setDeletingCard(null)}
        />
      )}
      {deletingSelected && selectedCards.length > 0 && (
        <ConfirmationModal
          open={deletingSelected}
          onOpenChange={(open) => !open && setDeletingSelected(false)}
          title={`Delete ${selectedCards.length} cards?`}
          description="This will permanently delete all selected cards. This action cannot be undone."
          confirmLabel={`Delete ${selectedCards.length} cards`}
          variant="destructive"
          onConfirm={async () => {
            await onDeleteMany(selectedCards.map((card) => card.id));
          }}
          onSuccess={() => {
            setSelectedIds(new Set());
            setDeletingSelected(false);
          }}
        />
      )}
    </>
  );
}
