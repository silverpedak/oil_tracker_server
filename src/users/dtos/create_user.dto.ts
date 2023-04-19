import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/auth/enums';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEnum(Role, { each: true })
  roles: Role[];
}
