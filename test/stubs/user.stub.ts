import { User } from 'src/users';

export const userStub = (): User => {
  return new User({
    username: 'username',
    password: 'password',
    firstName: 'firstName',
    lastName: 'lastName',
    roles: [],
    refreshToken: 'refreshToken',
  });
};
