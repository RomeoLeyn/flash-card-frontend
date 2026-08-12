import { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import type { Card, ReviewQuality } from '@/types/flashcards';

type ReviewViewProps = {
  cards: Card[];
  onComplete: (id: string, quality: ReviewQuality) => void;
};

export function ReviewView({ cards, onComplete }: ReviewViewProps) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const card = cards[index];

  if (!card) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <div className="review-empty"><Check size={28} /></div>
        <h1 className="mt-6 text-3xl font-bold tracking-[-.05em]">All caught up.</h1>
        <p className="mt-3 text-[#7d8b82]">You have no cards waiting for review right now.</p>
      </div>
    );
  }

  const choose = (quality: ReviewQuality) => {
    onComplete(card.id, quality);
    setRevealed(false);
    setIndex((current) => current + 1);
  };

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="eyebrow text-[#d59042]">Focus mode</p>
          <h1 className="mt-2 text-4xl font-bold tracking-[-.055em]">Review session<span className="text-[#55ad7d]">.</span></h1>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tracking-[-.06em]">{index + 1}<span className="text-[#a0aba3]"> / {cards.length}</span></p>
          <p className="text-xs text-[#89968e]">cards remaining</p>
        </div>
      </div>
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-[#e4ebe5]">
        <div className="h-full rounded-full bg-[#55ad7d] transition-all" style={{ width: `${((index + 1) / cards.length) * 100}%` }} />
      </div>
      <div className={`review-card ${revealed ? 'review-card-revealed' : ''}`}>
        <div className="review-content">
          <span className="language-tag">{card.sourceLanguage} → {card.targetLanguage}</span>
          <p className="mt-12 text-center text-4xl font-bold tracking-[-.06em] sm:text-5xl">{revealed ? card.translation : card.word}</p>
          {revealed && <p className="mx-auto mt-5 max-w-md text-center leading-7 text-[#6b8173]">{card.explanation}</p>}
          <button onClick={() => setRevealed(true)} className={`mx-auto mt-12 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${revealed ? 'pointer-events-none opacity-0' : 'bg-white text-[#508566] shadow-sm hover:bg-[#f4faf5]'}`}><RotateCcw size={15} /> Reveal answer</button>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <button disabled={!revealed} onClick={() => choose('bad')} className="quality-button quality-bad"><span>Hard</span><small>tomorrow</small></button>
        <button disabled={!revealed} onClick={() => choose('good')} className="quality-button quality-good"><span>Good</span><small>in 3 days</small></button>
        <button disabled={!revealed} onClick={() => choose('perfect')} className="quality-button quality-perfect"><span>Perfect</span><small>in 10 days</small></button>
      </div>
      <p className="mt-5 text-center text-xs text-[#9aa59e]">Rate how well you remembered this card</p>
    </div>
  );
}
