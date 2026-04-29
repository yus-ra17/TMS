import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { projectsApi } from '@/api/projects.api';
import { usersApi } from '@/api/users.api';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar } from '@/components/Avatar';
import { Spinner } from '@/components/Spinner';
import { AlertCircle, Crown, Trash2, UserPlus } from 'lucide-react';
import type { Project } from '@/types';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  project: Project | undefined;
}

export function ManageMembersPanel({ open, onOpenChange, project }: Props) {
  const qc = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);
  const [selectedUserId, setSelectedUserId] = useState('');

  const { data: users } = useQuery({ queryKey: ['users'], queryFn: usersApi.list, enabled: open });

  const isOwner = project?.members?.some(
    (m) => (m.userId === currentUser?.id || m.user?.id === currentUser?.id) && m.role === 'OWNER'
  ) ?? false;

  const addMutation = useMutation({
    mutationFn: () => projectsApi.addMember(project!.id, selectedUserId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['project', project!.id] });
      qc.invalidateQueries({ queryKey: ['projects'] });
      setSelectedUserId('');
      toast.success('Member added successfully');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Could not add member'),
  });

  const removeMutation = useMutation({
    mutationFn: (userId: string) => projectsApi.removeMember(project!.id, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['project', project!.id] });
      qc.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Member removed');
    },
    onError: () => toast.error('Could not remove member'),
  });

  const err = addMutation.error as any;
  const errMsg = err?.response?.data?.message;
  const memberIds = new Set(project?.members?.map((m) => m.userId) ?? []);
  const candidates = users?.filter((u) => !memberIds.has(u.id)) ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Manage members</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {isOwner ? (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Add member
              </h4>
              <div className="flex gap-2">
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.length === 0 && (
                      <div className="p-2 text-sm text-muted-foreground">No users available</div>
                    )}
                    {candidates.map((u) => (
                      <SelectItem key={u.id} value={u.id}>{u.name} · {u.email}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => addMutation.mutate()} disabled={!selectedUserId || addMutation.isPending}>
                  {addMutation.isPending
                    ? <Spinner size="sm" className="text-primary-foreground" />
                    : <><UserPlus className="h-4 w-4 mr-1" />Add</>}
                </Button>
              </div>
              {errMsg && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{Array.isArray(errMsg) ? errMsg.join(', ') : errMsg}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
              Only the project owner can add or remove members.
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Current members ({project?.members?.length ?? 0})
            </h4>
            <ul className="space-y-2">
              {project?.members?.map((m) => (
                <li key={m.userId} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={m.user?.name} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{m.user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{m.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={
                      'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ' +
                      (m.role === 'OWNER'
                        ? 'border-warning/30 bg-warning/10 text-warning'
                        : 'border-border bg-muted text-muted-foreground')
                    }>
                      {m.role === 'OWNER' && <Crown className="h-3 w-3" />}
                      {m.role}
                    </span>
                    {isOwner && m.role !== 'OWNER' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" disabled={removeMutation.isPending}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove member?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove <span className="font-semibold text-foreground">{m.user?.name}</span> from this project? They will lose access to all tasks.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeMutation.mutate(m.userId)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Yes, remove member
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
