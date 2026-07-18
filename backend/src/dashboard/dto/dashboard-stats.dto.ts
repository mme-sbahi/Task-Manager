import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsDto {
  @ApiProperty({ example: 4, description: 'Projects the user belongs to' })
  totalProjects: number;

  @ApiProperty({ example: 37, description: 'Tasks across all of those projects' })
  totalTasks: number;

  @ApiProperty({ example: 21 })
  tasksCompleted: number;

  @ApiProperty({ example: 9 })
  tasksInProgress: number;

  @ApiProperty({ example: 3, description: 'Not-yet-done tasks due today' })
  tasksDueToday: number;

  @ApiProperty({ example: 2, description: 'Not-yet-done tasks past their due date' })
  overdueCount: number;
}
