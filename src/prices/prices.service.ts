import { Inject, Injectable } from '@nestjs/common';
import {
  Diesel,
  DieselDocument,
  Euro95,
  Euro95Document,
  Euro98,
  Euro98Document,
  Lpg,
  LpgDocument,
} from './schemas';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { CRUDE_CACHE } from './common';
import { CrudeData } from 'src/common/models';

@Injectable()
export class PricesService {
  private baseUrl: string | undefined;
  private key: string | undefined;

  constructor(
    @InjectModel(Euro95.name)
    private readonly euro95Model: mongoose.Model<Euro95Document>,
    @InjectModel(Euro98.name)
    private readonly euro98Model: mongoose.Model<Euro98Document>,
    @InjectModel(Diesel.name)
    private readonly dieselModel: mongoose.Model<DieselDocument>,
    @InjectModel(Lpg.name)
    private readonly lpgModel: mongoose.Model<LpgDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('CRUDE_BASE_URL');
    this.key = this.configService.get<string>('NASDAQ_API_KEY');
  }

  // calls Nasdaq API mon-fri 13:30:01, cahes response
  @Cron('1 30 13 * * 1-5')
  async handleCrudeCron() {
    console.log('cron called');
    if (this.baseUrl) {
      const { data } = await this.httpService.axiosRef.get<CrudeData>(
        this.baseUrl,
        {
          params: {
            start_date: '2020-01-01',
            order: 'asc',
            api_key: this.key,
          },
        },
      );
      this.cacheManager.set(CRUDE_CACHE, data, 0);
    } else {
      throw new Error('CRUDE_BASE_URL missing');
    }
  }

  // GET
  getCrude(): Promise<AxiosResponse<CrudeData>> {
    console.log('crude service called');
    if (this.baseUrl && this.key) {
      return this.httpService.axiosRef.get<CrudeData>(this.baseUrl, {
        params: {
          start_date: '2020-01-01',
          order: 'asc',
          api_key: this.key,
        },
      });
    } else {
      throw new Error('CRUDE_BASE_URL or NASDAQ_API_KEY missing');
    }
  }

  async get95(): Promise<Euro95[]> {
    console.log('euro95 service called');
    return await this.euro95Model.find();
  }

  async get98(): Promise<Euro98[]> {
    return await this.euro98Model.find();
  }

  async getDiesel(): Promise<Diesel[]> {
    return await this.dieselModel.find();
  }

  async getLpg(): Promise<Lpg[]> {
    return await this.lpgModel.find();
  }

  // CREATE
  async create95(new95: Euro95): Promise<Euro95> {
    return await this.euro95Model.create(new95);
  }
  async create98(new98: Euro98): Promise<Euro98> {
    return await this.euro98Model.create(new98);
  }
  async createDiesel(newDiesel: Diesel): Promise<Diesel> {
    return await this.dieselModel.create(newDiesel);
  }
  async createLpg(newLpg: Lpg): Promise<Lpg> {
    return await this.lpgModel.create(newLpg);
  }
}
