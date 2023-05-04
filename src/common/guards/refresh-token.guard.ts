import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedRequest } from '../models';
import { IConfigService } from 'src/modules/config/config.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: IConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const refreshToken = request.cookies.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('missing refresh_token');
    }
    try {
      request.user = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getJwtRefreshSecret(),
      });
    } catch {
      throw new UnauthorizedException('unauthorized refresh JWT');
    }
    return true;
  }
}
