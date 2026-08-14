import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'pyramid.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),

    TasksModule,
  ],
})
export class AppModule {}