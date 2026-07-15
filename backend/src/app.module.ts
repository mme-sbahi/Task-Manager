import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST', 'localhost'),
        port: config.get<number>('DATABASE_PORT', 5432),
        username: config.get<string>('DATABASE_USER', 'taskflow'),
        password: config.get<string>('DATABASE_PASSWORD', 'taskflow_password'),
        database: config.get<string>('DATABASE_NAME', 'taskflow_db'),
        autoLoadEntities: true,
        // Fine for Day 1-2 development; replace with migrations before prod.
        synchronize: true,
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),
    AuthModule,
    UsersModule,
    // ProjectsModule, TasksModule, CommentsModule land on Day 2
  ],
})
export class AppModule {}
