import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAllTasks } from '@/hooks/useAllTasks';
import { useAuthStore } from '@/store/auth.store';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { CardGridSkeleton, StatCardSkeleton } from '@/components/Skeletons';
import { Activity, CheckCircle2, Circle, FolderKanban, ListTodo, Timer, TrendingUp } from 'lucide-react';
import { timeAgo } from '@/lib/task-utils';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);
  const { projects, tasks, isLoading } = useAllTasks();

  const stats = useMemo(() => {
    const todo = tasks.filter((t) => t.status === 'TODO').length;
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const done = tasks.filter((t) => t.status === 'DONE').length;
    return { todo, inProgress, done };
  }, [tasks]);

  const recent = useMemo(
    () =>
      [...tasks]
        .filter((t) => t.createdAt)
        .sort((a, b) => +new Date(b.createdAt!) - +new Date(a.createdAt!))
        .slice(0, 6),
    [tasks],
  );

  const cards = [
    { label: 'Total projects', value: projects.length, icon: FolderKanban, color: 'text-primary bg-primary-soft' },
    { label: 'Total tasks', value: tasks.length, icon: ListTodo, color: 'text-primary bg-primary-soft' },
    { label: 'To Do', value: stats.todo, icon: Circle, color: 'text-muted-foreground bg-muted' },
    { label: 'In Progress', value: stats.inProgress, icon: Timer, color: 'text-warning bg-warning/10' },
    { label: 'Done', value: stats.done, icon: CheckCircle2, color: 'text-success bg-success/10' },
  ];

  return (
    <div className="container py-8 max-w-7xl">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your work today.</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-8">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
          : cards.map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-elegant hover:-translate-y-0.5 transition-smooth animate-fade-in"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {c.label}
                  </span>
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', c.color)}>
                    <c.icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-3xl font-bold mt-3">{c.value}</p>
              </div>
            ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Recent activity</h2>
            </div>
          </div>
          {isLoading ? (
            <CardGridSkeleton count={3} />
          ) : recent.length === 0 ? (
            <EmptyState icon={Activity} title="No recent activity" description="Tasks you create will appear here." />
          ) : (
            <ul className="space-y-2">
              {recent.map((t) => (
                <li key={t.id}>
                  <Link
                    to={`/projects/${t.projectId}/tasks`}
                    className="flex items-center justify-between gap-3 rounded-lg p-3 hover:bg-muted transition-smooth group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate group-hover:text-primary transition-smooth">
                        {t.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {(t as any).projectName} · {timeAgo(t.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={t.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Progress</h2>
          </div>
          {(() => {
            const total = tasks.length || 1;
            const pct = Math.round((stats.done / total) * 100);
            return (
              <>
                <p className="text-4xl font-bold text-gradient">{pct}%</p>
                <p className="text-sm text-muted-foreground mt-1">of all tasks completed</p>
                <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full gradient-primary transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-6 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">To Do</span><span className="font-semibold">{stats.todo}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">In Progress</span><span className="font-semibold">{stats.inProgress}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Done</span><span className="font-semibold">{stats.done}</span></div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
