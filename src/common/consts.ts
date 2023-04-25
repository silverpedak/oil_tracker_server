import { CrudeQueryDto } from 'src/prices/dtos/get_crude_query.dto';
import { Order } from './enums/order.enum';

export const DEFAULT_QUERY: CrudeQueryDto = {
  start: '2020-01-01',
  order: Order.asc,
};
