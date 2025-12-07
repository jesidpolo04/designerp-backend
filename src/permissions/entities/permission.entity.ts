import { DateTime } from 'luxon';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Feature } from '../../features/entities/feature.entity';

export enum PermissionType {
  READ = 'read',
  WRITE = 'write',
  MANAGE = 'manage',
  DELETE = 'delete',
}

@Entity({ name: 'permissions' })
export class Permission {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'permission_type',
  })
  permissionType: PermissionType;

  @ManyToOne(() => Feature, { eager: true, nullable: false })
  @JoinColumn({ name: 'feature_id' })
  feature: Feature;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: DateTime;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: DateTime;
}
