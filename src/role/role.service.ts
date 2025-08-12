import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleVo } from './vo/role.vo';
import { Permission } from 'src/permission/entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const prevRole = await this.roleRepository.findOne({ where: { name: createRoleDto.name } });
    if (prevRole) {
      throw new BadRequestException('角色名已存在');
    }
    const role = new Role();
    role.name = createRoleDto.name;
    role.description = createRoleDto.description;
    await this.roleRepository.save(role);
    return '新增成功';
  }

  async update(updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({ where: { id: updateRoleDto.id } });
    if (role) {
      role.description = updateRoleDto.description || role.description;
      // 更新权限
      const permissions = await this.permissionRepository.find({
        where: { id: In(updateRoleDto.permissions) },
      });
      role.permissions = permissions;
      role.updateTime = new Date();
      await this.roleRepository.save(role);
      return '更新成功';
    } else {
      throw new BadRequestException('角色不存在');
    }
  }

  async list() {
    const roles = await this.roleRepository.find({ relations: ['permissions'] });
    return roles.map((role) => {
      const roleVo = new RoleVo();
      roleVo.id = role.id;
      roleVo.name = role.name;
      roleVo.description = role.description;
      roleVo.admin = role.admin;
      roleVo.permissions = role.permissions;
      return roleVo;
    });
  }

  async delete(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (role) {
      if (role.admin) {
        throw new BadRequestException('超级管理员角色不能删除');
      }
      if (role.users.length > 0) {
        throw new BadRequestException('角色下有用户，不能删除');
      }
      await this.roleRepository.delete(id);
      return '删除成功';
    } else {
      throw new BadRequestException('角色不存在');
    }
  }
}
