import { IsNumber, Matches } from 'class-validator';

export class FuelDataDto {
  // REGEX year: 1900-2099; month: 01-12; day: 1-31; ex: 2020-01-01
  @Matches(
    '^(?:20\\d{2}|19\\d{2})-(?:0[1-9]|1[0-2])-(?:0?[1-9]|[12]\\d|3[01])$',
  )
  time: string;

  @IsNumber()
  value: number;
}

export class Euro95Dto extends FuelDataDto {}
export class Euro98Dto extends FuelDataDto {}
export class DieselDto extends FuelDataDto {}
export class LpgDto extends FuelDataDto {}
