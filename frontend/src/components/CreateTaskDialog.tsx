import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/api/tasks.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/Spinner';
import { AlertCircle } from 'lucide-react';
import type { Project } from '@/types';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  project: Project | undefined;
}

export function CreateTaskDialog({ open, onOpenChange, project }: Props) {
  const qc = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState<string>('');

  const mutation = useMutation({
    mutationFn: () =>
      tasksApi.create(project!.id, {
        title,
        description: description || undefined,
        assigneeId: assigneeId || undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', project!.id] });
      qc.invalidateQueries({ queryKey: ['tasks', project!.id, 'all'] });
      setTitle('');
      setDescription('');
      setAssigneeId('');
      onOpenChange(false);
    },
  });

  const err = mutation.error as any;
  const errMsg = err?.response?.data?.message;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new task</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="t-title">Title</Label>
            <Input id="t-title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Design new homepage" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-desc">Description</Label>
            <Textarea id="t-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Optional details..." />
          </div>
          <div className="space-y-1.5">
            <Label>Assignee</Label>
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
              <SelectContent>
                {project?.members?.map((m) => (
                  <SelectItem key={m.userId ?? m.user?.id} value={m.userId ?? m.user?.id ?? ''}>{m.user?.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errMsg && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{Array.isArray(errMsg) ? errMsg.join(', ') : errMsg}</span>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Spinner size="sm" className="text-primary-foreground" /> : 'Create task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
