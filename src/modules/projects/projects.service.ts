import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectUser } from './entities/project-user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddResourceDto } from './dto/add-resource.dto';
import { RemoveResourceDto } from './dto/remove-resource.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectUser)
    private projectUserRepository: Repository<ProjectUser>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [projects, total] = await this.projectRepository.findAndCount({
      where: { isDeleted: false },
      relations: ['tasks'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      projects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['tasks', 'tasks.assignedTo', 'projectUsers', 'projectUsers.user'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    project.isDeleted = true;
    await this.projectRepository.save(project);
  }

  async addResources(projectId: string, addResourceDto: AddResourceDto): Promise<Project> {
    const project = await this.findOne(projectId);
    
    for (const userId of addResourceDto.userIds) {
      // Check if user is already assigned to this project
      const existingAssignment = await this.projectUserRepository.findOne({
        where: { projectId, userId, isDeleted: false },
      });

      if (existingAssignment) {
        throw new ConflictException(`User ${userId} is already assigned to this project`);
      }

      // Create new project-user assignment
      const projectUser = this.projectUserRepository.create({
        projectId,
        userId,
      });

      await this.projectUserRepository.save(projectUser);
    }

    return this.findOne(projectId);
  }

  async removeResource(projectId: string, removeResourceDto: RemoveResourceDto): Promise<Project> {
    const project = await this.findOne(projectId);
    
    const projectUser = await this.projectUserRepository.findOne({
      where: { projectId, userId: removeResourceDto.userId, isDeleted: false },
    });

    if (!projectUser) {
      throw new NotFoundException('User is not assigned to this project');
    }

    projectUser.isDeleted = true;
    await this.projectUserRepository.save(projectUser);

    return this.findOne(projectId);
  }

  async getProjectResources(projectId: string) {
    const projectUsers = await this.projectUserRepository.find({
      where: { projectId, isDeleted: false },
      relations: ['user'],
    });

    return projectUsers.map(pu => pu.user);
  }
} 