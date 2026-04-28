import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  CreateTaskSchema, UpdateTaskStatusSchema, AssignTaskSchema, TaskQuerySchema,
  CreateTaskDto, UpdateTaskStatusDto, AssignTaskDto,
} from './tasks.schema';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@UseGuards(JwtAuthGuard)
@Controller()
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post('projects/:projectId/tasks')
  create(
    @Param('projectId') projectId: string,
    @Body(new ZodValidationPipe(CreateTaskSchema)) dto: CreateTaskDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.create(projectId, dto, user.id);
  }

  @Get('projects/:projectId/tasks')
  findAll(
    @Param('projectId') projectId: string,
    @Query() query: any,
    @CurrentUser() user: any,
  ) {
    const parsed = TaskQuerySchema.parse(query);
    return this.tasksService.findAll(projectId, user.id, parsed);
  }

  @Patch('tasks/:taskId/status')
  updateStatus(
    @Param('taskId') taskId: string,
    @Body(new ZodValidationPipe(UpdateTaskStatusSchema)) dto: UpdateTaskStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.updateStatus(taskId, dto, user.id);
  }

  @Patch('tasks/:taskId/assign')
  assignTask(
    @Param('taskId') taskId: string,
    @Body(new ZodValidationPipe(AssignTaskSchema)) dto: AssignTaskDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.assignTask(taskId, dto, user.id);
  }

  @Delete('tasks/:taskId')
  delete(@Param('taskId') taskId: string, @CurrentUser() user: any) {
    return this.tasksService.delete(taskId, user.id);
  }
}
