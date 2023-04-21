import { JwtPayload } from 'src/common';

export const jwtPayloadStub = (): JwtPayload => ({
  sub: 'sub',
  username: 'username',
  token: 'token',
});
