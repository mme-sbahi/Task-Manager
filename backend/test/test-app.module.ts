import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { ProjectsModule } from '../src/projects/projects.module';
import { TasksModule } from '../src/tasks/tasks.module';
import { DashboardModule } from '../src/dashboard/dashboard.module';
import { InvitationsModule } from '../src/invitations/invitations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.test' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST', 'localhost'),
        port: config.get<number>('DATABASE_PORT', 5432),
        username: config.get<string>('DATABASE_USER', 'taskflow'),
        password: config.get<string>('DATABASE_PASSWORD', 'taskflow_password'),
        database: config.get<string>('DATABASE_NAME', 'taskflow_test'),
        autoLoadEntities: true,
        dropSchema: true,
        synchronize: true,
        logging: false,
      }),
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    TasksModule,
    DashboardModule,
    InvitationsModule,
  ],
})
export class TestAppModule {}
