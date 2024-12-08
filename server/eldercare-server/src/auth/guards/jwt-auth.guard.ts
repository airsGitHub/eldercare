import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.debug('Checking JWT authentication');
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    this.logger.debug(`JWT auth result - User: ${JSON.stringify(user)}, Error: ${err}, Info: ${info}`);
    
    if (err || !user) {
      this.logger.error(`JWT authentication failed: ${err?.message || 'No user found'}`);
      throw err || new UnauthorizedException('认证失败');
    }
    
    this.logger.debug('JWT authentication successful');
    return user;
  }
}
