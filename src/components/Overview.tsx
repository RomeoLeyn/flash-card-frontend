import { BookOpen, Clock3, Zap } from "lucide-react";
import type { Card, ReviewStats } from "@/types/flashcards";
import { StatCard } from "./StatCard";

type OverviewProps = {
  cards: Card[];
  dueCount: number;
  stats?: ReviewStats | null;
  onReview: () => void;
  onCards: () => void;
};

export function Overview({
  cards,
  dueCount,
  stats,
  onReview,
  onCards,
}: OverviewProps) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Due today"
          value={String(stats?.dueCount ?? dueCount).padStart(2, "0")}
          detail="cards waiting"
          icon={<Clock3 />}
          tone="orange"
        />
        <StatCard
          label="Total learned"
          value={String(stats?.total ?? 0).padStart(2, "0")}
          detail="cards in library"
          icon={<BookOpen />}
          tone="green"
        />
        <StatCard
          label="Review today"
          value={String(stats?.reviewedToday ?? 0).padStart(2, "0")}
          detail="cards reviewed"
          icon={<Zap />}
          tone="blue"
        />
      </div>
      <div className="mt-10 grid gap-5 xl:grid-cols-[1.45fr_1fr]"></div>
    </>
  );
}
