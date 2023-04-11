import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { FuelDataSchema } from './common_fuel_data.schema';

export type DieselDocument = HydratedDocument<Diesel>;

@Schema()
export class Diesel extends FuelDataSchema {}

export const DieselSchema = SchemaFactory.createForClass(Diesel);
