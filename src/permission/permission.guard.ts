import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requirePermission = this.reflector.getAllAndOverride<string[]>('requirePermission', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requirePermission) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('用户无权限访问');
    }
    // 超级管理员
    if (user.roles?.some((role) => role.admin)) {
      return true;
    }
    // 普通用户
    const permission = user.permissions.find((permission) => requirePermission.includes(permission.code));
    if (!permission) {
      throw new UnauthorizedException('用户无权限访问');
    }
    return true;
  }
}
