import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import type { Category, CreateCardInput } from "@/types/flashcards";
import { Modal } from "./Modal";

type AddCardModalProps = {
  categories: Category[];
  activeCategory?: string;
  onClose: () => void;
  onAdd: (input: CreateCardInput) => void;
};

export function AddCardModal({
  categories,
  activeCategory,
  onClose,
  onAdd,
}: AddCardModalProps) {
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [explanation, setExplanation] = useState("");
  const [categoryId, setCategoryId] = useState(
    (activeCategory || categories[0]?.id) ?? "daily",
  );

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!word.trim() || !translation.trim()) return;
    onAdd({
      word: word.trim(),
      sourceLanguage: "English",
      targetLanguage: "Ukrainian",
      translation: translation.trim(),
      explanation: explanation.trim() || undefined,
      categoryId,
    });
  };

  return (
    <Modal
      title="Create a new card"
      subtitle="Capture a word now, make it stick later."
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-4">
        <label className="field-label">
          Word
          <input
            autoFocus
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="e.g. serendipity"
            className="field-input"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="field-label">
            Translation
            <input
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="e.g. щасливий випадок"
              className="field-input"
            />
          </label>
          <label className="field-label">
            Collection
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="field-input"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="field-label">
          Description{" "}
          <span className="font-normal normal-case tracking-normal text-[#99a49d]">
            optional
          </span>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Add a helpful context or example..."
            rows={3}
            className="field-input resize-none"
          />
        </label>
        <div className="ai-hint">
          <Sparkles size={17} />
          <span>
            AI suggestions will appear here when connected to your NestJS
            service.
          </span>
        </div>
        <div className="flex justify-end gap-3 pt-3">
          <button type="button" onClick={onClose} className="secondary-button">
            Cancel
          </button>
          <button className="primary-button" type="submit">
            <Plus size={17} /> Create card
          </button>
        </div>
      </form>
    </Modal>
  );
}
