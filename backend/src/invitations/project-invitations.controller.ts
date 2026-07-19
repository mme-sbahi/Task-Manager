import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProjectMemberGuard } from '../projects/guards/project-member.guard';
import { ProjectOwnerGuard } from '../projects/guards/project-owner.guard';
import { InvitationsService } from './invitations.service';
import { InviteMembersDto } from './dto/invite-members.dto';

@ApiTags('invitations')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, ProjectMemberGuard, ProjectOwnerGuard)
@Controller('projects/:id/invitations')
export class ProjectInvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Invite people by email (must be OWNER or ADMIN)',
    description:
      'Creates a PENDING invitation for each email — this does NOT add ' +
      'them to the project. They must accept via POST /invitations/:id/accept ' +
      'before a membership is created. One bad email does not block the rest ' +
      'of the batch.',
  })
  invite(
    @Param('id', ParseUUIDPipe) projectId: string,
    @CurrentUser('userId') invitedById: string,
    @Body() dto: InviteMembersDto,
  ) {
    return this.invitationsService.inviteMembers(projectId, invitedById, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Invitation history for this project (must be OWNER or ADMIN)' })
  findAll(@Param('id', ParseUUIDPipe) projectId: string) {
    return this.invitationsService.findAllForProject(projectId);
  }
}
