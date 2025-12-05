import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from "typeorm";
import { DateTime } from "luxon";
import { luxonTransformer } from "@/database/transformers/luxon.transformer";

@Entity({ name: "permissions" })
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100, unique: true })
  name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  description: string | null;

  @Column({ type: "boolean", default: true })
  active: boolean;

  @Column({
    name: "created_at",
    type: "timestamp",
    transformer: luxonTransformer,
  })
  createdAt: DateTime;

  @Column({
    name: "updated_at",
    type: "timestamp",
    transformer: luxonTransformer,
  })
  updatedAt: DateTime;

  @BeforeInsert()
  setCreationDate() {
    this.createdAt = DateTime.now();
    this.updatedAt = DateTime.now();
  }

  @BeforeUpdate()
  setUpdateDate() {
    this.updatedAt = DateTime.now();
  }
}
