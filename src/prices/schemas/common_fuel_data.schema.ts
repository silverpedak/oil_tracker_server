import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class FuelDataSchema {
  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  value: number;
}
