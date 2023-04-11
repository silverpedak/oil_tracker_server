import { Module } from '@nestjs/common';
import { PricesController } from './prices.controller';
import { PricesService } from './prices.service';
import { MongooseModule } from '@nestjs/mongoose';

import { DieselSchema, Euro95Schema, Euro98Schema, LpgSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Euro95', schema: Euro95Schema }]),
    MongooseModule.forFeature([{ name: 'Euro98', schema: Euro98Schema }]),
    MongooseModule.forFeature([{ name: 'Diesel', schema: DieselSchema }]),
    MongooseModule.forFeature([{ name: 'Lpg', schema: LpgSchema }]),
  ],
  controllers: [PricesController],
  providers: [PricesService],
})
export class PricesModule {}
