import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';
import { CreateTaskDto, UpdateTaskStatusDto, AssignTaskDto, TaskQueryDto } from './tasks.schema';

const TASK_SELECT = {
  id: true,
  title: true,
  description: true,
  status: true,
  projectId: true,
  createdAt: true,
  updatedAt: true,
  assignee: { select: { id: true, name: true, email: true } },
  creator: { select: { id: true, name: true, email: true } },
};

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private projectsService: ProjectsService,
  ) {}

  async create(projectId: string, dto: CreateTaskDto, userId: string) {
    await this.projectsService.assertMember(projectId, userId);

    if (dto.assigneeId) {
      await this.projectsService.assertMember(projectId, dto.assigneeId);
    }

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        assigneeId: dto.assigneeId ?? null,
        projectId,
        creatorId: userId,
      },
      select: TASK_SELECT,
    });
  }

  async findAll(projectId: string, userId: string, query: TaskQueryDto) {
    await this.projectsService.assertMember(projectId, userId);

    const { page, limit, status } = query;
    const skip = (page - 1) * limit;
    const where = { projectId, ...(status && { status }) };

    const [tasks, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({ where, skip, take: limit, select: TASK_SELECT, orderBy: { createdAt: 'desc' } }),
      this.prisma.task.count({ where }),
    ]);

    return { data: tasks, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateStatus(taskId: string, dto: UpdateTaskStatusDto, userId: string) {
    const task = await this.getTaskOrThrow(taskId);

    if (task.assigneeId !== userId) {
      throw new ForbiddenException('Only the assigned user can update task status');
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: { status: dto.status },
      select: TASK_SELECT,
    });
  }

  async assignTask(taskId: string, dto: AssignTaskDto, userId: string) {
    const task = await this.getTaskOrThrow(taskId);
    await this.projectsService.assertMember(task.projectId, userId);

    // Only the task creator or project owner can assign/reassign a task
    const member = await this.projectsService.assertMember(task.projectId, userId);
    const isOwner = member.role === 'OWNER';
    const isCreator = task.creatorId === userId;

    if (!isOwner && !isCreator) {
      throw new ForbiddenException('Only the task creator or project owner can assign tasks');
    }

    await this.projectsService.assertMember(task.projectId, dto.assigneeId);

    return this.prisma.task.update({
      where: { id: taskId },
      data: { assigneeId: dto.assigneeId },
      select: TASK_SELECT,
    });
  }

  async delete(taskId: string, userId: string) {
    const task = await this.getTaskOrThrow(taskId);
    await this.projectsService.assertMember(task.projectId, userId);
    return this.prisma.task.delete({ where: { id: taskId } });
  }

  private async getTaskOrThrow(taskId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }
}
