import { formatDistanceToNow } from 'date-fns';

export function timeAgo(date?: string | Date | null): string {
  if (!date) return '';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return '';
  }
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

// Deterministic UI-only priority derived from task id (backend may not support it)
export function derivePriority(id: string): Priority {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const m = h % 10;
  if (m < 2) return 'HIGH';
  if (m < 6) return 'MEDIUM';
  return 'LOW';
}

export const PRIORITY_STYLES: Record<Priority, string> = {
  LOW: 'bg-muted text-muted-foreground border-border',
  MEDIUM: 'bg-primary-soft text-primary border-primary/20',
  HIGH: 'bg-destructive/10 text-destructive border-destructive/30',
};
