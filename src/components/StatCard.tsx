import { ArrowUpRight } from 'lucide-react';

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  tone: string;
};

export function StatCard({ label, value, detail, icon, tone }: StatCardProps) {
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between">
        <span className={`stat-icon stat-${tone}`}>{icon}</span>
        <ArrowUpRight size={16} className="text-[#a7b1aa]" />
      </div>
      <p className="mt-5 text-sm text-[#839089]">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <strong className="text-3xl font-bold tracking-[-.07em]">{value}</strong>
        <span className="text-xs text-[#93a099]">{detail}</span>
      </div>
    </div>
  );
}
