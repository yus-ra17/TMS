import {
  Controller, Get, Post, Delete, Body, Param, UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectSchema, AddMemberSchema, CreateProjectDto, AddMemberDto } from './projects.schema';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(CreateProjectSchema)) dto: CreateProjectDto,
    @CurrentUser() user: any,
  ) {
    return this.projectsService.create(dto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.projectsService.findAllForUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.projectsService.findOne(id, user.id);
  }

  @Post(':id/members')
  addMember(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(AddMemberSchema)) dto: AddMemberDto,
    @CurrentUser() user: any,
  ) {
    return this.projectsService.addMember(id, dto, user.id);
  }

  @Delete(':id/members/:userId')
  removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ) {
    return this.projectsService.removeMember(id, userId, user.id);
  }
}
