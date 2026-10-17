import { useState } from "react";
import { BookPlus, Loader2, RotateCw, Sparkles } from "lucide-react";
import { ApiError } from "@/lib/httpClient";
import { Modal } from "@/shared/ui/Modal";
import type { AiWordExplanation, CreateCardInput } from "@/types/flashcards";

type ExplainWordModalProps = {
  explanation: AiWordExplanation | null;
  loading: boolean;
  error: string | null;
  categoryId: string;
  sourceLanguage: string;
  targetLanguage: string;
  onClose: () => void;
  onRetry: () => void;
  onSave: (input: CreateCardInput) => Promise<void>;
  onUnauthorized: () => void;
};

export function ExplainWordModal({
  explanation,
  loading,
  error,
  categoryId,
  sourceLanguage,
  targetLanguage,
  onClose,
  onRetry,
  onSave,
  onUnauthorized,
}: ExplainWordModalProps) {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const saveCard = async () => {
    if (!explanation || saving) return;

    setSaving(true);
    setSaveError(null);
    try {
      await onSave({
        word: explanation.word,
        sourceLanguage,
        targetLanguage,
        translation: explanation.translation,
        transcription: explanation.transcription || undefined,
        explanation: explanation.explanation,
        example: explanation.example,
        categoryId,
      });
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        onUnauthorized();
      } else {
        setSaveError(
          (cause instanceof Error ? cause.message : null) ||
            "An error occurred while saving the card. Please try again.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) onClose();
  };

  return (
    <Modal
      title="Explain a word"
      subtitle="Review the explanation, then choose whether to add the word."
      onClose={handleClose}
      className="max-h-[90vh] overflow-y-auto"
      showCloseButton={false}
    >
      {loading ? (
        <div
          className="flex min-h-48 flex-col items-center justify-center gap-3 text-sm text-[#718278]"
          role="status"
        >
          <Loader2 size={24} className="animate-spin text-[#50a57a]" />
          Asking AI to explain the selected word…
          <button
            type="button"
            onClick={handleClose}
            className="secondary-button mt-3"
          >
            Cancel
          </button>
        </div>
      ) : error ? (
        <div className="space-y-4">
          <p
            role="alert"
            className="rounded-xl border border-[#f0d6ca] bg-[#fff7f2] p-4 text-sm leading-6 text-[#9a4a32]"
          >
            {error}
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="secondary-button"
            >
              Cancel
            </button>
            <button type="button" onClick={onRetry} className="primary-button">
              <RotateCw size={16} /> Try again
            </button>
          </div>
        </div>
      ) : explanation ? (
        <div className="space-y-4">
          <div className="rounded-xl bg-[#eef6ef] p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.1em] text-[#508566]">
              <Sparkles size={15} /> Word forms
            </div>
            <p className="mt-2 text-xl font-bold tracking-[-.03em]">
              {explanation.word}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[.08em] text-[#829087]">
              {explanation.sourceLanguage} → {explanation.targetLanguage}
            </p>
            <p className="mt-1 text-sm text-[#718278]">
              In the sentence: <strong>{explanation.originalForm}</strong>
              {explanation.transcription && (
                <span className="ml-2">{explanation.transcription}</span>
              )}
            </p>
            <p className="mt-2 text-lg font-semibold text-[#34744e]">
              {explanation.translation}
            </p>
          </div>

          <section>
            <h3 className="text-sm font-bold">Short explanation</h3>
            <p className="mt-1 text-sm leading-6 text-[#65736a]">
              {explanation.explanation}
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold">Meaning in this sentence</h3>
            <p className="mt-1 text-sm leading-6 text-[#65736a]">
              {explanation.detailedExplanation}
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold">Another example</h3>
            <p className="mt-1 text-sm italic leading-6 text-[#718278]">
              {explanation.example}
            </p>
          </section>

          {saveError && (
            <p
              role="alert"
              className="rounded-xl border border-[#f0d6ca] bg-[#fff7f2] p-3 text-sm text-[#9a4a32]"
            >
              {saveError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="secondary-button"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void saveCard()}
              disabled={saving}
              className="primary-button"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Adding…
                </>
              ) : (
                <>
                  <BookPlus size={16} /> Add word
                </>
              )}
            </button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
