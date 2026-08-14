import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './task.entity';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const task =
      this.taskRepository.create(
        createTaskDto,
      );

    return this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Task> {
    const task =
      await this.taskRepository.findOne({
        where: { id },
      });

    if (!task) {
      throw new NotFoundException(
        `Task with ID ${id} not found`,
      );
    }

    return task;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task =
      await this.findOne(id);

    Object.assign(
      task,
      updateTaskDto,
    );

    return this.taskRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const task =
      await this.findOne(id);

    await this.taskRepository.remove(task);
  }
}