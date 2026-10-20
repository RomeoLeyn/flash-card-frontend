import { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  Check,
  ChevronDown,
  Pencil,
  Plus,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { Card, ReviewQuality } from "@/types/flashcards";

type CollectionStudyProps = {
  cards: Card[];
  categoryId: string;
  categoryName: string;
  onRate: (id: string, quality: ReviewQuality) => void;
  onAdd: () => void;
  onEditCard: (card: Card) => void;
  onExplainWord: (word: string, sentence: string) => void;
};

export function CollectionStudy({
  cards,
  categoryId,
  categoryName,
  onRate,
  onAdd,
  onEditCard,
  onExplainWord,
}: CollectionStudyProps) {
  const completionKey = `flash:completed-collection:${categoryId}`;
  const cardsSignature = JSON.stringify(cards.map((item) => item.id).sort());
  const [currentCardId, setCurrentCardId] = useState<string | null>(
    cards[0]?.id ?? null,
  );
  const cardPosition = cards.findIndex((item) => item.id === currentCardId);
  const index = Math.max(cardPosition, 0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(
    () => localStorage.getItem(completionKey) === cardsSignature,
  );
  const card = cards[index];
  const [explanationExpanded, setExplanationExpanded] = useState(false);
  const [wordHintVisible, setWordHintVisible] = useState(true);

  const explanationRef = useRef<HTMLParagraphElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const measureRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState(280);

  const pendingTimeout = useRef<number | null>(null);
  const initialCardsSignature = useRef(cardsSignature);

  const restartStudy = () => {
    if (pendingTimeout.current) {
      clearTimeout(pendingTimeout.current);
      pendingTimeout.current = null;
    }
    localStorage.removeItem(completionKey);
    setCurrentCardId(cards[0]?.id ?? null);
    setFlipped(false);
    setExplanationExpanded(false);
    setFinished(false);
  };

  useEffect(() => {
    if (initialCardsSignature.current === cardsSignature) return;

    initialCardsSignature.current = cardsSignature;
    localStorage.removeItem(completionKey);
    setCurrentCardId(cards[0]?.id ?? null);
    setFinished(false);
  }, [cards, cardsSignature, completionKey]);

  useEffect(() => {
    if (!currentCardId || !cards.some((item) => item.id === currentCardId)) {
      setCurrentCardId(cards[0]?.id ?? null);
    }
  }, [cards, currentCardId]);

  const choose = (quality: ReviewQuality) => {
    onRate(card.id, quality);
    setFlipped(false);
    setExplanationExpanded(false);
    const isLastCard = index + 1 >= cards.length;
    if (isLastCard) {
      localStorage.setItem(completionKey, cardsSignature);
    }

    const timeout = window.setTimeout(() => {
      if (!isLastCard) {
        setCurrentCardId(cards[index + 1].id);
      } else {
        setFinished(true);
      }
    }, 600);

    pendingTimeout.current = timeout;
  };

  useEffect(() => {
    return () => {
      if (pendingTimeout.current) {
        clearTimeout(pendingTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    const el = explanationRef.current;

    if (!el) return;

    setIsOverflowing(el.scrollHeight > el.clientHeight);
  }, [card, flipped, explanationExpanded]);

  useLayoutEffect(() => {
    if (!backRef.current) return;

    setCardHeight(Math.max(280, backRef.current.scrollHeight));
  }, [card, flipped, explanationExpanded]);

  useEffect(() => {
    if (!flipped) {
      setExplanationExpanded(false);
    }
  }, [flipped]);

  useLayoutEffect(() => {
    if (!measureRef.current) return;
    setCardHeight(Math.max(280, measureRef.current.scrollHeight));
  }, [card, explanationExpanded]);

  if (finished || !card) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <div className="review-empty">
          <Check size={28} />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-[-.05em]">
          Collection done.
        </h1>
        <p className="mt-3 text-[#7d8b82]">
          You went through every card in {categoryName}.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={restartStudy}
            className="secondary-button"
          >
            <RotateCcw size={16} /> Study again
          </button>
          <button onClick={onAdd} className="primary-button">
            <Plus size={17} /> Add card
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="eyebrow text-[#50a57a]">{categoryName}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-.055em] sm:text-4xl">
            Study mode<span className="text-[#55ad7d]">.</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={restartStudy} className="secondary-button">
            <RotateCcw size={16} /> Study again
          </button>
          <div className="text-right">
            <p className="text-2xl font-bold tracking-[-.06em]">
              {index + 1}
              <span className="text-[#a0aba3]"> / {cards.length}</span>
            </p>
            <p className="text-xs text-[#89968e]">cards in collection</p>
          </div>
        </div>
      </div>
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-[#e4ebe5]">
        <div
          className="h-full rounded-full bg-[#55ad7d] transition-all"
          style={{ width: `${((index + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/*
      Hidden "measurer" for the real height of the card's back side.
      Why it's needed: .card-face has height: 100% (so both sides of
      the 3D-flip card can stack on top of each other), which means
      measuring scrollHeight on an element INSIDE the card is useless —
      it's always capped by the parent's height (cardHeight), which is
      exactly the value we're trying to calculate. A circular dependency.

      The fix: render an exact copy of the back-side content separately,
      taken out of the document flow (position: absolute) and with no
      height constraint (height: auto, visibility: hidden — it still
      takes up layout space, but stays invisible and ignores clicks).
      This element's scrollHeight reflects the content's true height,
      and that's the value we feed into cardHeight for the real card.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none invisible absolute w-full max-w-[760px] rounded-2xl p-6 sm:p-8"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          visibility: "hidden",
          height: "auto",
        }}
        ref={measureRef}
      >
        <div className="flex items-start justify-between">
          <span className="rounded-full bg-white/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.13em] text-[#508566]">
            Translation
          </span>
          <Check size={17} className="text-[#4a9b6e]" />
        </div>
        <div className="mt-8 flex min-h-[140px] flex-col justify-center">
          <p className="text-center text-4xl font-bold tracking-[-.06em] sm:text-5xl">
            {card.translation}
          </p>
          {card.explanation && (
            <div className="mx-auto mt-4 max-w-md">
              <p
                className={`text-center text-sm leading-6 text-[#65806e] ${
                  explanationExpanded ? "" : "line-clamp-3"
                }`}
              >
                {card.explanation}
              </p>
              {(isOverflowing || explanationExpanded) && (
                <p className="mx-auto mt-1.5 flex items-center gap-1 text-xs font-semibold">
                  Show more
                </p>
              )}
            </div>
          )}
          {card.example && (
            <p className="mx-auto mt-3 max-w-md text-center text-sm italic leading-6 text-[#718278]">
              {card.example}
            </p>
          )}
        </div>
        <p className="mt-3 text-center text-xs">Click to turn back</p>
      </div>
      <div
        onClick={() => setFlipped((current) => !current)}
        className="w-full cursor-pointer transition-[height] duration-180 ease-out"
        style={{ height: cardHeight }}
      >
        <div
          className={`card-flip w-full text-left ${flipped ? "opacity-100" : ""}`}
        >
          <div
            className={`card-inner ${flipped ? "is-flipped" : ""}`}
            style={{ height: cardHeight }}
          >
            <div className="card-face panel min-h-[280px] p-6 sm:p-8">
              <div className="flex items-start justify-between">
                <span className="language-tag">
                  {card.sourceLanguage} → {card.targetLanguage}
                </span>
                <div className="flex items-center gap-1.5">
                  {card.createdByAi && (
                    <Sparkles size={16} className="text-[#58a77a]" />
                  )}
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onEditCard(card);
                    }}
                    className="icon-button"
                    aria-label="Edit card"
                    title="Edit card"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              </div>
              <div className="flex min-h-[180px] flex-col justify-center">
                <p className="text-center text-4xl font-bold tracking-[-.06em] sm:text-5xl">
                  {card.word}
                </p>
                {card.transcription && (
                  <p className="mt-2 text-center text-base text-[#718278]">
                    {card.transcription}
                  </p>
                )}
              </div>
            </div>
            <div className="card-face card-back rounded-2xl p-6 sm:p-8">
              <div ref={backRef}>
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-white/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.13em] text-[#508566]">
                    Translation
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Check size={17} className="text-[#4a9b6e]" />
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEditCard(card);
                      }}
                      className="icon-button"
                      aria-label="Edit card"
                      title="Edit card"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex min-h-[140px] flex-col justify-center">
                  <p className="text-center text-4xl font-bold tracking-[-.06em] sm:text-5xl">
                    {card.translation}
                  </p>

                  {card.explanation && (
                    <div className="mx-auto mt-4 max-w-md">
                      <p
                        ref={explanationRef}
                        className={`text-center text-sm leading-6 text-[#65806e] ${
                          explanationExpanded ? "" : "line-clamp-3"
                        }`}
                      >
                        {card.explanation}
                      </p>

                      {(isOverflowing || explanationExpanded) && (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setExplanationExpanded((current) => !current);
                          }}
                          className="mx-auto mt-1.5 flex items-center gap-1 text-xs font-semibold text-[#3a8b5c] hover:underline"
                        >
                          {explanationExpanded ? "Show less" : "Show more"}

                          <ChevronDown
                            size={13}
                            className={`transition-transform ${
                              explanationExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  )}
                  {card.example && (
                    <>
                      {wordHintVisible && (
                        <p className="mx-auto mt-3 max-w-md text-center text-xs text-[#89968e]">
                          Tap a word to learn more
                        </p>
                      )}
                      <p
                        onClick={(event) => event.stopPropagation()}
                        className="mx-auto mt-1 max-w-md text-center text-sm italic leading-6 text-[#718278]"
                      >
                        {card.example
                          .split(
                            /([\p{L}\p{M}]+(?:['’\-][\p{L}\p{M}]+)*)/gu,
                          )
                          .map((part, partIndex) =>
                            /^[\p{L}\p{M}]+(?:['’\-][\p{L}\p{M}]+)*$/u.test(
                              part,
                            ) ? (
                              <button
                                key={`${part}-${partIndex}`}
                                type="button"
                                aria-label={`Explain the word ${part}`}
                                title={`Explain “${part}”`}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setCurrentCardId(card.id);
                                  setWordHintVisible(false);
                                  onExplainWord(part, card.example!);
                                }}
                                className="example-word-button focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#34744e]"
                              >
                                {part}
                              </button>
                            ) : (
                              part
                            ),
                          )}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`mt-10 grid grid-cols-3 gap-3 transition-opacity duration-300 ${flipped ? "opacity-100" : "pointer-events-none opacity-40"}`}
      >
        <button
          disabled={!flipped}
          onClick={() => choose("bad")}
          className="quality-button quality-bad"
        >
          <span>Bad</span>
          <small>tomorrow</small>
        </button>
        <button
          disabled={!flipped}
          onClick={() => choose("good")}
          className="quality-button quality-good"
        >
          <span>Good</span>
          <small>in 3 days</small>
        </button>
        <button
          disabled={!flipped}
          onClick={() => choose("perfect")}
          className="quality-button quality-perfect"
        >
          <span>Perfect</span>
          <small>in 10 days</small>
        </button>
      </div>
      <p className="mt-5 text-center text-xs text-[#9aa59e]">
        Flip the card to reveal the answer, then rate your recall
      </p>
    </div>
  );
}
