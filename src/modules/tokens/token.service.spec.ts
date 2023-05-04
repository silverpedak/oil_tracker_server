import { createMock } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
let httpMocks = require('node-mocks-http');

import { TokenService } from './token.service';
import { tokensDtoStub, userStub } from '../../../test/stubs';
import { Token } from 'src/common/enums/tokens.enum';

describe('tokenService', () => {
  let tokenService: TokenService;
  let jwtService: JwtService;
  const mockResponse = httpMocks.createResponse();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TokenService],
    })
      .useMocker(createMock)
      .compile();

    tokenService = moduleRef.get<TokenService>(TokenService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('hashToken', () => {
    it('should return hashed token', () => {
      const hashedToken = 'hashedToken';
      jest.spyOn(bcrypt, 'hashSync').mockReturnValueOnce(hashedToken);
      const res = tokenService.hashToken('');
      expect(res).toEqual(hashedToken);
    });
  });

  describe('compareTokens', () => {
    describe('successful', () => {
      it('should return true when tokens match', async () => {
        jest
          .spyOn(bcrypt, 'compare')
          .mockImplementationOnce(() => Promise.resolve(true));
        const res = await tokenService.compareTokens('', '');
        expect(res).toEqual(true);
      });
    });

    describe('failed', () => {
      it('should return false when tokens dont match', async () => {
        jest
          .spyOn(bcrypt, 'compare')
          .mockImplementationOnce(() => Promise.resolve(false));
        const res = await tokenService.compareTokens('', '');
        expect(res).toEqual(false);
      });
    });
  });

  describe('getTokens', () => {
    describe('successful', () => {
      it('returns tokens', async () => {
        const tokens = tokensDtoStub();
        const user = userStub();
        jest
          .spyOn(jwtService, 'signAsync')
          .mockResolvedValueOnce(tokens.accessToken)
          .mockResolvedValueOnce(tokens.refreshToken);
        const res = await tokenService.getTokens(user);
        expect(res).toEqual(tokens);
      });
    });
  });

  describe('storeTokensInCookie', () => {
    it('calls res.cookie with the correct parameters', () => {
      const tokens = tokensDtoStub();
      jest.spyOn(mockResponse, 'cookie');
      tokenService.storeTokensInCookie(mockResponse, tokens);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        Token.REFRESH_TOKEN,
        tokens.refreshToken,
        {
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
          httpOnly: true,
          sameSite: 'strict',
        },
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        Token.ACCESS_TOKEN,
        tokens.accessToken,
        {
          maxAge: 1000 * 60 * 20, // 15 min
          httpOnly: true,
          sameSite: 'strict',
        },
      );
    });
  });

  describe('clearTokensInCookie', () => {
    it('deletes cookies', () => {
      jest.spyOn(mockResponse, 'clearCookie');
      tokenService.clearTokensInCookie(mockResponse);
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(Token.ACCESS_TOKEN);
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        Token.REFRESH_TOKEN,
      );
    });
  });
});
