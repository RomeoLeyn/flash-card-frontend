import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Folder,
  Plus,
} from "lucide-react";
import type { Category } from "@/types/flashcards";

type DashboardHomeProps = {
  userName: string;
  categories: Category[];
  categoryDueCounts: Record<string, number>;
  dueCount: number;
  onReview: () => void;
  onViewCollections: () => void;
  onSelectCategory: (id: string) => void;
  onAddCollection: () => void;
};

export function DashboardPage({
  userName,
  categories,
  categoryDueCounts,
  dueCount,
  onReview,
  onViewCollections,
  onSelectCategory,
  onAddCollection,
}: DashboardHomeProps) {
  const collections = categories.filter((category) => category.id !== "all");

  return (
    <div className="space-y-9">
      <section className="relative overflow-hidden rounded-[28px] border border-[#deeadf] bg-[radial-gradient(circle_at_90%_10%,#dff1e3,transparent_38%),linear-gradient(120deg,#f8fcf8,#edf7ee)] px-6 py-8 sm:px-9 sm:py-10">
        <div className="relative z-10 max-w-2xl">
          <p className="eyebrow text-[#71947b]">Your learning space</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-.055em] sm:text-4xl">
            {userName ? `Welcome back, ${userName}.` : "Welcome back."}
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-[#718078] sm:text-base">
            {dueCount > 0
              ? "A short review today helps turn the words you’re learning into words you know."
              : "You’re all caught up. Add a few new words or explore your collections."}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={dueCount > 0 ? onReview : onViewCollections}
              className="primary-button min-h-11 px-5"
            >
              {dueCount > 0 ? "Start today’s review" : "View your collections"}
              <ArrowRight size={15} />
            </button>
            {dueCount > 0 && (
              <span className="inline-flex items-center gap-2 rounded-xl border border-[#dce9de] bg-white/80 px-3.5 py-2.5 text-sm font-semibold text-[#64806d]">
                <Clock3 size={15} className="text-[#d18b3e]" />
                {dueCount} {dueCount === 1 ? "card" : "cards"} to review
              </span>
            )}
          </div>
        </div>
        <div className="absolute -bottom-10 -right-8 hidden h-48 w-48 items-center justify-center rounded-full border border-white/70 bg-white/30 text-[#72a983]/40 sm:flex">
          <BookOpen size={90} strokeWidth={1} />
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Make it yours</p>
            <h2 className="mt-2 text-xl font-bold tracking-[-.04em]">
              Quick actions
            </h2>
          </div>
        </div>
        <div>
          <button
            type="button"
            onClick={onAddCollection}
            className="group flex w-full max-w-xl items-center gap-4 rounded-[18px] border border-[#e1e9e2] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#b9d6c1] hover:shadow-md hover:shadow-[#1c392508]"
          >
            <span className="stat-icon stat-green">
              <Folder />
            </span>
            <span>
              <span className="block text-sm font-bold">
                Create a collection
              </span>
              <span className="mt-1 block text-xs text-[#87938b]">
                Organize words by topic or language
              </span>
            </span>
            <ArrowRight
              size={16}
              className="ml-auto text-[#a7b1aa] transition group-hover:translate-x-1 group-hover:text-[#4e9e70]"
            />
          </button>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Your study library</p>
            <h2 className="mt-2 text-xl font-bold tracking-[-.04em]">
              Your collections
            </h2>
          </div>
          <button
            type="button"
            onClick={onViewCollections}
            className="text-xs font-semibold text-[#548a66] transition hover:text-[#3e7451]"
          >
            Browse all collections
          </button>
        </div>

        {collections.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-[#d8e4da] bg-white/60 px-5 py-8 text-center">
            <span className="review-empty">
              <Folder size={24} />
            </span>
            <h3 className="mt-4 text-base font-bold">Start your first collection</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#7b8880]">
              Organize words by topic or language to make your study sessions
              easier to follow.
            </p>
            <button
              type="button"
              onClick={onAddCollection}
              className="secondary-button mt-5"
            >
              <Plus size={15} />
              Create a collection
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {collections.map((category) => {
              const count = categoryDueCounts[category.id] ?? 0;
              return (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => onSelectCategory(category.id)}
                  className="group flex min-h-[118px] items-start gap-3 rounded-[18px] border border-[#e1e9e2] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#b9d6c1] hover:shadow-md hover:shadow-[#1c392508]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf5ee] text-[#5a956d]">
                    <Folder size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">
                      {category.name}
                    </span>
                    <span className="mt-1 block text-xs text-[#89958d]">
                      {count > 0
                        ? `${count} ${count === 1 ? "card" : "cards"} to review`
                        : "No cards due right now"}
                    </span>
                  </span>
                  <span className="mt-1 shrink-0 text-[#a7b1aa] transition group-hover:text-[#4e9e70]">
                    {count === 0 ? (
                      <Check size={16} />
                    ) : (
                      <ArrowRight size={16} />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
