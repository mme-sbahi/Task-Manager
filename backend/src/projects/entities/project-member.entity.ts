import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from './project.entity';
import { ProjectRole } from '../enums/project-role.enum';

// This is the many-to-many between User and Project, modeled explicitly
// (rather than a plain @ManyToMany) specifically so it can carry the `role`
// column. A user can only have one membership row per project.
@Entity('project_members')
@Unique(['projectId', 'userId'])
export class ProjectMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @ManyToOne(() => Project, (project) => project.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: ProjectRole, default: ProjectRole.MEMBER })
  role: ProjectRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
