import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAllTasks } from '@/hooks/useAllTasks';
import { useAuthStore } from '@/store/auth.store';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { CardGridSkeleton } from '@/components/Skeletons';
import { CheckSquare, FolderKanban, UserCheck, UserPlus } from 'lucide-react';
import { timeAgo } from '@/lib/task-utils';

const TaskList = ({ tasks }: { tasks: any[] }) => (
  <div className="space-y-4">
    {tasks.map((group) => (
      <section key={group.projectId} className="rounded-2xl border border-border bg-card p-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <FolderKanban className="h-4 w-4" />
          </div>
          <h2 className="font-semibold">{group.name}</h2>
          <span className="text-xs text-muted-foreground">({group.tasks.length})</span>
        </div>
        <ul className="divide-y divide-border">
          {group.tasks.map((t: any) => (
            <li key={t.id}>
              <Link
                to={`/projects/${t.projectId}/tasks`}
                className="flex items-center justify-between gap-3 py-3 hover:bg-muted/50 -mx-3 px-3 rounded-lg transition-smooth group"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate group-hover:text-primary transition-smooth">{t.title}</p>
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
);

const groupByProject = (tasks: any[]) => {
  const map = new Map<string, { name: string; projectId: string; tasks: any[] }>();
  tasks.forEach((t) => {
    if (!map.has(t.projectId)) map.set(t.projectId, { name: t.projectName ?? 'Project', projectId: t.projectId, tasks: [] });
    map.get(t.projectId)!.tasks.push(t);
  });
  return Array.from(map.values());
};

const MyTasks = () => {
  const user = useAuthStore((s) => s.user);
  const { tasks, isLoading } = useAllTasks();

  const assignedToMe = useMemo(() =>
    tasks.filter((t) => (t.assigneeId ?? t.assignee?.id) === user?.id),
    [tasks, user]);

  const assignedByMe = useMemo(() =>
    tasks.filter((t) =>
      (t.creatorId === user?.id || t.creator?.id === user?.id) &&
      (t.assigneeId ?? t.assignee?.id) !== user?.id &&
      (t.assigneeId ?? t.assignee?.id) != null
    ),
    [tasks, user]);

  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
        <p className="text-muted-foreground mt-1">Tasks assigned to you and tasks you've assigned to others.</p>
      </div>

      {isLoading && <CardGridSkeleton count={3} />}

      {!isLoading && (
        <div className="space-y-10">
          {/* Assigned to me */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <UserCheck className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-semibold">Assigned to me</h2>
              <span className="text-sm text-muted-foreground">({assignedToMe.length})</span>
            </div>
            {assignedToMe.length === 0 ? (
              <EmptyState icon={CheckSquare} title="No tasks assigned to you" description="When teammates assign you tasks, they'll show up here." />
            ) : (
              <TaskList tasks={groupByProject(assignedToMe)} />
            )}
          </div>

          {/* Assigned by me */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <UserPlus className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-semibold">Assigned by me</h2>
              <span className="text-sm text-muted-foreground">({assignedByMe.length})</span>
            </div>
            {assignedByMe.length === 0 ? (
              <EmptyState icon={UserPlus} title="No tasks assigned by you" description="Tasks you assign to others will appear here." />
            ) : (
              <TaskList tasks={groupByProject(assignedByMe)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
