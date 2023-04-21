import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { SignInDto, TokensDto } from './dtos';
import { AuthService } from './auth.service';
import {
  AccessTokenGuard,
  AuthenticatedRequest,
  RefreshTokenGuard,
} from '../common';
import { CreateUserDto, User, UserService } from 'src/users';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor) // removes password from response object
  @Post('/signup')
  async signUp(@Body() signUpDto: CreateUserDto): Promise<User> {
    return this.userService.create(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() signInDto: SignInDto): Promise<TokensDto> {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/logout')
  async logout(@Req() req: AuthenticatedRequest) {
    this.authService.logout(req.user.sub);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  async refreshTokens(@Req() req: AuthenticatedRequest): Promise<TokensDto> {
    const userId = req.user.sub;
    const refreshToken = req.user.token;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
