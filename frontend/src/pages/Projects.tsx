import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { projectsApi } from '@/api/projects.api';
import { tasksApi } from '@/api/tasks.api';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Spinner } from '@/components/Spinner';
import { CardGridSkeleton } from '@/components/Skeletons';
import { EmptyState } from '@/components/EmptyState';
import { AlertCircle, Crown, FolderKanban, Plus, Sparkles, Users } from 'lucide-react';

const Projects = () => {
  const qc = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.list,
  });

  // Fetch task counts per project for progress bars
  const taskQueries = useQueries({
    queries: (projects ?? []).map((p) => ({
      queryKey: ['tasks', p.id, 'all'],
      queryFn: () => tasksApi.list(p.id, { page: 1, limit: 200 }),
      enabled: !!p.id,
    })),
  });

  const createMutation = useMutation({
    mutationFn: () => projectsApi.create({ name, description: description || undefined }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created');
      setOpen(false);
      setName('');
      setDescription('');
    },
    onError: () => toast.error('Could not create project'),
  });

  const createErr = createMutation.error as any;
  const createErrMsg = createErr?.response?.data?.message;

  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">Organize your work into focused projects.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="h-10 shadow-elegant">
          <Plus className="mr-1.5 h-4 w-4" /> New project
        </Button>
      </div>

      {isLoading && <CardGridSkeleton />}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          Failed to load projects.
        </div>
      )}

      {!isLoading && projects && projects.length === 0 && (
        <EmptyState
          icon={Sparkles}
          title="No projects yet"
          description="Create your first project to start organizing tasks and collaborating with your team."
          action={
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> Create project
            </Button>
          }
        />
      )}

      {projects && projects.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, idx) => {
            const tasks = taskQueries[idx]?.data?.data ?? [];
            const total = tasks.length;
            const done = tasks.filter((t) => t.status === 'DONE').length;
            const pct = total ? Math.round((done / total) * 100) : 0;
            const isOwner = !!currentUser && p.ownerId === currentUser.id;
            const members = p.members ?? [];

            return (
              <Link
                key={p.id}
                to={`/projects/${p.id}/tasks`}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-elegant hover:-translate-y-1 hover:border-primary/30 transition-smooth animate-fade-in"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary group-hover:gradient-primary group-hover:text-primary-foreground transition-smooth">
                    <FolderKanban className="h-5 w-5" />
                  </div>
                  {isOwner && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[10px] font-semibold text-warning">
                      <Crown className="h-3 w-3" /> OWNER
                    </span>
                  )}
                </div>

                <h3 className="text-base font-semibold leading-tight group-hover:text-primary transition-smooth">
                  {p.name}
                </h3>
                {p.description && (
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                )}

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{total} task{total !== 1 ? 's' : ''}</span>
                    <span className="font-semibold">{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full gradient-primary transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Members */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {members.slice(0, 4).map((m) => (
                      <div
                        key={m.userId}
                        className="flex h-7 w-7 items-center justify-center rounded-full gradient-primary text-[10px] font-semibold text-primary-foreground border-2 border-card"
                        title={m.user?.name}
                      >
                        {(m.user?.name?.[0] || '?').toUpperCase()}
                      </div>
                    ))}
                    {members.length > 4 && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground border-2 border-card">
                        +{members.length - 4}
                      </div>
                    )}
                    {members.length === 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" /> No members
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new project</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => { e.preventDefault(); createMutation.mutate(); }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="p-name">Name</Label>
              <Input id="p-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Marketing Website" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-desc">Description</Label>
              <Textarea id="p-desc" value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this project about?" rows={3} />
            </div>
            {createErrMsg && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{Array.isArray(createErrMsg) ? createErrMsg.join(', ') : createErrMsg}</span>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? <Spinner size="sm" className="text-primary-foreground" /> : 'Create project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
