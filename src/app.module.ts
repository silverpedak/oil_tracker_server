import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule, PricesModule, UsersModule } from './modules';
import { IConfigModule } from './modules/config/config.module';
import { IConfigService } from './modules/config/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 3600, // 1 hour
      limit: 100, // 100 requests
    }),
    MongooseModule.forRootAsync({
      imports: [IConfigModule],
      inject: [IConfigService],
      useFactory: async (config: IConfigService) => ({
        uri: config.getMongoUri(),
      }),
    }),
    PricesModule,
    AuthModule,
    UsersModule,
    IConfigModule,
  ],
})
export class AppModule {}
