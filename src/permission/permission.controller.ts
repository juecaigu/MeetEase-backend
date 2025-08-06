import { Controller, Get, Inject, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { SetMetadata } from '@nestjs/common';

@SetMetadata('requireLogin', true)
@Controller('permission')
export class PermissionController {
  @Inject(PermissionService)
  private readonly permissionService: PermissionService;

  @SetMetadata('requirePermission', ['permission:list'])
  @Get('list')
  list(@Query('id') id: number) {
    return this.permissionService.list(id);
  }
}
