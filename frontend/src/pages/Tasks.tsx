import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '@/api/projects.api';
import { useTasks } from '@/hooks/useTasks';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskCard } from '@/components/TaskCard';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { AssignTaskDialog } from '@/components/AssignTaskDialog';
import { ManageMembersPanel } from '@/components/ManageMembersPanel';
import { FullSpinner } from '@/components/Spinner';
import { AlertCircle, ArrowLeft, ChevronLeft, ChevronRight, ClipboardList, Plus, Users } from 'lucide-react';
import type { Task, TaskStatus } from '@/types';

type Filter = 'ALL' | TaskStatus;

const Tasks = () => {
  const { projectId = '' } = useParams<{ projectId: string }>();
  const currentUser = useAuthStore((s) => s.user);
  const [filter, setFilter] = useState<Filter>('ALL');
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [assigningTask, setAssigningTask] = useState<Task | null>(null);

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.get(projectId),
    enabled: !!projectId,
  });

  const status = filter === 'ALL' ? undefined : filter;
  const { data, isLoading, isFetching, error } = useTasks(projectId, page, status);

  const isOwner = project?.members?.some(
    (m) => (m.userId === currentUser?.id || m.user?.id === currentUser?.id) && m.role === 'OWNER'
  ) ?? false;

  const handleFilterChange = (v: string) => {
    setFilter(v as Filter);
    setPage(1);
  };

  return (
    <>
      <main className="container py-8 max-w-7xl">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth"
        >
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project?.name ?? '...'}</h1>
            {project?.description && (
              <p className="text-muted-foreground mt-1 max-w-2xl">{project.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isOwner && (
              <Button variant="outline" onClick={() => setMembersOpen(true)}>
                <Users className="mr-1.5 h-4 w-4" /> Manage members
              </Button>
            )}
            <Button onClick={() => setCreateOpen(true)} className="shadow-elegant">
              <Plus className="mr-1.5 h-4 w-4" /> New task
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <Tabs value={filter} onValueChange={handleFilterChange}>
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="ALL">All</TabsTrigger>
              <TabsTrigger value="TODO">To Do</TabsTrigger>
              <TabsTrigger value="IN_PROGRESS">In Progress</TabsTrigger>
              <TabsTrigger value="DONE">Done</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-6 min-h-[200px]">
          {isLoading && <FullSpinner />}

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" /> Failed to load tasks.
            </div>
          )}

          {!isLoading && data && data.data.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary mb-4">
                <ClipboardList className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">No tasks here yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                {filter === 'ALL' ? 'Create your first task to get started.' : 'No tasks match this filter.'}
              </p>
              {filter === 'ALL' && (
                <Button onClick={() => setCreateOpen(true)} className="mt-6">
                  <Plus className="mr-1.5 h-4 w-4" /> New task
                </Button>
              )}
            </div>
          )}

          {data && data.data.length > 0 && (
            <div className={isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {data.data.map((t) => (
                  <TaskCard key={t.id} task={t} onAssign={setAssigningTask} />
                ))}
              </div>

              {data.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <Button
                    variant="outline" size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page <span className="font-semibold text-foreground">{data.page}</span> of {data.totalPages}
                  </span>
                  <Button
                    variant="outline" size="sm"
                    onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                    disabled={page >= data.totalPages}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <CreateTaskDialog open={createOpen} onOpenChange={setCreateOpen} project={project} />
      <ManageMembersPanel open={membersOpen} onOpenChange={setMembersOpen} project={project} />
      <AssignTaskDialog task={assigningTask} project={project} onClose={() => setAssigningTask(null)} />
    </>
  );
};

export default Tasks;
