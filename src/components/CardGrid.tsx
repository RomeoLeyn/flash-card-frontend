import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import type { Card } from '@/types/flashcards';
import { relativeDate } from '@/lib/relativeDate';

export function CardGrid({ cards }: { cards: Card[] }) {
  const [flipped, setFlipped] = useState<string | null>(null);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <button key={card.id} onClick={() => setFlipped(flipped === card.id ? null : card.id)} className="card-flip text-left">
          <div className={`card-inner ${flipped === card.id ? 'is-flipped' : ''}`}>
            <div className="card-face panel p-6">
              <div className="flex items-start justify-between">
                <span className="language-tag">{card.sourceLanguage} → {card.targetLanguage}</span>
                {card.createdByAi && <Sparkles size={16} className="text-[#58a77a]" />}
              </div>
              <div className="mt-12">
                <p className="text-2xl font-bold tracking-[-.04em]">{card.word}</p>
                <p className="mt-2 text-sm text-[#8d9991]">Tap to reveal translation</p>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-[#edf0ed] pt-4 text-xs text-[#91a098]">
                <span>{card.repetitions} reviews</span>
                <span className={card.isLeech ? 'text-[#c7813c]' : ''}>{card.isLeech ? 'Needs attention' : relativeDate(card.nextReviewDate)}</span>
              </div>
            </div>
            <div className="card-face card-back rounded-2xl p-6">
              <div className="flex items-start justify-between">
                <span className="rounded-full bg-white/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.13em] text-[#508566]">Translation</span>
                <Check size={17} className="text-[#4a9b6e]" />
              </div>
              <div className="mt-12">
                <p className="text-2xl font-bold tracking-[-.04em]">{card.translation}</p>
                <p className="mt-3 text-sm leading-6 text-[#65806e]">{card.explanation}</p>
              </div>
              <div className="mt-8 border-t border-[#cce1d1] pt-4 text-xs text-[#698170]">Click to turn back</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
