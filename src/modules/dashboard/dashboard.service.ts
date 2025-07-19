import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '@/modules/tasks/entities/task.entity';
import { TaskStatus } from '@/common/enums/task-status.enum';
import { UserRole } from '@/common/enums/user-role.enum';
import { User } from '@/modules/users/entities/user.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getTaskStats(currentUser: User) {
    let query = this.taskRepository.createQueryBuilder('task')
      .where('task.isDeleted = :isDeleted', { isDeleted: false });

    // If user is not admin, only count tasks assigned to them
    if (currentUser.role !== UserRole.ADMIN) {
      query = query.andWhere('task.assignedToId = :userId', { userId: currentUser.id });
    }

    const stats = await query
      .select('task.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('task.status')
      .getRawMany();

    const result = {
      backlog: 0,
      todo: 0,
      in_progress: 0,
      review: 0,
      done: 0,
    };

    stats.forEach(stat => {
      result[stat.status] = parseInt(stat.count);
    });

    return result;
  }

  async getTasksOverTime(currentUser: User, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let query = this.taskRepository.createQueryBuilder('task')
      .select('DATE(task.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('task.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('task.createdAt >= :startDate', { startDate })
      .groupBy('DATE(task.createdAt)')
      .orderBy('DATE(task.createdAt)', 'ASC');

    // If user is not admin, only count tasks assigned to them
    if (currentUser.role !== UserRole.ADMIN) {
      query = query.andWhere('task.assignedToId = :userId', { userId: currentUser.id });
    }

    return query.getRawMany();
  }

  async getProjectStats(currentUser: User) {
    let query = this.taskRepository.createQueryBuilder('task')
      .leftJoin('task.project', 'project')
      .select('project.name', 'projectName')
      .addSelect('COUNT(*)', 'totalTasks')
      .addSelect('SUM(CASE WHEN task.status = :doneStatus THEN 1 ELSE 0 END)', 'completedTasks')
      .where('task.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('project.isDeleted = :projectIsDeleted', { projectIsDeleted: false })
      .setParameter('doneStatus', TaskStatus.DONE)
      .groupBy('project.id, project.name')
      .orderBy('totalTasks', 'DESC');

    // If user is not admin, only count tasks assigned to them
    if (currentUser.role !== UserRole.ADMIN) {
      query = query.andWhere('task.assignedToId = :userId', { userId: currentUser.id });
    }

    const projectStats = await query.getRawMany();

    return projectStats.map(stat => ({
      projectName: stat.projectName,
      totalTasks: parseInt(stat.totalTasks),
      completedTasks: parseInt(stat.completedTasks),
      completionRate: stat.totalTasks > 0 ? (parseInt(stat.completedTasks) / parseInt(stat.totalTasks)) * 100 : 0,
    }));
  }
} 