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
export class AccessTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: IConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const accessToken = request.cookies.access_token;
    if (!accessToken) {
      throw new UnauthorizedException('missing access_token');
    }
    try {
      request.user = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.getJwtAccessSecret(),
      });
    } catch {
      throw new UnauthorizedException('unauthorized JWT');
    }
    return true;
  }
}
