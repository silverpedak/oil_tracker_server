import { HttpException, HttpStatus } from '@nestjs/common';

export class UserExistsException extends HttpException {
  constructor() {
    super('username already exists', HttpStatus.CONFLICT);
  }
}
