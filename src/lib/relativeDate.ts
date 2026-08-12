export function relativeDate(date: string | null): string {
  if (!date) return 'Not scheduled';
  const diff = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
  if (diff < 0) return 'Overdue';
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return `In ${diff} days`;
}
