import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { createMock } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/users';
import { userStub } from '../../test';
import * as bcrypt from 'bcrypt';
import { TokensDto } from './dtos';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker(createMock)
      .compile();

    authService = moduleRef.get<AuthService>(AuthService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    configService = moduleRef.get<ConfigService>(ConfigService);
    userService = moduleRef.get<UserService>(UserService);
  });

  describe('signIn', () => {
    it('should return tokens when username and password are correct', async () => {
      // arrange
      const tokens = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      };
      jest.spyOn(userService, 'findByUsername').mockResolvedValue(userStub());
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(() => Promise.resolve(true));
      jest.spyOn(authService, 'getTokens').mockResolvedValueOnce(tokens);

      // act
      const result = await authService.signIn(
        userStub().username,
        userStub().password,
      );

      // assert
      expect(userService.findByUsername).toHaveBeenCalled();
      expect(authService.getTokens).toHaveBeenCalled();
      expect(result).toEqual(tokens);
    });

    it('should throw exception when username is not found', async () => {
      // arrange
      jest.spyOn(userService, 'findByUsername').mockResolvedValue(null);

      // act and assert
      await expect(
        authService.signIn(userStub().username, userStub().password),
      ).rejects.toThrowError();
    });

    it('should throw exception when password is incorrect', async () => {
      // arrange
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(() => Promise.resolve(false));

      // act and assert
      await expect(
        authService.signIn(userStub().username, userStub().password),
      ).rejects.toThrowError();
    });
  });

  describe('logout', () => {
    it('should call userService.update with correct params', async () => {
      // arrange
      jest.spyOn(userService, 'update');

      //act
      await authService.logout(userStub()._id.toString());

      // aassert
      expect(userService.update).toHaveBeenCalledWith(
        userStub()._id.toString(),
        { refreshToken: null },
      );
    });
  });

  describe('updateRefreshToken', () => {
    it('should call userService.update with correct params', async () => {
      // arrange
      jest.spyOn(userService, 'update');
      const token = 'token';
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(token);

      // act
      await authService.updateRefreshToken(userStub()._id.toString(), token);

      // assert
      expect(userService.update).toHaveBeenCalledWith(
        userStub()._id.toString(),
        { refreshToken: token },
      );
    });
  });

  describe('getTokens', () => {
    it('should return access token and refresh token', async () => {
      // arrange
      const userId = userStub()._id.toString();
      const username = userStub().username;

      const accessSecret = 'accessSecret';
      const refreshSecret = 'refreshSecret';

      const accessToken = 'accessToken';
      const refreshToken = 'refreshToken';

      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementationOnce(() => Promise.resolve(accessToken));
      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementationOnce(() => Promise.resolve(refreshToken));

      jest
        .spyOn(configService, 'get')
        .mockImplementationOnce(() => accessSecret);
      jest
        .spyOn(configService, 'get')
        .mockImplementationOnce(() => refreshSecret);

      // act
      const result = await authService.getTokens(userId, username);

      // assert
      expect(result).toEqual({ accessToken, refreshToken });

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: userId, username },
        { secret: accessSecret, expiresIn: '20m' },
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: userId, username },
        { secret: refreshSecret, expiresIn: '7d' },
      );

      expect(configService.get).toHaveBeenCalledWith('JWT_ACCESS_SECRET');
      expect(configService.get).toHaveBeenCalledWith('JWT_REFRESH_SECRET');
    });
  });

  describe('refreshTokens', () => {
    it('should throw when refreshToken is not correct', async () => {
      // arrange
      jest.spyOn(userService, 'findById').mockResolvedValue(userStub());
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(() => Promise.resolve(false));
      // act and assert
      await expect(
        authService.refreshTokens(
          userStub()._id.toString(),
          userStub().refreshToken,
        ),
      ).rejects.toThrowError();
    });

    it('should throw when  no refreshToken found', async () => {
      // arrange
      const user = userStub();
      user.refreshToken = '';
      jest.spyOn(userService, 'findById').mockResolvedValue(user);
      // act and assert
      await expect(
        authService.refreshTokens(
          userStub()._id.toString(),
          userStub().refreshToken,
        ),
      ).rejects.toThrowError();
    });

    it('should throw when no user found', async () => {
      // arrange
      jest.spyOn(userService, 'findById').mockResolvedValue(null);
      // act and assert
      await expect(
        authService.refreshTokens(
          userStub()._id.toString(),
          userStub().refreshToken,
        ),
      ).rejects.toThrowError();
    });

    it('should return tokens when refreshToken is correct', async () => {
      // arrange
      const tokens = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      };
      jest.spyOn(userService, 'findById').mockResolvedValue(userStub());
      jest.spyOn(authService, 'getTokens').mockResolvedValueOnce(tokens);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(() => Promise.resolve(true));
      jest.spyOn(authService, 'updateRefreshToken');
      // act
      const result = await authService.refreshTokens(
        userStub()._id.toString(),
        userStub().refreshToken,
      );
      // assert
      expect(result).toEqual(tokens);
      expect(userService.findById).toHaveBeenCalledWith(
        userStub()._id.toString(),
      );
      expect(authService.getTokens).toHaveBeenCalledWith(
        userStub()._id.toString(),
        userStub().username,
      );
      expect(authService.updateRefreshToken).toHaveBeenCalledWith(
        userStub()._id.toString(),
        tokens.refreshToken,
      );
    });
  });
});
