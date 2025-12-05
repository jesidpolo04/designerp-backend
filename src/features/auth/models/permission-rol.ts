import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { DateTime } from "luxon";
import { luxonTransformer } from "@/database/transformers/luxon.transformer";
import { Permission } from "./permission";
import { Rol } from "./rol";

@Entity({ name: "permission_rol" })
export class PermissionRol {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Permission, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "permission_id" })
  permission: Permission;

  @ManyToOne(() => Rol, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "rol_id" })
  rol: Rol;

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
