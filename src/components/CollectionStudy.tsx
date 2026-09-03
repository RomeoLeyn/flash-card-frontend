import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Check, ChevronDown, Plus, RotateCcw, Sparkles } from "lucide-react";
import type { Card, ReviewQuality } from "@/types/flashcards";

type CollectionStudyProps = {
  cards: Card[];
  categoryName: string;
  onRate: (id: string, quality: ReviewQuality) => void;
  onAdd: () => void;
};

export function CollectionStudy({
  cards,
  categoryName,
  onRate,
  onAdd,
}: CollectionStudyProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);
  const card = cards[index];
  const [explanationExpanded, setExplanationExpanded] = useState(false);

  const explanationRef = useRef<HTMLParagraphElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const measureRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState(280);

  const pendingTimeout = useRef<number | null>(null);

  const choose = (quality: ReviewQuality) => {
    onRate(card.id, quality);
    setFlipped(false);
    setExplanationExpanded(false);
    const timeout = window.setTimeout(() => {
      if (index + 1 < cards.length) {
        setIndex((current) => current + 1);
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
            onClick={() => {
              setIndex(0);
              setFlipped(false);
              setFinished(false);
            }}
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
        <div className="text-right">
          <p className="text-2xl font-bold tracking-[-.06em]">
            {index + 1}
            <span className="text-[#a0aba3]"> / {cards.length}</span>
          </p>
          <p className="text-xs text-[#89968e]">cards in collection</p>
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
                {card.createdByAi && (
                  <Sparkles size={16} className="text-[#58a77a]" />
                )}
              </div>
              <div className="mt-12 flex min-h-[180px] flex-col justify-center">
                <p className="text-center text-4xl font-bold tracking-[-.06em] sm:text-5xl">
                  {card.word}
                </p>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setFlipped(true);
                  }}
                  className="mx-auto mt-8 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#508566] shadow-sm transition hover:bg-[#f4faf5]"
                >
                  <RotateCcw size={15} /> Reveal answer
                </button>
              </div>
            </div>
            <div className="card-face card-back rounded-2xl p-6 sm:p-8">
              <div ref={backRef}>
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
