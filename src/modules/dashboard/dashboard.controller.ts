import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/modules/users/entities/user.entity';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getTaskStats(@CurrentUser() currentUser: User) {
    return this.dashboardService.getTaskStats(currentUser);
  }

  @Get('tasks-over-time')
  getTasksOverTime(
    @CurrentUser() currentUser: User,
    @Query('days') days?: string,
  ) {
    const daysNumber = days ? parseInt(days) : 30;
    return this.dashboardService.getTasksOverTime(currentUser, daysNumber);
  }

  @Get('project-stats')
  getProjectStats(@CurrentUser() currentUser: User) {
    return this.dashboardService.getProjectStats(currentUser);
  }
} 