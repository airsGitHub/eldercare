import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/schemas/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    this.logger.debug(`Required roles: ${requiredRoles}`);
    this.logger.debug(`User role: ${user?.role}`);
    
    if (!user || !user.role) {
      this.logger.warn('No user or role found in request');
      return false;
    }
    
    const hasRole = requiredRoles.includes(user.role);
    this.logger.debug(`User has required role: ${hasRole}`);
    
    return hasRole;
  }
}
