import { CreateUserDto } from 'src/modules';

export const createUserDtoStub = (): CreateUserDto => {
  return {
    username: 'username',
    password: 'password',
    firstName: 'firstName',
    lastName: 'lastName',
    roles: [],
    refreshToken: null,
  };
};
