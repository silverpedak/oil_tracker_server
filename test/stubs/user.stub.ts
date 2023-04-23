import mongoose, { Types } from 'mongoose';
import { User } from 'src/users';

export const userStub = (): User => {
  return new User({
    _id: new mongoose.Schema.Types.ObjectId('mongoId'),
    username: 'username',
    password: 'password',
    firstName: 'firstName',
    lastName: 'lastName',
    roles: [],
    refreshToken: 'refreshToken',
  });
};
