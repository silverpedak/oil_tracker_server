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

import { SignInDto } from './dtos';
import { AuthService } from './auth.service';
import { AccessTokenGuard, RefreshTokenGuard } from '../common';
import { CreateUserDto, User, UserService } from 'src/users';
import { TokensDto } from './dtos/tokens.dto';

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
  async logout(@Req() req: any) {
    this.authService.logout(req.user.sub);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  async refreshTokens(@Req() req: any): Promise<TokensDto> {
    const userId = req.user.payload.sub;
    const refreshToken = req.user.token;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
