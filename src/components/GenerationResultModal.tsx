import { Check, Copy, Sparkles } from "lucide-react";
import type { Card } from "@/types/flashcards";
import { Modal } from "./Modal";

type GenerationResultModalProps = {
  createdCards: Card[];
  skippedWords: string[];
  onClose: () => void;
};

export function GenerationResultModal({
  createdCards,
  skippedWords,
  onClose,
}: GenerationResultModalProps) {
  return (
    <Modal
      title="Generation complete"
      subtitle="Review the cards added to your collection."
      onClose={onClose}
      className="max-h-[calc(100dvh-1rem)] overflow-y-auto sm:max-h-[calc(100dvh-2.5rem)]"
    >
      <div className="space-y-4 sm:space-y-5">
        <section className="rounded-2xl border border-[#b8d8c4] bg-[#f3fff5] p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3 text-sm font-bold text-[#3a8b5c]">
            <span className="flex items-center gap-2">
              <Check size={17} /> New cards
            </span>
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs">
              {createdCards.length}
            </span>
          </div>
          {createdCards.length > 0 ? (
            <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1 sm:max-h-72">
              {createdCards.map((card, index) => (
                <div
                  key={card.id}
                  className="grid grid-cols-[auto_1fr] gap-3 rounded-xl border border-[#dceee0] bg-white px-3 py-2.5 text-sm shadow-sm"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e4f4e8] text-xs font-bold text-[#3a8b5c]">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="break-words font-bold text-[#26352d]">
                      {card.word}
                    </p>
                    <p className="mt-0.5 break-words text-[#718278]">
                      {card.translation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-[#718278]">
              No new cards were added.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-[#e6d1ad] bg-[#fffaf0] p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3 text-sm font-bold text-[#a46b25]">
            <span className="flex items-center gap-2">
              <Copy size={17} /> Duplicates
            </span>
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs">
              {skippedWords.length}
            </span>
          </div>
          {skippedWords.length > 0 ? (
            <div className="mt-3 flex max-h-32 flex-wrap gap-2 overflow-y-auto pr-1 sm:max-h-40">
              {skippedWords.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className="max-w-full break-words rounded-lg border border-[#f0dfbd] bg-white px-3 py-1.5 text-sm font-medium text-[#765a36]"
                >
                  {word}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-[#8c785d]">No duplicates found.</p>
          )}
        </section>

        <button onClick={onClose} className="primary-button ml-auto">
          <Sparkles size={16} /> Done
        </button>
      </div>
    </Modal>
  );
}
