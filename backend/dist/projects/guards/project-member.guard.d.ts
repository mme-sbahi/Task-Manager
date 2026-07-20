import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProjectMember } from '../entities/project-member.entity';
export declare class ProjectMemberGuard implements CanActivate {
    private readonly membersRepository;
    constructor(membersRepository: Repository<ProjectMember>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
