import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { DateTime } from "luxon";
import { luxonTransformer } from "@/database/transformers/luxon.transformer";
import { Genre } from "./genre";
import { Rol } from "./rol";

@Entity({ name: "users" })
export class User {
  @PrimaryColumn({ type: "varchar", length: 7 })
  id: string;

  @Column({ type: "varchar", name: "first_name", length: 40 })
  firstName: string;

  @Column({ type: "varchar", name: "second_name", length: 40 })
  secondName: string;

  @Column({ type: "varchar", name: "first_lastname", length: 50 })
  firstLastname: string;

  @Column({ type: "varchar", name: "second_lastname", length: 50 })
  secondLastname: string;

  @Column({ type: "varchar", length: 50 })
  username: string;

  @Column({ type: "varchar", length: 150 })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

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

  @ManyToOne(() => Genre)
  @JoinColumn({ name: "genre_id" })
  genre: Genre;

  @ManyToOne(() => Rol)
  @JoinColumn({ name: "rol_id" })
  rol: Rol;

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
