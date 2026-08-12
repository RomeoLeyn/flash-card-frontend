import { useEffect, useState } from "react";

type UseTypingPlaceholderOptions = {
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
};

export function useTypingPlaceholder(
    phrases: string[],
    {
        typingSpeed = 40,
        deletingSpeed = 20,
        pauseDuration = 1800,
    }: UseTypingPlaceholderOptions = {},
) {
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (phrases.length === 0) return;

        const currentPhrase = phrases[phraseIndex];

        if (!isDeleting && text === currentPhrase) {
            const pauseTimeout = setTimeout(() => setIsDeleting(true), pauseDuration);
            return () => clearTimeout(pauseTimeout);
        }

        if (isDeleting && text === "") {
            setIsDeleting(false);
            setPhraseIndex((prev) => (prev + 1) % phrases.length);
            return;
        }

        const timeout = setTimeout(
            () => {
                setText((prev) =>
                    isDeleting
                        ? currentPhrase.slice(0, prev.length - 1)
                        : currentPhrase.slice(0, prev.length + 1),
                );
            },
            isDeleting ? deletingSpeed : typingSpeed,
        );

        return () => clearTimeout(timeout);
    }, [text, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

    return text;
}