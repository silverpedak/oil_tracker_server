import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { FuelDataSchema } from './common_fuel_data.schema';

export type LpgDocument = HydratedDocument<Lpg>;

@Schema()
export class Lpg extends FuelDataSchema {}

export const LpgSchema = SchemaFactory.createForClass(Lpg);
