import { Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { InvitationsService } from './invitations.service';

@ApiTags('invitations')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Pending invitations waiting on the current user' })
  findMyPending(@CurrentUser('userId') userId: string) {
    return this.invitationsService.findPendingForUser(userId);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: 'Accept an invitation (creates the membership)' })
  accept(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.invitationsService.accept(id, userId);
  }

  @Post(':id/decline')
  @ApiOperation({ summary: 'Decline an invitation' })
  decline(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.invitationsService.decline(id, userId);
  }
}
