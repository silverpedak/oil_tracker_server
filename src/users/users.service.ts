import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { CreateUserDto } from './dtos';
import { UserExistsException } from './exceptions';
import { User, UserDocument } from './schemas';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: mongoose.Model<UserDocument>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return await this.usersModel.findOne({ username: username });
  }

  async create(signUpDto: CreateUserDto): Promise<User> {
    const user = await this.usersModel.findOne({
      username: signUpDto.username,
    });
    if (user) {
      throw new UserExistsException();
    }

    const hash = bcrypt.hashSync(signUpDto.password, 10);
    signUpDto.password = hash;
    const { _id, username, firstName, lastName, password, roles } =
      await this.usersModel.create(signUpDto);

    // Serialization. To remove password from response object need to return a new instance of User.
    return new User({
      userId: _id.toString(),
      username,
      firstName,
      lastName,
      password,
      roles,
    });
  }
}
