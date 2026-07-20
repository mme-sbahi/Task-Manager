import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { ProjectMember } from '../../projects/entities/project-member.entity';
export declare class TaskProjectMemberGuard implements CanActivate {
    private readonly tasksRepository;
    private readonly membersRepository;
    constructor(tasksRepository: Repository<Task>, membersRepository: Repository<ProjectMember>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
