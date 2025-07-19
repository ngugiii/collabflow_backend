import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/modules/users/entities/user.entity';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto, @CurrentUser() currentUser: User) {
    return this.tasksService.findAll(paginationDto, currentUser);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.tasksService.findOne(id, currentUser);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @CurrentUser() currentUser: User) {
    return this.tasksService.update(id, updateTaskDto, currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.tasksService.remove(id, currentUser);
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string, @CurrentUser() currentUser: User) {
    return this.tasksService.findByProject(projectId, currentUser);
  }
} 