import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { UserExistsException } from './exceptions/user_exists.exception';
import { CreateUserDto } from './dtos/create_user.dto';

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
    const { _id, username, firstName, lastName, password } =
      await this.usersModel.create(signUpDto);

    // Serialization. To remove password from response object need to return a new instance of User.
    return new User({
      userId: _id.toString(),
      username: username,
      firstName: firstName,
      lastName: lastName,
      password: password,
    });
  }
}
