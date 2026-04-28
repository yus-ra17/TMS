import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import { TaskStatus } from '../types';

export function useTasks(projectId: string) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');

  const tasksQuery = useQuery({
    queryKey: ['tasks', projectId, page, statusFilter],
    queryFn: () => tasksApi.getAll(projectId, { page, limit: 10, status: statusFilter || undefined }),
    placeholderData: keepPreviousData,
    enabled: !!projectId,
    staleTime: 30_000,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });

  const createMutation = useMutation({
    mutationFn: (data: { title: string; description?: string; assigneeId?: string }) =>
      tasksApi.create(projectId, data),
    onSuccess: invalidate,
  });

  const statusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      tasksApi.updateStatus(taskId, status),
    onSuccess: invalidate,
  });

  const assignMutation = useMutation({
    mutationFn: ({ taskId, assigneeId }: { taskId: string; assigneeId: string }) =>
      tasksApi.assign(taskId, assigneeId),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: tasksApi.delete,
    onSuccess: invalidate,
  });

  const changeFilter = (status: TaskStatus | '') => {
    setStatusFilter(status);
    setPage(1);
  };

  return {
    tasksQuery,
    page,
    setPage,
    statusFilter,
    changeFilter,
    createMutation,
    statusMutation,
    assignMutation,
    deleteMutation,
  };
}
