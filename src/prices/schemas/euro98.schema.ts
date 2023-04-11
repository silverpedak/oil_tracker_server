import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { FuelDataSchema } from './common_fuel_data.schema';

export type Euro98Document = HydratedDocument<Euro98>;

@Schema()
export class Euro98 extends FuelDataSchema {}

export const Euro98Schema = SchemaFactory.createForClass(Euro98);
