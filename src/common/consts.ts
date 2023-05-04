import { CrudeQueryDto } from 'src/modules/prices/dtos/crude-query.dto';
import { Order } from './enums';

export const DEFAULT_QUERY: CrudeQueryDto = {
  start: '2020-01-01',
  order: Order.asc,
};
