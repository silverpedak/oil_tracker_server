import { Response } from 'express';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos';
import {
  AccessTokenGuard,
  AuthenticatedRequest,
  RefreshTokenGuard,
} from '../../common';
import { CreateUserDto, User, UsersService } from '../users';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor) // removes password from response object
  @Post('/signup')
  async signUp(@Body() signUpDto: CreateUserDto): Promise<User> {
    return this.userService.create(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.login(loginDto, res);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/logout')
  async logout(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user.sub;
    await this.authService.logout(userId, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  async refreshTokens(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user.sub;
    const refreshToken = req.cookies.refresh_token;
    await this.authService.refreshTokens(userId, refreshToken, res);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
