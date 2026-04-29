import { useQueries, useQuery } from '@tanstack/react-query';
import { projectsApi } from '@/api/projects.api';
import { tasksApi } from '@/api/tasks.api';
import type { Paginated, Project, Task } from '@/types';

/**
 * Fetches all tasks across every project the user can see.
 * Uses existing per-project endpoint (no new API). Pulls a large page.
 */
export function useAllTasks() {
  const projectsQ = useQuery({ queryKey: ['projects'], queryFn: projectsApi.list });
  const projects = projectsQ.data ?? [];

  const taskQueries = useQueries({
    queries: projects.map((p) => ({
      queryKey: ['tasks', p.id, 'all'],
      queryFn: () => tasksApi.list(p.id, { page: 1, limit: 200 }),
      enabled: !!p.id,
      retry: false,
    })),
  });

  const isLoading = projectsQ.isLoading || taskQueries.some((q) => q.isLoading);
  const error = projectsQ.error || taskQueries.find((q) => q.error)?.error;

  const tasks: (Task & { projectName?: string })[] = [];
  taskQueries.forEach((q, i) => {
    const project = projects[i];
    const data = q.data as Paginated<Task> | undefined;
    console.log('project:', project?.name, 'status:', q.status, 'error:', (q.error as any)?.response?.data, 'data:', data);
    data?.data.forEach((t) => tasks.push({ ...t, projectId: project.id, projectName: project.name }));
  });

  return { projects: projects as Project[], tasks, isLoading, error };
}
