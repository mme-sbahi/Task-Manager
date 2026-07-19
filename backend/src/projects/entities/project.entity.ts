import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProjectMember } from './project-member.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => ProjectMember, (member) => member.project)
  members: ProjectMember[];

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  // Virtual fields — not real columns, never persisted. Populated only when
  // ProjectsService explicitly asks for them via loadRelationCountAndMap().
  // Plain queries (e.g. TypeORM's default .find()) leave these undefined.
  memberCount?: number;
  taskCount?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
