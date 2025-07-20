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
    try {
      // Get all tasks with their project information
      let query = this.taskRepository.createQueryBuilder('task')
        .leftJoinAndSelect('task.project', 'project')
        .where('task.isDeleted = :isDeleted', { isDeleted: false })
        .andWhere('project.isDeleted = :projectIsDeleted', { projectIsDeleted: false });

      // If user is not admin, only get tasks assigned to them
      if (currentUser.role !== UserRole.ADMIN) {
        query = query.andWhere('task.assignedToId = :userId', { userId: currentUser.id });
      }

      const tasks = await query.getMany();

      // Group tasks by project
      const projectMap = new Map();
      
      tasks.forEach(task => {
        const projectName = task.project?.name || 'Unassigned';
        
        if (!projectMap.has(projectName)) {
          projectMap.set(projectName, {
            projectName,
            totalTasks: 0,
            completedTasks: 0,
            completionRate: 0
          });
        }
        
        const projectStat = projectMap.get(projectName);
        projectStat.totalTasks++;
        
        if (task.status === TaskStatus.DONE) {
          projectStat.completedTasks++;
        }
      });

      // Calculate completion rates and convert to array
      const projectStats = Array.from(projectMap.values()).map(stat => ({
        ...stat,
        completionRate: stat.totalTasks > 0 ? (stat.completedTasks / stat.totalTasks) * 100 : 0
      }));

      // Sort by total tasks descending
      return projectStats.sort((a, b) => b.totalTasks - a.totalTasks);
    } catch (error) {
      console.error('Error in getProjectStats:', error);
      return [];
    }
  }
} 