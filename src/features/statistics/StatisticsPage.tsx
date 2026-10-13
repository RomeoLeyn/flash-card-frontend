import { BookOpen, Clock3, Zap } from "lucide-react";
import type { ReviewStats } from "@/types/flashcards";
import { StatCard } from "./StatCard";

type StatisticsPageProps = {
  dueCount: number;
  stats: ReviewStats | null;
};

export function StatisticsPage({ dueCount, stats }: StatisticsPageProps) {
  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow">Your progress</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-.055em]">
          Statistics<span className="text-[#55ad7d]">.</span>
        </h1>
        <p className="mt-2 text-sm text-[#7d8b82]">
          A snapshot of your flashcard learning activity.
        </p>
      </div>
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
    </div>
  );
}
