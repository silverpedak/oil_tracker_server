import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { Order } from 'src/common/enums/order.enum';

/**
 * Represents a user object.
 * @property {string} start: Start date, defaults to and matches 2020-01-01.
 * @property {Order} order- Sorting order, defaults to Order.asc.
 */
export class CrudeQueryDto {
  @Matches(
    '^(?:20\\d{2}|19\\d{2})-(?:0[1-9]|1[0-2])-(?:0?[1-9]|[12]\\d|3[01])$',
  )
  @IsString()
  @IsOptional()
  start: string = '2020-01-01';

  @IsEnum(Order)
  @IsString()
  @IsOptional()
  order?: Order = Order.asc;
}
