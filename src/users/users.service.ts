import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { CreateUserDto, UpdateUserDto } from './dtos';
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

  async findById(userId: string): Promise<User | null> {
    return await this.usersModel.findById(userId);
  }

  async create(signUpDto: CreateUserDto): Promise<User> {
    const user = await this.usersModel.findOne({
      username: signUpDto.username,
    });
    if (user) {
      throw new ConflictException('username already exists');
    }

    signUpDto.password = bcrypt.hashSync(signUpDto.password, 10);
    const { username, firstName, lastName, password, roles } =
      await this.usersModel.create(signUpDto);

    // Serialization. To remove password from response object need to return a new instance of User.
    return new User({
      username,
      firstName,
      lastName,
      password,
      roles,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.usersModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }
}
