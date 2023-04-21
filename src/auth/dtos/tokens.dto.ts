import { IsNotEmpty, IsString } from 'class-validator';

export class TokensDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  // constructor(accessToken: string, refreshToken: string) {
  //   this.accessToken = accessToken;
  //   this.refreshToken = refreshToken;
  // }
}
