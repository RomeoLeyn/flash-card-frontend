import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "./Modal";

type CategoryModalProps = {
  onClose: () => void;
  onAdd: (name: string, sourceLanguage: string, targetLanguage: string) => void;
};

const LANGUAGE_OPTIONS = [
  { code: "uk", label: "Ukrainian" },
  { code: "en", label: "English" },
  { code: "de", label: "German" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "pl", label: "Polish" },
];

export function CategoryModal({ onClose, onAdd }: CategoryModalProps) {
  const [name, setName] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("uk");
  const [targetLanguage, setTargetLanguage] = useState("en");

  return (
    <Modal
      title="New collection"
      subtitle="Group related words together."
      onClose={onClose}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim()) onAdd(name.trim(), sourceLanguage, targetLanguage);
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
              onChange={(event) => setSourceLanguage(event.target.value)}
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
              onChange={(event) => setTargetLanguage(event.target.value)}
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
            <Plus size={17} /> Create
          </button>
        </div>
      </form>
    </Modal>
  );
}
