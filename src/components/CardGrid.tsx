import { useEffect, useState } from "react";
import { Check, Pencil, Sparkles, Trash2 } from "lucide-react";
import type { Card } from "@/types/flashcards";
import { relativeDate } from "@/lib/relativeDate";
import { ConfirmationModal } from "./ConfirmationModal";

type CardGridProps = {
  cards: Card[];
  onEdit: (card: Card) => void;
  onDelete: (id: string) => Promise<void> | void;
};

export function CardGrid({ cards, onEdit, onDelete }: CardGridProps) {
  const [flipped, setFlipped] = useState<string | null>(null);
  const [deletingCard, setDeletingCard] = useState<Card | null>(null);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
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
          className="card-flip cursor-pointer text-left"
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
              </div>
              <div className="mt-8 border-t border-[#cce1d1] pt-4 text-xs text-[#698170]">
                Click to turn back
              </div>
            </div>
          </div>
        </div>
      ))}

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
    </div>
  );
}
