import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, AddMemberDto } from './projects.schema';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProjectDto, userId: string) {
    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        members: { create: { user: { connect: { id: userId } }, role: 'OWNER' } },
      },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.project.findMany({
      where: { members: { some: { userId } } },
      include: { members: { select: { id: true, userId: true, role: true, user: { select: { id: true, name: true, email: true } } } } },
    });
  }

  async findOne(projectId: string, userId: string) {
    await this.assertMember(projectId, userId);
    return this.prisma.project.findUnique({
      where: { id: projectId },
      include: { members: { select: { id: true, userId: true, role: true, user: { select: { id: true, name: true, email: true } } } } },
    });
  }

  async addMember(projectId: string, dto: AddMemberDto, requesterId: string) {
    await this.assertOwner(projectId, requesterId);

    const userExists = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!userExists) throw new NotFoundException('User not found');

    const already = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: dto.userId } },
    });
    if (already) throw new ConflictException('User already a member');

    return this.prisma.projectMember.create({ data: { projectId, userId: dto.userId } });
  }

  async removeMember(projectId: string, userId: string, requesterId: string) {
    await this.assertOwner(projectId, requesterId);
    const member = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
    if (!member) throw new NotFoundException('Member not found');
    return this.prisma.projectMember.delete({ where: { id: member.id } });
  }

  async assertMember(projectId: string, userId: string) {
    const member = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
    if (!member) throw new ForbiddenException('Not a project member');
    return member;
  }

  private async assertOwner(projectId: string, userId: string) {
    const member = await this.assertMember(projectId, userId);
    if (member.role !== 'OWNER') throw new ForbiddenException('Only owners can manage members');
  }
}
