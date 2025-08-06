import { Injectable } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionVo } from './vo/permission.vo';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  private toVo(permission: Permission) {
    const permissionVo = new PermissionVo();
    permissionVo.id = permission.id;
    permissionVo.code = permission.code;
    permissionVo.description = permission.description;
    return permissionVo;
  }

  async list(id?: number) {
    if (id !== undefined) {
      const permission = await this.permissionRepository.findOne({ where: { id } });
      if (!permission) {
        return [];
      }
      const permissionVo = this.toVo(permission);
      return [permissionVo];
    } else {
      const permissions = await this.permissionRepository.find();
      return permissions.map((permission) => {
        const permissionVo = this.toVo(permission);
        return permissionVo;
      });
    }
  }
}
