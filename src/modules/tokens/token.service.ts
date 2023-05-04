import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

import { IConfigService } from '../config/config.service';
import { User } from '../users';
import { Token, Tokens } from 'src/common';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: IConfigService,
  ) {}

  hashToken(token: string): string {
    return bcrypt.hashSync(token, 10);
  }

  async compareTokens(token: string, token2: string): Promise<boolean> {
    return await bcrypt.compare(token, token2);
  }

  async getTokens(user: User): Promise<Tokens> {
    const userId = user._id.toString();
    const username = user.username;
    const accessSecret = this.configService.getJwtAccessSecret();
    const refreshSecret = this.configService.getJwtRefreshSecret();
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          roles: user.roles,
        },
        {
          secret: accessSecret,
          expiresIn: '20m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          roles: user.roles,
        },
        {
          secret: refreshSecret,
          expiresIn: '7d',
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  storeTokensInCookie(res: Response, tokens: Tokens) {
    res.cookie(Token.ACCESS_TOKEN, tokens.accessToken, {
      maxAge: 1000 * 60 * 20, // 15 min
      httpOnly: true,
      sameSite: 'strict',
    });
    res.cookie(Token.REFRESH_TOKEN, tokens.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      sameSite: 'strict',
    });
  }

  clearTokensInCookie(res: Response) {
    res.clearCookie(Token.ACCESS_TOKEN);
    res.clearCookie(Token.REFRESH_TOKEN);
  }
}
