import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/api/tasks.api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/Spinner';
import type { Project, Task } from '@/types';

interface Props {
  task: Task | null;
  project: Project | undefined;
  onClose: () => void;
}

export function AssignTaskDialog({ task, project, onClose }: Props) {
  const qc = useQueryClient();
  const [assigneeId, setAssigneeId] = useState('');

  useEffect(() => {
    setAssigneeId(task?.assigneeId ?? task?.assignee?.id ?? '');
  }, [task]);

  const mutation = useMutation({
    mutationFn: () => tasksApi.assign(task!.id, assigneeId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', task!.projectId] });
      onClose();
    },
  });

  return (
    <Dialog open={!!task} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/40 p-3">
            <p className="text-xs font-medium text-muted-foreground">Task</p>
            <p className="text-sm font-semibold mt-0.5">{task?.title}</p>
          </div>
          <div className="space-y-1.5">
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger><SelectValue placeholder="Select an assignee" /></SelectTrigger>
              <SelectContent>
                {project?.members?.map((m) => (
                  <SelectItem key={m.userId} value={m.userId}>{m.user?.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => mutation.mutate()} disabled={!assigneeId || mutation.isPending}>
            {mutation.isPending ? <Spinner size="sm" className="text-primary-foreground" /> : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
