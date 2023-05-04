import { Module } from '@nestjs/common';
import { IConfigService } from './config.service';

@Module({
  providers: [IConfigService],
  exports: [IConfigService],
})
export class IConfigModule {}
