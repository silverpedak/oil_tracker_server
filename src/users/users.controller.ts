import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UserService } from './users.service';
import { CreateUserDto } from './dtos/create_user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor) // removes password from response object
  @Post('/signup')
  async signUp(@Body() signUpDto: CreateUserDto): Promise<User> {
    return this.userService.create(signUpDto);
  }
}
