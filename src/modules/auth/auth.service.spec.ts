import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { createMock } from '@golevelup/ts-jest';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users';
import { TokenService } from '../tokens';
import { loginDtoStub, tokensDtoStub, userStub } from '../../../test/stubs';
import { NotFoundException } from '@nestjs/common';

let httpMocks = require('node-mocks-http');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;
  let tokenService: TokenService;
  const mockResponse = httpMocks.createResponse();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker(createMock)
      .compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UsersService>(UsersService);
    tokenService = moduleRef.get<TokenService>(TokenService);
  });

  describe('login', () => {
    describe('successful', () => {
      beforeEach(async () => {
        jest.spyOn(userService, 'findByUsername').mockResolvedValue(userStub());
        jest
          .spyOn(tokenService, 'getTokens')
          .mockResolvedValueOnce(tokensDtoStub());
        jest
          .spyOn(bcrypt, 'compare')
          .mockImplementationOnce(() => Promise.resolve(true));
      });

      it('calls tokenService.getTokens with the correct parameters', async () => {
        await authService.login(loginDtoStub(), mockResponse);
        expect(tokenService.getTokens).toHaveBeenCalledWith(userStub());
      });

      it('calls updateRefreshToken with correct parameters', async () => {
        const userId = userStub()._id.toString();
        jest.spyOn(authService, 'updateRefreshToken');
        await authService.login(loginDtoStub(), mockResponse);
        expect(authService.updateRefreshToken).toHaveBeenCalledWith(
          userId,
          tokensDtoStub().refreshToken,
        );
      });

      it('calls tokenService.storeTokens with the correct parameterse', async () => {
        await authService.login(loginDtoStub(), mockResponse);
        expect(tokenService.storeTokensInCookie).toHaveBeenLastCalledWith(
          mockResponse,
          tokensDtoStub(),
        );
      });
    });

    describe('failed', () => {
      it('throws when username is not found', async () => {
        jest
          .spyOn(userService, 'findByUsername')
          .mockRejectedValueOnce(new NotFoundException());
        await expect(
          authService.login(loginDtoStub(), mockResponse),
        ).rejects.toThrow();
      });

      it('throws when password is incorrect', async () => {
        jest
          .spyOn(bcrypt, 'compare')
          .mockImplementationOnce(() => Promise.resolve(false));
        await expect(
          authService.login(loginDtoStub(), mockResponse),
        ).rejects.toThrow();
      });
    });
  });

  describe('logout', () => {
    beforeEach(async () => {
      const userId = userStub()._id.toString();
      await authService.logout(userId, mockResponse);
    });

    it('calls userService.update with correct parameters', async () => {
      const userId = userStub()._id.toString();
      expect(userService.update).toHaveBeenCalledWith(userId, {
        refreshToken: null,
      });
    });

    it('calls tokenService.clearTokensInCookie with the correct parameters', async () => {
      expect(tokenService.clearTokensInCookie).toHaveBeenCalledWith(
        mockResponse,
      );
    });
  });

  describe('refreshTokens', () => {
    describe('successful', () => {
      beforeEach(async () => {
        jest.spyOn(userService, 'findById').mockResolvedValueOnce(userStub());
        jest
          .spyOn(bcrypt, 'compare')
          .mockImplementationOnce(() => Promise.resolve(true));
        const userId = userStub()._id.toString();
        const tokens = tokensDtoStub();
        await authService.refreshTokens(
          userId,
          tokens.refreshToken,
          mockResponse,
        );
      });

      it('calls tokenService.getTokens with the correct parameters', async () => {
        expect(tokenService.getTokens).toHaveBeenCalledWith(userStub());
      });

      it('calls tokenService.storeTokensInCookie', async () => {
        const tokens = tokensDtoStub();
        expect(tokenService.storeTokensInCookie).toHaveBeenCalledWith(
          mockResponse,
          tokens,
        );
      });
    });

    describe('failed', () => {
      const userId = userStub()._id.toString();
      const refreshToken = tokensDtoStub().refreshToken;

      it('throws when no user found', async () => {
        jest
          .spyOn(userService, 'findById')
          .mockRejectedValueOnce(new NotFoundException());
        await expect(
          authService.refreshTokens(userId, refreshToken, mockResponse),
        ).rejects.toThrow();
      });

      it('throws when refreshTokens dont match', async () => {
        jest
          .spyOn(bcrypt, 'compare')
          .mockImplementationOnce(() => Promise.resolve(false));
        await expect(
          authService.refreshTokens(userId, refreshToken, mockResponse),
        ).rejects.toThrow();
      });
    });
  });

  describe('updateRefreshToken', () => {
    const userId = userStub()._id.toString();
    const refreshToken = tokensDtoStub().refreshToken;

    it('calls usersService.update with the correct parameters', async () => {
      const hashedToken = 'hashedToken';
      jest.spyOn(tokenService, 'hashToken').mockReturnValueOnce(hashedToken);
      await authService.updateRefreshToken(userId, refreshToken);
      expect(userService.update).toHaveBeenCalledWith(userId, {
        refreshToken: hashedToken,
      });
    });
  });
});
