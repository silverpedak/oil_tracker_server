import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users';
import { jwtPayloadStub, loginDtoStub, userStub } from '../../../test/stubs';

let httpMocks = require('node-mocks-http');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UsersService;
  const mockRequest = httpMocks.createRequest();
  const mockResponse = httpMocks.createResponse();

  beforeEach(async () => {
    mockRequest.user = jwtPayloadStub();

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker(createMock)
      .compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UsersService>(UsersService);
  });

  describe('signUp', () => {
    it('should return a user', async () => {
      const result = await authController.signUp(userStub());

      expect(userService.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('calls authService.login with correct parameters', async () => {
      const loginDto = loginDtoStub();

      await authController.login(loginDto, mockResponse);

      expect(authService.login).toHaveBeenCalledWith(loginDto, mockResponse);
    });
  });

  describe('refreshTokens', () => {
    it('calls authService.refreshTokens with correct parameters', async () => {
      mockRequest.cookies.refresh_token = 'refresh_token';

      await authController.refreshTokens(mockRequest, mockResponse);

      expect(authService.refreshTokens).toHaveBeenCalledWith(
        mockRequest.user.sub,
        mockRequest.cookies.refresh_token,
        mockResponse,
      );
    });
  });

  describe('logout', () => {
    it('calls authService.logout with the correct parameters', async () => {
      await authController.logout(mockRequest, mockResponse);

      expect(authService.logout).toHaveBeenCalledWith(
        mockRequest.user.sub,
        mockResponse,
      );
    });
  });
});
