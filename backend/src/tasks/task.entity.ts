import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column()
  status: string;

  @Column()
  priority: string;

  @Column()
  member: string;

  @Column()
  dueDate: string;

  @Column('simple-array', { default: '' })
  labels: string[];

  @Column()
  team: string;
}