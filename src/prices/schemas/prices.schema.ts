import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { FuelData } from 'src/common/fuel_data.model';

export type PricesDocument = HydratedDocument<Prices>;

@Schema()
export class Prices {
  @Prop({ required: true })
  crude: FuelData[];

  @Prop()
  euro95: FuelData[];

  @Prop()
  euro98: FuelData[];

  @Prop()
  diesel: FuelData[];

  @Prop()
  lpg: FuelData[];
}

export const PricesSchema = SchemaFactory.createForClass(Prices);
