import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { SetMetadata } from '@nestjs/common';

@SetMetadata('requireLogin', true)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @SetMetadata('requirePermission', ['role:create'])
  @Post('create')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @SetMetadata('requirePermission', ['role:update'])
  @Post('update')
  update(@Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(updateRoleDto);
  }

  @SetMetadata('requirePermission', ['role:list'])
  @Get('list')
  list() {
    return this.roleService.list();
  }

  @SetMetadata('requirePermission', ['role:delete'])
  @Get('delete')
  delete(@Query('id') id: number) {
    return this.roleService.delete(id);
  }
}
