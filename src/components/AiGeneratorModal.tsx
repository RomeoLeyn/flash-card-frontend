import { useState } from "react";
import { Sparkles } from "lucide-react";
import type {
  AiGenerationRequest,
  AiGenerationResult,
  Category,
} from "@/types/flashcards";
import { Modal } from "./Modal";
import { useTypingPlaceholder } from "@/hooks/useTypingPlaceholder";

type AiGeneratorModalProps = {
  categories: Category[];
  activeCategory?: string;
  onClose: () => void;
  onGenerate: (request: AiGenerationRequest) => Promise<AiGenerationResult>;
};

const PROMPT_PLACEHOLDERS = [
  "e.g. Generate 15 furniture words in Ukrainian with translations and examples",
];

export function AiGeneratorModal({
  categories,
  activeCategory,
  onClose,
  onGenerate,
}: AiGeneratorModalProps) {
  const [mode, setMode] = useState<"generate" | "from_list">("generate");
  const [prompt, setPrompt] = useState("");
  const [instructions, setInstructions] = useState("");
  const [wordsInput, setWordsInput] = useState("");
  const [count, setCount] = useState("15");
  const [categoryId, setCategoryId] = useState(
    categories.some((c) => c.id === activeCategory)
      ? activeCategory!
      : (categories[0]?.id ?? "daily"),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;

    let request: AiGenerationRequest;
    if (mode === "generate") {
      const parsedCount = Number(count);
      if (
        !Number.isInteger(parsedCount) ||
        parsedCount < 1 ||
        parsedCount > 50
      ) {
        setError("Enter a whole number from 1 to 50");
        return;
      }
      if (!prompt.trim()) {
        setError("Please enter a prompt");
        return;
      }
      request = {
        mode,
        categoryId,
        count: parsedCount,
        prompt: prompt.trim(),
      };
    } else {
      const seenWords = new Set<string>();
      const words = wordsInput
        .split(/\r?\n/)
        .map((word) => word.trim())
        .filter((word) => {
          const normalized = word.toLowerCase();
          if (!word || seenWords.has(normalized)) return false;
          seenWords.add(normalized);
          return true;
        });

      if (words.length < 1 || words.length > 50) {
        setError("Enter between 1 and 50 unique words or phrases");
        return;
      }
      if (words.some((word) => word.length > 100)) {
        setError("Each word or phrase must be 100 characters or fewer");
        return;
      }
      request = {
        mode,
        categoryId,
        words,
        ...(instructions.trim() ? { prompt: instructions.trim() } : {}),
      };
    }

    if (!categoryId) {
      setError("Please select a collection");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onGenerate(request);
      setPrompt("");
      setInstructions("");
      setWordsInput("");
      onClose();
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
      subtitle="Generate cards from a prompt or your own word list."
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div
          className="grid grid-cols-2 rounded-xl border border-[#dfe7e0] bg-[#f1f5f1] p-1"
          role="group"
          aria-label="Режим генерації"
        >
          {(
            [
              ["generate", "Згенерувати"],
              ["from_list", "Мої слова"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => {
                setMode(value);
                setError(null);
              }}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                mode === value
                  ? "bg-white text-[#34744e] shadow-sm"
                  : "text-[#718278] hover:text-[#26352d]"
              }`}
              disabled={loading}
            >
              {label}
            </button>
          ))}
        </div>
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
        {mode === "generate" ? (
          <>
            <label className="field-label">
              Number of cards
              <input
                type="number"
                min={1}
                max={50}
                step={1}
                required
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="field-input"
                disabled={loading}
              />
            </label>
            <label className="field-label">
              Your prompt <span aria-hidden="true">*</span>
              <textarea
                autoFocus
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={animatedPlaceholder}
                rows={5}
                className="field-input resize-none"
                disabled={loading}
              />
            </label>
          </>
        ) : (
          <>
            <label className="field-label">
              Words or phrases <span aria-hidden="true">*</span>
              <textarea
                autoFocus
                required
                value={wordsInput}
                onChange={(e) => setWordsInput(e.target.value)}
                placeholder={"apple\nto make a decision\njourney"}
                rows={5}
                className="field-input resize-none"
                disabled={loading}
              />
            </label>
            <label className="field-label">
              Optional instructions
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Add a short usage example"
                rows={2}
                className="field-input resize-none"
                disabled={loading}
              />
            </label>
          </>
        )}
        {error && (
          <div className="rounded-lg border border-[#e4b8b8] bg-[#fff3f3] p-3 text-sm text-[#c7563a]">
            {error}
          </div>
        )}
        <div className="ai-hint">
          <Sparkles size={17} />
          <span>
            {mode === "generate"
              ? "AI will generate cards with translations and explanations. Duplicate words are filtered automatically."
              : "Enter one word or phrase per line. Duplicate entries are removed automatically."}
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
