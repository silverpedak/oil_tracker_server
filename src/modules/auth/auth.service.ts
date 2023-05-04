import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { LoginDto } from './dtos';
import { TokenService } from '../tokens';
import { UsersService } from '../users';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async login(loginDto: LoginDto, res: Response) {
    const username = loginDto.username;
    const password = loginDto.password;

    const user = await this.usersService.findByUsername(username);
    // if (!user) {
    //   throw new NotFoundException('username not found');
    // }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('wrong password');
    }

    const tokens = await this.tokenService.getTokens(user);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);
    this.tokenService.storeTokensInCookie(res, tokens);
  }

  async logout(userId: string, res: Response) {
    await this.usersService.update(userId, { refreshToken: null });
    this.tokenService.clearTokensInCookie(res);
  }

  async refreshTokens(userId: string, refreshToken: string, res: Response) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('access denied');
    }
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('refreshTokens not matching');
    }
    const tokens = await this.tokenService.getTokens(user);
    await this.updateRefreshToken(userId, tokens.refreshToken);
    this.tokenService.storeTokensInCookie(res, tokens);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = this.tokenService.hashToken(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}
