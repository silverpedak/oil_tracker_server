import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard } from '@nestjs/throttler';

import { PricesController } from './prices.controller';
import { PricesService } from './prices.service';
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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Euro95.name, schema: Euro95Schema },
      { name: Euro98.name, schema: Euro98Schema },
      { name: Diesel.name, schema: DieselSchema },
      { name: Lpg.name, schema: LpgSchema },
    ]),
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
