import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TaskStatus } from '@/common/enums/task-status.enum';
import { Project } from '@/modules/projects/entities/project.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.BACKLOG,
  })
  status: TaskStatus;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'uuid', nullable: true })
  assignedToId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Project, (project) => project.tasks)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(() => User, (user) => user.assignedTasks)
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: User;
} 