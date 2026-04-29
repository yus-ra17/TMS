import type { TaskStatus } from '@/types';
import { cn } from '@/lib/utils';

const STYLES: Record<TaskStatus, string> = {
  TODO: 'bg-muted text-muted-foreground border-border',
  IN_PROGRESS: 'bg-warning/10 text-warning border-warning/20',
  DONE: 'bg-success/10 text-success border-success/20',
};
const LABELS: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        STYLES[status],
      )}
    >
      <span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full',
        status === 'TODO' && 'bg-muted-foreground',
        status === 'IN_PROGRESS' && 'bg-warning',
        status === 'DONE' && 'bg-success',
      )} />
      {LABELS[status]}
    </span>
  );
}
