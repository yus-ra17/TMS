import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAllTasks } from '@/hooks/useAllTasks';
import { useAuthStore } from '@/store/auth.store';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { CardGridSkeleton } from '@/components/Skeletons';
import { CheckSquare, FolderKanban } from 'lucide-react';
import { timeAgo } from '@/lib/task-utils';

const MyTasks = () => {
  const user = useAuthStore((s) => s.user);
  const { tasks, isLoading } = useAllTasks();

  const mine = useMemo(() => {
    if (!user) return [];
    return tasks.filter((t) => (t.assigneeId ?? t.assignee?.id) === user.id);
  }, [tasks, user]);

  const grouped = useMemo(() => {
    const map = new Map<string, { name: string; projectId: string; tasks: typeof mine }>();
    mine.forEach((t) => {
      const key = t.projectId;
      if (!map.has(key)) map.set(key, { name: (t as any).projectName ?? 'Project', projectId: key, tasks: [] });
      map.get(key)!.tasks.push(t);
    });
    return Array.from(map.values());
  }, [mine]);

  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
        <p className="text-muted-foreground mt-1">All tasks assigned to you across every project.</p>
      </div>

      {isLoading && <CardGridSkeleton count={3} />}

      {!isLoading && mine.length === 0 && (
        <EmptyState
          icon={CheckSquare}
          title="No tasks assigned yet"
          description={user ? "When teammates assign you tasks, they'll show up here." : 'Sign in to see your assigned tasks.'}
        />
      )}

      <div className="space-y-6">
        {grouped.map((group) => (
          <section key={group.projectId} className="rounded-2xl border border-border bg-card p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <FolderKanban className="h-4 w-4" />
              </div>
              <h2 className="font-semibold">{group.name}</h2>
              <span className="text-xs text-muted-foreground">({group.tasks.length})</span>
            </div>
            <ul className="divide-y divide-border">
              {group.tasks.map((t) => (
                <li key={t.id}>
                  <Link
                    to={`/projects/${t.projectId}/tasks`}
                    className="flex items-center justify-between gap-3 py-3 hover:bg-muted/50 -mx-3 px-3 rounded-lg transition-smooth group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate group-hover:text-primary transition-smooth">
                        {t.title}
                      </p>
                      {t.createdAt && (
                        <p className="text-xs text-muted-foreground mt-0.5">Created {timeAgo(t.createdAt)}</p>
                      )}
                    </div>
                    <StatusBadge status={t.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};

export default MyTasks;
