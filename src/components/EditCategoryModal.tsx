import { useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { Modal } from "./Modal";
import type { Category } from "@/types/flashcards";
import { LANGUAGE_OPTIONS, LanguageCode } from "@/common/constants/constants";

type EditCategoryModalProps = {
  category: Category;
  onClose: () => void;
  onSave: (
    id: string,
    data: {
      name: string;
      sourceLanguage: LanguageCode;
      targetLanguage: LanguageCode;
    },
  ) => void;
  onDelete: (id: string) => Promise<void> | void;
};

export function EditCategoryModal({
  category,
  onClose,
  onSave,
  onDelete,
}: EditCategoryModalProps) {
  const [name, setName] = useState(category.name);
  const [sourceLanguage, setSourceLanguage] = useState<LanguageCode>(
    category.sourceLanguage as LanguageCode,
  );
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>(
    category.targetLanguage as LanguageCode,
  );
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await onDelete(category.id);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Modal
      title="Edit collection"
      subtitle="Update the collection details."
      onClose={onClose}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim()) {
            onSave(category.id, {
              name: name.trim(),
              sourceLanguage,
              targetLanguage,
            });
          }
        }}
      >
        <label className="field-label">
          Collection name
          <input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Furniture"
            className="field-input"
          />
        </label>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="field-label">
            Source language
            <select
              value={sourceLanguage}
              onChange={(event) =>
                setSourceLanguage(event.target.value as LanguageCode)
              }
              className="field-input"
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field-label">
            Target language
            <select
              value={targetLanguage}
              onChange={(event) =>
                setTargetLanguage(event.target.value as LanguageCode)
              }
              className="field-input"
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {confirmingDelete ? (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              Видалити колекцію "{category.name}"?
            </p>
            <p className="mt-1 text-xs text-red-600">
              Ви впевнені, що хочете видалити цю колекцію?
            </p>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="secondary-button"
                disabled={deleting}
              >
                Скасувати
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {deleting ? "Видалення..." : "Так, видалити"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="flex items-center gap-2 text-sm font-medium text-red-600 transition hover:text-red-700"
            >
              <Trash2 size={16} /> Видалити колекцію
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="secondary-button"
              >
                Cancel
              </button>
              <button className="primary-button" type="submit">
                <Save size={17} /> Save changes
              </button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}
