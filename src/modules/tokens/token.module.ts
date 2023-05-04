import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { IConfigModule } from '../config/config.module';

@Module({
  imports: [JwtModule, IConfigModule],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
