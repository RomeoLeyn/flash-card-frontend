import { useState } from "react";
import { Check, Pencil, RotateCcw } from "lucide-react";
import type { Card, ReviewQuality } from "@/types/flashcards";

type ReviewViewProps = {
  cards: Card[];
  onComplete: (id: string, quality: ReviewQuality) => Promise<void>;
  onEditCard: (card: Card) => void;
};

export function ReviewView({
  cards,
  onComplete,
  onEditCard,
}: ReviewViewProps) {
  const [sessionCards] = useState(cards);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const card = sessionCards[index];

  if (!card) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <div className="review-empty">
          <Check size={28} />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-[-.05em]">
          All caught up.
        </h1>
        <p className="mt-3 text-[#7d8b82]">
          You have no cards waiting for review right now.
        </p>
      </div>
    );
  }

  const choose = async (quality: ReviewQuality) => {
    if (submitting) return;

    setSubmitting(true);
    setReviewError(null);
    try {
      await onComplete(card.id, quality);
      setRevealed(false);
      setIndex((current) => current + 1);
    } catch (cause) {
      setReviewError(
        cause instanceof Error ? cause.message : "Failed to submit review",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="eyebrow text-[#d59042]">Focus mode</p>
          <h1 className="mt-2 text-4xl font-bold tracking-[-.055em]">
            Review session<span className="text-[#55ad7d]">.</span>
          </h1>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tracking-[-.06em]">
            {index + 1}
            <span className="text-[#a0aba3]"> / {sessionCards.length}</span>
          </p>
          <p className="text-xs text-[#89968e]">cards remaining</p>
        </div>
      </div>
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-[#e4ebe5]">
        <div
          className="h-full rounded-full bg-[#55ad7d] transition-all"
          style={{ width: `${((index + 1) / sessionCards.length) * 100}%` }}
        />
      </div>
      <div className={`review-card ${revealed ? "review-card-revealed" : ""}`}>
        <button
          type="button"
          onClick={() => onEditCard(card)}
          className="icon-button absolute right-4 top-4"
          aria-label="Edit card"
          title="Edit card"
        >
          <Pencil size={16} />
        </button>
        <div className="review-content">
          <span className="language-tag">
            {card.sourceLanguage} → {card.targetLanguage}
          </span>
          <p className="mt-12 text-center text-4xl font-bold tracking-[-.06em] sm:text-5xl">
            {revealed ? card.translation : card.word}
          </p>
          {!revealed && card.transcription && (
            <p className="mt-2 text-center text-base text-[#718278]">
              {card.transcription}
            </p>
          )}
          {revealed && (
            <>
              {card.explanation && (
                <p className="mx-auto mt-5 max-w-md text-center leading-7 text-[#6b8173]">
                  {card.explanation}
                </p>
              )}
              {card.example && (
                <p className="mx-auto mt-3 max-w-md text-center text-sm italic leading-6 text-[#718278]">
                  {card.example}
                </p>
              )}
            </>
          )}
          <button
            onClick={() => setRevealed(true)}
            className={`mx-auto mt-12 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${revealed ? "pointer-events-none opacity-0" : "bg-white text-[#508566] shadow-sm hover:bg-[#f4faf5]"}`}
          >
            <RotateCcw size={15} /> Reveal answer
          </button>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button
          disabled={!revealed || submitting}
          onClick={() => void choose("again")}
          className="quality-button quality-again"
        >
          <span>Again</span>
          <small>Didn't remember</small>
        </button>
        <button
          disabled={!revealed || submitting}
          onClick={() => void choose("hard")}
          className="quality-button quality-hard"
        >
          <span>Hard</span>
          <small>With difficulty</small>
        </button>
        <button
          disabled={!revealed || submitting}
          onClick={() => void choose("good")}
          className="quality-button quality-good"
        >
          <span>Good</span>
          <small>Remembered</small>
        </button>
        <button
          disabled={!revealed || submitting}
          onClick={() => void choose("easy")}
          className="quality-button quality-easy"
        >
          <span>Easy</span>
          <small>Remembered easily</small>
        </button>
      </div>
      {reviewError && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-[#e4b8b8] bg-[#fff3f3] p-3 text-center text-sm text-[#c7563a]"
        >
          {reviewError}
        </p>
      )}
      <p className="mt-5 text-center text-xs text-[#9aa59e]">
        Rate how well you remembered this card
      </p>
    </div>
  );
}
