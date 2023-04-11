import { Module } from '@nestjs/common';
import { PricesModule } from './prices/prices.module';
import { MongooseModule } from '@nestjs/mongoose';

const MONGO_URI = 'mongodb://localhost:27017/fuel-prices';

@Module({
  imports: [MongooseModule.forRoot(MONGO_URI), PricesModule],
})
export class AppModule {}
