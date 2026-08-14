import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'pyramid.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),

    TasksModule,
    ProjectsModule,
  ],
})
export class AppModule {}