import { ArrowRight, Check, Folder, Plus } from "lucide-react";
import type { Category } from "@/types/flashcards";

type CollectionsPageProps = {
  categories: Category[];
  categoryDueCounts: Record<string, number>;
  onAddCollection: () => void;
  onSelectCollection: (id: string) => void;
};

export function CollectionsPage({
  categories,
  categoryDueCounts,
  onAddCollection,
  onSelectCollection,
}: CollectionsPageProps) {
  const collections = categories.filter((category) => category.id !== "all");

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Your study collections</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-.055em]">
            Collections<span className="text-[#55ad7d]">.</span>
          </h1>
          <p className="mt-2 text-sm text-[#7d8b82]">
            Choose a collection to review its cards or create a new one.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddCollection}
          className="primary-button min-h-11"
        >
          <Plus size={16} />
          New collection
        </button>
      </div>

      {collections.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-[#d8e4da] bg-white/60 px-5 py-12 text-center">
          <span className="review-empty">
            <Folder size={24} />
          </span>
          <h2 className="mt-4 text-base font-bold">No collections yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#7b8880]">
            Create your first collection to organize words by topic or language.
          </p>
          <button
            type="button"
            onClick={onAddCollection}
            className="secondary-button mt-5"
          >
            <Plus size={15} />
            Create your first collection
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {collections.map((category) => {
            const dueCount = categoryDueCounts[category.id] ?? 0;

            return (
              <button
                type="button"
                key={category.id}
                onClick={() => onSelectCollection(category.id)}
                className="group flex min-h-[142px] items-start gap-4 rounded-[18px] border border-[#e1e9e2] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-[#b9d6c1] hover:shadow-md hover:shadow-[#1c392508]"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#edf5ee] text-[#5a956d]">
                  <Folder size={19} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base font-bold">
                    {category.name}
                  </span>
                  <span className="mt-1 block text-xs font-medium text-[#89958d]">
                    {category.sourceLanguage.toUpperCase()} →{" "}
                    {category.targetLanguage.toUpperCase()}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#698174]">
                    {dueCount > 0 ? (
                      <>
                        {dueCount} {dueCount === 1 ? "card" : "cards"} to review
                      </>
                    ) : (
                      <>
                        <Check size={14} className="text-[#57966b]" />
                        Nothing due right now
                      </>
                    )}
                  </span>
                </span>
                <ArrowRight
                  size={16}
                  className="mt-1 shrink-0 text-[#a7b1aa] transition group-hover:translate-x-1 group-hover:text-[#4e9e70]"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
