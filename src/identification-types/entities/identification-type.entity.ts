import { DateTime } from 'luxon';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'identification_types' })
export class IdentificationType {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true, length: 50 })
  type: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: DateTime;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: DateTime;
}
