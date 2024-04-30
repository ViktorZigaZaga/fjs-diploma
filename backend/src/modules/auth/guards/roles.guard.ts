import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { roleEnum } from 'src/enums/roleEnum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<roleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (!roles.includes(request.user.role)) {
      throw new ForbiddenException('Отсутствуют права доступа');
    }
    return true;
  }
}