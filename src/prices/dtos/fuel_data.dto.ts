import { IsArray, IsNumber, IsString } from 'class-validator';

export class FuelDataDto {
  @IsString()
  time: string;

  @IsNumber()
  value: number;
}

export class Euro95Dto extends FuelDataDto {}
export class Euro98Dto extends FuelDataDto {}
export class DieselDto extends FuelDataDto {}
export class LpgDto extends FuelDataDto {}
