import { z } from 'zod';
import { TaskStatus } from '../common/enums';

export const CreateTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  assigneeId: z.string().uuid().optional(),
});

export const UpdateTaskStatusSchema = z.object({
  status: z.nativeEnum(TaskStatus),
});

export const AssignTaskSchema = z.object({
  assigneeId: z.string().uuid(),
});

export const TaskQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(200).default(10),
  status: z.nativeEnum(TaskStatus).optional(),
});

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskStatusDto = z.infer<typeof UpdateTaskStatusSchema>;
export type AssignTaskDto = z.infer<typeof AssignTaskSchema>;
export type TaskQueryDto = z.infer<typeof TaskQuerySchema>;
