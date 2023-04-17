import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { CreateUserDto } from './dtos';
import { UserService } from './users.service';
import { User } from './schemas';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor) // removes password from response object
  @Post('/signup')
  async signUp(@Body() signUpDto: CreateUserDto): Promise<User> {
    return this.userService.create(signUpDto);
  }
}
