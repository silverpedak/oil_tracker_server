import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CrudeApiConfig } from 'src/common';

@Injectable()
export class IConfigService {
  private readonly nasdaqApiKey: string;
  private readonly nasdaqBaseUrl: string;
  private readonly jwtAccessSecret: string;
  private readonly jwtRefreshSecret: string;
  private readonly mongoUri: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('NASDAQ_API_KEY');
    if (!apiKey) {
      throw new BadRequestException('nasdaq_api_key missing from config');
    }

    const baseUrl = this.configService.get<string>('NASDAQ_BASE_URL');
    if (!baseUrl) {
      throw new BadRequestException('nasdaq_base_url missing from config');
    }

    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    if (!accessSecret) {
      throw new BadRequestException('jwt_access_secret missing from config');
    }

    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!refreshSecret) {
      throw new BadRequestException('jwt_refresh_secret missing from config');
    }

    const mongo = this.configService.get<string>('MONGO_URI');
    if (!mongo) {
      throw new BadRequestException('mongo_uri missing from config');
    }
    this.nasdaqApiKey = apiKey;
    this.nasdaqBaseUrl = baseUrl;
    this.jwtAccessSecret = accessSecret;
    this.jwtRefreshSecret = refreshSecret;
    this.mongoUri = mongo;
  }

  getCrudeApiConfig(): CrudeApiConfig {
    return {
      apiKey: this.nasdaqApiKey,
      baseUrl: this.nasdaqBaseUrl,
    };
  }

  getJwtAccessSecret(): string {
    return this.jwtAccessSecret;
  }

  getJwtRefreshSecret(): string {
    return this.jwtRefreshSecret;
  }

  getMongoUri(): string {
    return this.mongoUri;
  }
}
