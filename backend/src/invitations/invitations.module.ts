import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectInvitation } from './entities/project-invitation.entity';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { ProjectInvitationsController } from './project-invitations.controller';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectInvitation]),
    ProjectsModule,
    UsersModule,
  ],
  controllers: [ProjectInvitationsController, InvitationsController],
  providers: [InvitationsService],
})
export class InvitationsModule {}
