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
import { Rol } from '../../roles/entities/rol.entity';
import { Genre } from '../../genres/entities/genre.entity';
import { Department } from '../../departments/entities/department.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true, length: 120 })
  username: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', name: 'second_name', length: 100, nullable: true })
  secondName?: string | null;

  @Column({ name: 'first_lastname', length: 100 })
  firstLastname: string;

  @Column({ type: 'varchar', name: 'second_lastname', length: 100, nullable: true })
  secondLastname?: string | null;

  @Column({ unique: true, length: 255, name: 'email' })
  email: string;

  @ManyToOne(() => Rol, { eager: true, nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Rol;

  @ManyToOne(() => Genre, { eager: true, nullable: false })
  @JoinColumn({ name: 'genre_id' })
  genre: Genre;

  @ManyToOne(() => Department, { eager: true, nullable: true })
  @JoinColumn({ name: 'department_id' })
  department?: Department | null;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: DateTime;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: DateTime;
}
