import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from 'src/common';
import { UsersModule } from '../users';
import { TokenModule } from '../tokens';
import { IConfigModule } from '../config/config.module';

@Module({
  imports: [UsersModule, JwtModule.register({}), TokenModule, IConfigModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}
