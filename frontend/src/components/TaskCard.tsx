import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/api/tasks.api';
import { useAuthStore } from '@/store/auth.store';
import { Avatar } from '@/components/Avatar';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, X } from 'lucide-react';
import type { Task, TaskStatus } from '@/types';

interface Props {
  task: Task;
  onAssign: (task: Task) => void;
}

export function TaskCard({ task, onAssign }: Props) {
  const qc = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);
  const assigneeId = task.assigneeId ?? task.assignee?.id;
  const isAssignee = !!currentUser && assigneeId === currentUser.id;

  const statusMutation = useMutation({
    mutationFn: (status: TaskStatus) => tasksApi.updateStatus(task.id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', task.projectId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => tasksApi.remove(task.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', task.projectId] }),
  });

  return (
    <div className="group relative rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-elegant hover:-translate-y-0.5 transition-smooth">
      <button
        onClick={() => {
          if (confirm('Delete this task?')) deleteMutation.mutate();
        }}
        className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-smooth"
        aria-label="Delete task"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start justify-between gap-3 pr-8">
        <h3 className="font-semibold leading-tight">{task.title}</h3>
      </div>

      {task.description && (
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
      )}

      <div className="mt-4 flex items-center gap-2">
        <StatusBadge status={task.status} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-2 min-w-0">
          {task.assignee ? (
            <>
              <Avatar name={task.assignee.name} />
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{task.assignee.name}</p>
                {task.creator && (
                  <p className="text-[11px] text-muted-foreground truncate">by {task.creator.name}</p>
                )}
              </div>
            </>
          ) : (
            <span className="text-xs text-muted-foreground italic">Unassigned</span>
          )}
        </div>
        <Button size="sm" variant="ghost" onClick={() => onAssign(task)} className="h-8 px-2">
          <UserPlus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {isAssignee && (
        <div className="mt-3">
          <Select
            value={task.status}
            onValueChange={(v) => statusMutation.mutate(v as TaskStatus)}
            disabled={statusMutation.isPending}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODO">To Do</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
