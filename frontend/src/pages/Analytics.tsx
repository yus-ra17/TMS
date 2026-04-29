import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAllTasks } from '@/hooks/useAllTasks';
import { CardGridSkeleton } from '@/components/Skeletons';
import { EmptyState } from '@/components/EmptyState';
import { BarChart3 } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  TODO: 'hsl(var(--muted-foreground))',
  IN_PROGRESS: 'hsl(var(--warning))',
  DONE: 'hsl(var(--success))',
};

const PIE_COLORS = [
  'hsl(243 75% 58%)',
  'hsl(265 85% 65%)',
  'hsl(280 80% 70%)',
  'hsl(200 80% 55%)',
  'hsl(160 70% 45%)',
  'hsl(340 75% 60%)',
  'hsl(30 90% 55%)',
];

const Analytics = () => {
  const { projects, tasks, isLoading } = useAllTasks();

  const statusData = useMemo(() => {
    return [
      { name: 'TODO', value: tasks.filter((t) => t.status === 'TODO').length },
      { name: 'IN_PROGRESS', value: tasks.filter((t) => t.status === 'IN_PROGRESS').length },
      { name: 'DONE', value: tasks.filter((t) => t.status === 'DONE').length },
    ];
  }, [tasks]);

  const projectData = useMemo(
    () =>
      projects.map((p) => ({
        name: p.name,
        value: tasks.filter((t) => t.projectId === p.id).length,
      })).filter((d) => d.value > 0),
    [projects, tasks],
  );

  const lineData = useMemo(() => {
    const buckets = new Map<string, number>();
    tasks.forEach((t) => {
      if (!t.createdAt) return;
      const d = new Date(t.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    });
    return Array.from(buckets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-30)
      .map(([date, count]) => ({
        date: date.slice(5),
        count,
      }));
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="container py-8 max-w-7xl">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Analytics</h1>
        <CardGridSkeleton count={3} />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="container py-8 max-w-7xl">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Analytics</h1>
        <EmptyState icon={BarChart3} title="No data yet" description="Create tasks to see charts and insights here." />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-7xl">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Insights into your team's productivity.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 animate-fade-in">
          <h2 className="font-semibold mb-1">Tasks by status</h2>
          <p className="text-sm text-muted-foreground mb-4">Current distribution across all projects</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {statusData.map((s) => (
                    <Cell key={s.name} fill={STATUS_COLORS[s.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 animate-fade-in">
          <h2 className="font-semibold mb-1">Tasks per project</h2>
          <p className="text-sm text-muted-foreground mb-4">How work is distributed</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={projectData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {projectData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 animate-fade-in lg:col-span-2">
          <h2 className="font-semibold mb-1">Tasks created over time</h2>
          <p className="text-sm text-muted-foreground mb-4">Last 30 active days</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: 'hsl(var(--primary))' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
