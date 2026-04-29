import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '@/api/projects.api';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FullSpinner, Spinner } from '@/components/Spinner';
import { Plus, FolderKanban, Users, AlertCircle, Sparkles } from 'lucide-react';

const Projects = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.list,
  });

  const createMutation = useMutation({
    mutationFn: () => projectsApi.create({ name, description: description || undefined }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      setOpen(false);
      setName('');
      setDescription('');
    },
  });

  const createErr = createMutation.error as any;
  const createErrMsg = createErr?.response?.data?.message;

  return (
    <div className="min-h-screen bg-background bg-mesh">
      <Navbar />
      <main className="container py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground mt-1">Organize your work into focused projects.</p>
          </div>
          <Button onClick={() => setOpen(true)} className="h-10 shadow-elegant">
            <Plus className="mr-1.5 h-4 w-4" /> New project
          </Button>
        </div>

        {isLoading && <FullSpinner />}

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            Failed to load projects.
          </div>
        )}

        {!isLoading && projects && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">No projects yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Create your first project to start organizing tasks and collaborating with your team.
            </p>
            <Button onClick={() => setOpen(true)} className="mt-6">
              <Plus className="mr-1.5 h-4 w-4" /> Create project
            </Button>
          </div>
        )}

        {projects && projects.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Link
                key={p.id}
                to={`/projects/${p.id}/tasks`}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-elegant hover:-translate-y-1 transition-smooth"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary group-hover:gradient-primary group-hover:text-primary-foreground transition-smooth">
                    <FolderKanban className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {p.members?.length ?? p.memberCount ?? 0}
                  </div>
                </div>
                <h3 className="text-base font-semibold leading-tight group-hover:text-primary transition-smooth">
                  {p.name}
                </h3>
                {p.description && (
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>

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
