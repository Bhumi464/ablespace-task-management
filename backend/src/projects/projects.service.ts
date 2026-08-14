import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from './project.entity';
import { CreateProjectDto } from './create-project.dto';
import { UpdateProjectDto } from './update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    const project =
      this.projectRepository.create(
        createProjectDto,
      );

    return this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Project> {
    const project =
      await this.projectRepository.findOne({
        where: { id },
      });

    if (!project) {
      throw new NotFoundException(
        `Project with ID ${id} not found`,
      );
    }

    return project;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project =
      await this.findOne(id);

    Object.assign(
      project,
      updateProjectDto,
    );

    return this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project =
      await this.findOne(id);

    await this.projectRepository.remove(project);
  }
}