import { useMemo } from 'react';
import { useAllTasks } from '@/hooks/useAllTasks';
import { EmptyState } from '@/components/EmptyState';
import { CardGridSkeleton } from '@/components/Skeletons';
import { CalendarRange } from 'lucide-react';
import type { Task, TaskStatus } from '@/types';

const STATUS_BAR: Record<TaskStatus, string> = {
  TODO: 'bg-muted-foreground/40',
  IN_PROGRESS: 'bg-warning',
  DONE: 'bg-success',
};

const DAY = 24 * 60 * 60 * 1000;
const DURATION_DAYS: Record<TaskStatus, number> = { TODO: 3, IN_PROGRESS: 5, DONE: 4 };

const Timeline = () => {
  const { projects, tasks, isLoading } = useAllTasks();

  const { rows, minDate, maxDate, totalDays, dayHeaders } = useMemo(() => {
    const rows = projects.map((p) => ({
      project: p,
      tasks: tasks.filter((t) => t.projectId === p.id),
    }));

    let min = Infinity;
    let max = -Infinity;
    rows.forEach((r) =>
      r.tasks.forEach((t) => {
        if (!t.createdAt) return;
        const start = +new Date(t.createdAt);
        const end = start + DURATION_DAYS[t.status] * DAY;
        if (start < min) min = start;
        if (end > max) max = end;
      }),
    );

    if (!isFinite(min)) {
      const now = Date.now();
      min = now - 7 * DAY;
      max = now + 7 * DAY;
    } else {
      min -= DAY;
      max += DAY;
    }

    const totalDays = Math.max(14, Math.ceil((max - min) / DAY));
    const headers: { label: string; offset: number }[] = [];
    for (let i = 0; i <= totalDays; i += Math.max(1, Math.floor(totalDays / 14))) {
      const d = new Date(min + i * DAY);
      headers.push({
        label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        offset: (i / totalDays) * 100,
      });
    }

    return { rows, minDate: min, maxDate: max, totalDays, dayHeaders: headers };
  }, [projects, tasks]);

  const barFor = (t: Task) => {
    const start = t.createdAt ? +new Date(t.createdAt) : Date.now();
    const end = start + DURATION_DAYS[t.status] * DAY;
    const left = ((start - minDate) / (maxDate - minDate)) * 100;
    const width = Math.max(2, ((end - start) / (maxDate - minDate)) * 100);
    return { left: `${left}%`, width: `${width}%` };
  };

  return (
    <div className="container py-8 max-w-7xl">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Timeline</h1>
        <p className="text-muted-foreground mt-1">Gantt-style view of tasks by project.</p>
      </div>

      {isLoading && <CardGridSkeleton count={3} />}

      {!isLoading && projects.length === 0 && (
        <EmptyState icon={CalendarRange} title="Nothing to show" description="Create projects and tasks to see them on the timeline." />
      )}

      {!isLoading && projects.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4 animate-fade-in">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header */}
              <div className="flex border-b border-border pb-3 mb-2">
                <div className="w-48 shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Project
                </div>
                <div className="relative flex-1 h-5">
                  {dayHeaders.map((h, i) => (
                    <div
                      key={i}
                      className="absolute top-0 text-[10px] text-muted-foreground"
                      style={{ left: `${h.offset}%`, transform: 'translateX(-50%)' }}
                    >
                      {h.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rows */}
              {rows.map((r) => (
                <div
                  key={r.project.id}
                  className="flex items-center border-b border-border/50 py-3 hover:bg-muted/30 transition-smooth"
                >
                  <div className="w-48 shrink-0 pr-4">
                    <p className="text-sm font-semibold truncate">{r.project.name}</p>
                    <p className="text-xs text-muted-foreground">{r.tasks.length} tasks</p>
                  </div>
                  <div className="relative flex-1 h-10">
                    {r.tasks.length === 0 && (
                      <div className="absolute inset-0 flex items-center text-xs text-muted-foreground italic">
                        No tasks
                      </div>
                    )}
                    {r.tasks.map((t, idx) => {
                      const style = barFor(t);
                      const top = (idx % 3) * 12;
                      return (
                        <div
                          key={t.id}
                          className={`absolute h-2.5 rounded-full ${STATUS_BAR[t.status]} hover:scale-y-150 transition-transform cursor-pointer`}
                          style={{ ...style, top }}
                          title={`${t.title} (${t.status})`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-xs">
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-full bg-muted-foreground/40" />To Do</div>
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-full bg-warning" />In Progress</div>
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-full bg-success" />Done</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
