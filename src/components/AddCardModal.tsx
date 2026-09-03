import { useEffect, useState } from "react";
import { Pencil, Plus, Sparkles } from "lucide-react";
import type {
  Card,
  Category,
  CreateCardInput,
  UpdateCardInput,
} from "@/types/flashcards";
import { Modal } from "./Modal";

type AddCardModalProps = {
  categories: Category[];
  activeCategory?: string;
  card?: Card;
  onClose: () => void;
  onAdd: (input: CreateCardInput) => void;
  onSave?: (id: string, input: UpdateCardInput) => void;
};

export function AddCardModal({
  categories,
  activeCategory,
  card,
  onClose,
  onAdd,
  onSave,
}: AddCardModalProps) {
  const isEditing = !!card;

  const [word, setWord] = useState(card?.word ?? "");
  const [translation, setTranslation] = useState(card?.translation ?? "");
  const [explanation, setExplanation] = useState(card?.explanation ?? "");
  const [categoryId, setCategoryId] = useState(
    card?.categoryId || activeCategory || categories[0]?.id || "daily",
  );

  useEffect(() => {
    if (!card) return;
    setWord(card.word);
    setTranslation(card.translation);
    setExplanation(card.explanation ?? "");
    setCategoryId(
      card.categoryId || activeCategory || categories[0]?.id || "daily",
    );
  }, [activeCategory, card, categories]);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!word.trim() || !translation.trim()) return;

    if (isEditing) {
      onSave!(card.id, {
        word: word.trim(),
        translation: translation.trim(),
        explanation: explanation.trim() || undefined,
        categoryId,
      });
    } else {
      onAdd({
        word: word.trim(),
        sourceLanguage: selectedCategory?.sourceLanguage ?? "en",
        targetLanguage: selectedCategory?.targetLanguage ?? "uk",
        translation: translation.trim(),
        explanation: explanation.trim() || undefined,
        categoryId,
      });
    }
  };

  return (
    <Modal
      title={isEditing ? "Edit card" : "Create a new card"}
      subtitle={
        isEditing
          ? "Update the word and its translation."
          : "Capture a word now, make it stick later."
      }
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
        {!isEditing && (
          <div className="ai-hint">
            <Sparkles size={17} />
            <span>
              AI suggestions will appear here when connected to your NestJS
              service.
            </span>
          </div>
        )}
        <div className="flex justify-end gap-3 pt-3">
          <button type="button" onClick={onClose} className="secondary-button">
            Cancel
          </button>
          <button className="primary-button" type="submit">
            {isEditing ? (
              <>
                <Pencil size={17} /> Save changes
              </>
            ) : (
              <>
                <Plus size={17} /> Create card
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
