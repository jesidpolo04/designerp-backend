import { luxonTransformer } from "@/database/transformers/luxon.transformer";
import { DateTime } from "luxon";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";

@Entity("students")
export class Student {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ name: "first_name", type: "varchar", length: 100, nullable: false })
  firstName: string;

  @Column({
    name: "second_name",
    type: "varchar",
    length: 100,
    nullable: true,
  })
  secondName: string | null;

  @Column({ name: "last_name", type: "varchar", length: 100, nullable: false })
  lastName: string;

  @Column({
    name: "second_last_name",
    type: "varchar",
    length: 100,
    nullable: true,
  })
  secondLastName: string | null;

  @Column({
    name: "is_retired",
    type: "boolean",
    default: false,
    nullable: false,
  })
  isRetired: boolean;

  @Column({
    name: "created_at",
    type: "timestamp",
    nullable: false,
    transformer: luxonTransformer,
  })
  createdAt: DateTime;

  @Column({
    name: "updated_at",
    type: "timestamp",
    nullable: false,
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
