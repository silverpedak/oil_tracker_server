import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { FuelDataSchema } from './fuel-data.schema';

export type Euro95Document = HydratedDocument<Euro95>;

@Schema()
export class Euro95 extends FuelDataSchema {}

export const Euro95Schema = SchemaFactory.createForClass(Euro95);
