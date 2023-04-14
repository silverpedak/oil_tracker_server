import { Module } from '@nestjs/common';
import { PricesController } from './prices.controller';
import { PricesService } from './prices.service';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Diesel,
  DieselSchema,
  Euro95,
  Euro95Schema,
  Euro98,
  Euro98Schema,
  Lpg,
  LpgSchema,
} from './schemas';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Euro95.name, schema: Euro95Schema }]),
    MongooseModule.forFeature([{ name: Euro98.name, schema: Euro98Schema }]),
    MongooseModule.forFeature([{ name: Diesel.name, schema: DieselSchema }]),
    MongooseModule.forFeature([{ name: Lpg.name, schema: LpgSchema }]),
    HttpModule,
  ],
  controllers: [PricesController],
  providers: [
    PricesService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class PricesModule {}