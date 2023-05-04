import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators';
import { JwtService } from '@nestjs/jwt';

import { Role } from '../enums';
import { IConfigService } from 'src/modules/config/config.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: IConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.access_token;
    if (!token) {
      throw new UnauthorizedException('missing access_token');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getJwtAccessSecret(),
      });
      return requiredRoles.some((role) => payload?.roles?.includes(role));
    } catch {
      throw new UnauthorizedException('unauthorized access_token');
    }
  }
}
