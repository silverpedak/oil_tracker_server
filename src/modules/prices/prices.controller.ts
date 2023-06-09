import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { PricesService } from './prices.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import {
  CRUDE,
  CRUDE_CACHE,
  DIESEL,
  DIESEL_CACHE,
  EURO95,
  EURO95_CACHE,
  EURO98,
  EURO98_CACHE,
  LPG,
  LPG_CACHE,
} from './prices-routes.const';
import { DieselDto, Euro95Dto, Euro98Dto, LpgDto } from './dtos';
import { Diesel, Euro95, Euro98, Lpg } from './schemas';
import { CrudeData, Roles, Role } from 'src/common';
import { CrudeQueryDto } from './dtos/crude-query.dto';

@Controller('prices')
export class PricesController {
  constructor(
    private readonly pricesService: PricesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get(CRUDE)
  async getCrude(@Query() query: CrudeQueryDto): Promise<CrudeData> {
    const cache = await this.cacheManager.get<CrudeData>(CRUDE_CACHE);
    if (cache) {
      return cache;
    }
    const { data } = await this.pricesService.getCrudeData(query);
    await this.cacheManager.set(CRUDE_CACHE, data, 0);
    return data;
  }

  @Get(EURO95)
  async get95(): Promise<Euro95[]> {
    const cache = await this.cacheManager.get<Euro95[]>(EURO95_CACHE);
    if (cache) {
      return cache;
    }
    const prices = await this.pricesService.get95();
    await this.cacheManager.set(EURO95_CACHE, prices, 0);
    return prices;
  }

  @Get(EURO98)
  async get98(): Promise<Euro98[]> {
    const cache = await this.cacheManager.get<Euro98[]>(EURO98_CACHE);
    if (cache) {
      return cache;
    }
    const prices = await this.pricesService.get98();
    await this.cacheManager.set(EURO98_CACHE, prices, 0);
    return prices;
  }

  @Get(DIESEL)
  async getDiesel(): Promise<Diesel[]> {
    const cache = await this.cacheManager.get<Diesel[]>(DIESEL_CACHE);
    if (cache) {
      return cache;
    }
    const prices = await this.pricesService.getDiesel();
    await this.cacheManager.set(DIESEL_CACHE, prices, 0);
    return prices;
  }

  @Get(LPG)
  async getLpg(): Promise<Lpg[]> {
    const cache = await this.cacheManager.get<Lpg[]>(LPG_CACHE);
    if (cache) {
      return cache;
    }
    const prices = await this.pricesService.getLpg();
    await this.cacheManager.set(LPG_CACHE, prices, 0);
    return prices;
  }

  @Roles(Role.Admin)
  @Post(EURO95)
  async create95(
    @Body()
    new95: Euro95Dto,
  ): Promise<Euro95Dto> {
    await this.cacheManager.del(EURO95_CACHE);
    return this.pricesService.create95(new95);
  }

  @Roles(Role.Admin)
  @Post(EURO98)
  async create98(
    @Body()
    new98: Euro98Dto,
  ): Promise<Euro98Dto> {
    await this.cacheManager.del(EURO98_CACHE);
    return this.pricesService.create98(new98);
  }

  @Roles(Role.Admin)
  @Post(DIESEL)
  async createDiesel(
    @Body()
    newDiesel: DieselDto,
  ): Promise<DieselDto> {
    await this.cacheManager.del(DIESEL_CACHE);
    return this.pricesService.createDiesel(newDiesel);
  }

  @Roles(Role.Admin)
  @Post(LPG)
  async createLpg(
    @Body()
    newLpg: LpgDto,
  ): Promise<LpgDto> {
    await this.cacheManager.del(LPG_CACHE);
    return this.pricesService.createLpg(newLpg);
  }
}
