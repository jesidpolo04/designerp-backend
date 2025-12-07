import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { PermissionType } from '../entities/permission.entity';

export class CreatePermissionDto {
  @ApiProperty({ 
    example: 'read', 
    enum: PermissionType,
    description: 'Type of permission: read, write, manage, or delete'
  })
  @IsEnum(PermissionType)
  @IsNotEmpty()
  permissionType: PermissionType;

  @ApiProperty({ example: 1, description: 'Feature ID' })
  @IsInt()
  @IsNotEmpty()
  featureId: number;

  @ApiProperty({ example: true, required: false, default: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
