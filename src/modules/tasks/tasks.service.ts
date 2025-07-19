import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { UserRole } from '@/common/enums/user-role.enum';
import { User } from '@/modules/users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(task);
  }

  async findAll(paginationDto: PaginationDto, currentUser: User) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    let query = this.taskRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.assignedTo', 'assignedTo')
      .where('task.isDeleted = :isDeleted', { isDeleted: false });

    // If user is not admin, only show tasks assigned to them
    if (currentUser.role !== UserRole.ADMIN) {
      query = query.andWhere('task.assignedToId = :userId', { userId: currentUser.id });
    }

    const [tasks, total] = await query
      .skip(skip)
      .take(limit)
      .orderBy('task.createdAt', 'DESC')
      .getManyAndCount();

    return {
      tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, currentUser: User): Promise<Task> {
    let query = this.taskRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.assignedTo', 'assignedTo')
      .where('task.id = :id', { id })
      .andWhere('task.isDeleted = :isDeleted', { isDeleted: false });

    // If user is not admin, only allow access to tasks assigned to them
    if (currentUser.role !== UserRole.ADMIN) {
      query = query.andWhere('task.assignedToId = :userId', { userId: currentUser.id });
    }

    const task = await query.getOne();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, currentUser: User): Promise<Task> {
    const task = await this.findOne(id, currentUser);
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const task = await this.findOne(id, currentUser);
    task.isDeleted = true;
    await this.taskRepository.save(task);
  }

  async findByProject(projectId: string, currentUser: User) {
    let query = this.taskRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedTo', 'assignedTo')
      .where('task.projectId = :projectId', { projectId })
      .andWhere('task.isDeleted = :isDeleted', { isDeleted: false });

    // For projects, show all tasks regardless of assignment (as per requirements)
    // Only apply user filter if not admin and not viewing project tasks
    if (currentUser.role !== UserRole.ADMIN) {
      // This is for the tasks page, not project tasks
      // Project tasks should show all tasks in the project
    }

    return query.orderBy('task.createdAt', 'DESC').getMany();
  }
} 