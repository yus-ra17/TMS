import { z } from 'zod';

export const CreateTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  assigneeId: z.string().uuid().optional(),
});

export const UpdateTaskStatusSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
});

export const AssignTaskSchema = z.object({
  assigneeId: z.string().uuid(),
});

export const TaskQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
});

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskStatusDto = z.infer<typeof UpdateTaskStatusSchema>;
export type AssignTaskDto = z.infer<typeof AssignTaskSchema>;
export type TaskQueryDto = z.infer<typeof TaskQuerySchema>;
