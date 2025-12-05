import { DateTime } from 'luxon';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'features' })
export class Feature {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ name: 'url_icono', length: 500, nullable: true })
  urlIcono?: string;

  @Column({ default: true, name: 'is_active' })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: DateTime;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: DateTime;
}
