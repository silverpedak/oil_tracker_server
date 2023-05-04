import { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import mongoose from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';

import { IConfigService } from '../config/config.service';
import { CrudeQueryDto } from './dtos';
import { CRUDE_CACHE } from './prices-routes.const';
import { CrudeData, DEFAULT_QUERY } from 'src/common';
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

@Injectable()
export class PricesService {
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
    private readonly configService: IConfigService,
  ) {}

  // calls Nasdaq API mon-fri 13:30:01, cahes response
  // Add logger
  @Cron('1 30 13 * * 1-5')
  async handleCrudeCron() {
    const { data } = await this.getCrudeData();
    this.cacheManager.set(CRUDE_CACHE, data, 0);
  }

  async getCrudeData(
    query: CrudeQueryDto = DEFAULT_QUERY,
  ): Promise<AxiosResponse<CrudeData>> {
    const { apiKey, baseUrl } = this.configService.getCrudeApiConfig();
    const params = {
      start_date: query.start,
      order: query.order,
      api_key: apiKey,
    };
    return this.httpService.axiosRef<CrudeData>(baseUrl, {
      method: 'GET',
      params,
    });
  }

  async get95(): Promise<Euro95[]> {
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
