import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { CreateUserDto, UpdateUserDto } from './dtos';
import { User, UserDocument } from './schemas';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: mongoose.Model<UserDocument>,
  ) {}

  async findByUsername(username: string): Promise<User> {
    const userFound = await this.usersModel.findOne({ username: username });
    if (!userFound) {
      throw new NotFoundException('username not found');
    }
    return userFound;
  }

  async findById(userId: string): Promise<User> {
    const userFound = await this.usersModel.findById(userId);
    if (!userFound) {
      throw new NotFoundException('user not found');
    }
    return userFound;
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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('username not found');
    }
    return user;
  }
}
