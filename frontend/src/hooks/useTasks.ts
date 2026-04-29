import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { tasksApi } from '@/api/tasks.api';
import type { TaskStatus } from '@/types';

export function useTasks(projectId: string, page: number, status?: TaskStatus, limit = 10) {
  return useQuery({
    queryKey: ['tasks', projectId, page, status, limit],
    queryFn: () => tasksApi.list(projectId, { page, limit, status }),
    placeholderData: keepPreviousData,
    enabled: !!projectId,
  });
}
