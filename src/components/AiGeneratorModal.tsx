import { useState } from "react";
import { Sparkles } from "lucide-react";
import type { Category } from "@/types/flashcards";
import { Modal } from "./Modal";
import { useTypingPlaceholder } from "@/hooks/useTypingPlaceholder";

type AiGeneratorModalProps = {
  categories: Category[];
  activeCategory?: string;
  onClose: () => void;
  onGenerate: (prompt: string, categoryId: string) => Promise<string[]>;
};

const PROMPT_PLACEHOLDERS = [
  "e.g. Generate 15 furniture words in Ukrainian with translations and examples",
  "e.g. You can send your own list of words for translation",
];

export function AiGeneratorModal({
  categories,
  activeCategory,
  onClose,
  onGenerate,
}: AiGeneratorModalProps) {
  const [prompt, setPrompt] = useState("");
  const [categoryId, setCategoryId] = useState(
    categories.some((c) => c.id === activeCategory)
      ? activeCategory!
      : (categories[0]?.id ?? "daily"),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [skippedWords, setSkippedWords] = useState<string[] | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const skipped = await onGenerate(prompt.trim(), categoryId);
      setSkippedWords(skipped ?? []);
      setSuccess(true);
      if (skipped && skipped.length) {
        setInfo(`Skipped duplicates: ${skipped.join(", ")}`);
      }
      setTimeout(() => {
        setPrompt("");
        onClose();
      }, 1800);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Failed to generate cards",
      );
    } finally {
      setLoading(false);
    }
  };

  const animatedPlaceholder = useTypingPlaceholder(PROMPT_PLACEHOLDERS);

  return (
    <Modal
      title="Generate with AI"
      subtitle="Create multiple cards from a single prompt."
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-4">
        <label className="field-label">
          Collection
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="field-input"
            disabled={loading}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Your prompt
          <textarea
            autoFocus
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={animatedPlaceholder}
            rows={5}
            className="field-input resize-none"
            disabled={loading}
          />
        </label>
        {error && (
          <div className="rounded-lg border border-[#e4b8b8] bg-[#fff3f3] p-3 text-sm text-[#c7563a]">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg border border-[#b8d8c4] bg-[#f3fff5] p-3 text-sm text-[#3a8b5c]">
            <div>Cards generated successfully!</div>
            {info && <div className="mt-1 text-sm text-[#3a8b5c]">{info}</div>}
            {skippedWords && skippedWords.length > 0 && (
              <div className="mt-2 text-sm text-[#567a5d]">
                Skipped: {skippedWords.join(", ")}
              </div>
            )}
          </div>
        )}
        <div className="ai-hint">
          <Sparkles size={17} />
          <span>
            AI will analyze your prompt and generate cards with words,
            translations, and explanations. Keep in mind that AI can repeat
            words, so we automatically filter out duplicates.
          </span>
        </div>
        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="secondary-button"
            disabled={loading}
          >
            Cancel
          </button>
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={17} /> Generate cards
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
