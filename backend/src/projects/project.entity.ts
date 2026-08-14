import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column()
  priority: string;

  @Column()
  lead: string;

  @Column()
  dueDate: string;

  @Column('simple-array', { default: '' })
  members: string[];
}