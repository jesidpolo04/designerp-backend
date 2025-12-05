import { DateTime } from 'luxon';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'roles' })
export class Rol {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ unique: true, length: 120 })
  name!: string;

  @Column({ nullable: true, length: 255 })
  description?: string;

  @Column({ default: true, name: 'is_active' })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: DateTime;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: DateTime;
}
