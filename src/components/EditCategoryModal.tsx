import { useState } from "react";
import { Save } from "lucide-react";
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
};

export function EditCategoryModal({
  category,
  onClose,
  onSave,
}: EditCategoryModalProps) {
  const [name, setName] = useState(category.name);
  const [sourceLanguage, setSourceLanguage] = useState<LanguageCode>(
    category.sourceLanguage as LanguageCode,
  );
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>(
    category.targetLanguage as LanguageCode,
  );

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

        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="secondary-button">
            Cancel
          </button>
          <button className="primary-button" type="submit">
            <Save size={17} /> Save changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
