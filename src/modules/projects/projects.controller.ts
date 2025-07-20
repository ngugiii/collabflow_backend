import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddResourceDto } from './dto/add-resource.dto';
import { RemoveResourceDto } from './dto/remove-resource.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.projectsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Post(':id/resources')
  addResources(@Param('id') id: string, @Body() addResourceDto: AddResourceDto) {
    return this.projectsService.addResources(id, addResourceDto);
  }

  @Delete(':id/resources')
  removeResource(@Param('id') id: string, @Body() removeResourceDto: RemoveResourceDto) {
    return this.projectsService.removeResource(id, removeResourceDto);
  }

  @Get(':id/resources')
  getProjectResources(@Param('id') id: string) {
    return this.projectsService.getProjectResources(id);
  }
} 