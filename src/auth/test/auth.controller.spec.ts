import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';

import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UserService } from 'src/users';
import { jwtPayloadStub, signInDtoStub, userStub } from '../../../test/stubs';

let httpMocks = require('node-mocks-http');
describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;
  const mockRequest = httpMocks.createRequest();

  beforeEach(async () => {
    mockRequest.user = jwtPayloadStub();

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker(createMock)
      .compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
  });

  describe('signUp', () => {
    it('should return a user', async () => {
      const result = await authController.signUp(userStub());
      expect(userService.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return a tokens', async () => {
      const result = await authController.login(signInDtoStub());
      expect(authService.signIn).toHaveBeenCalled();
    });
  });

  describe('refreshTokens', () => {
    it('should return a tokens', async () => {
      const result = await authController.refreshTokens(mockRequest);
      expect(authService.refreshTokens).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should call logout', async () => {
      await authController.logout(mockRequest);
      expect(authService.logout).toHaveBeenCalled();
    });
  });
});
