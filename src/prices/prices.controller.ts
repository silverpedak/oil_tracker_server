import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { PricesService } from './prices.service';
import { Diesel, Euro95, Euro98, Lpg } from './schemas';
import { DieselDto, Euro95Dto, Euro98Dto, LpgDto } from './dtos';
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
} from './common';
import { CrudeData } from 'src/common/models';
import { AuthGuard } from 'src/auth/guards/auth.guard';

/**
 * @Get requests first check for existing cache and only then call the database.
 * @Post requests delete cache for chosen item, so a GET request will include the latest data.
 */

@Controller('prices')
export class PricesController {
  constructor(
    private readonly pricesService: PricesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get(CRUDE)
  async getCrude(): Promise<CrudeData> {
    const cache = await this.cacheManager.get<CrudeData>(CRUDE_CACHE);
    if (cache) return cache;

    const { data } = await this.pricesService.getCrude();
    await this.cacheManager.set(CRUDE_CACHE, data, 0);
    return data;
  }

  @UseGuards(AuthGuard)
  @Get(EURO95)
  async get95(): Promise<Euro95[]> {
    const cache = await this.cacheManager.get<Euro95[]>(EURO95_CACHE);
    if (cache) return cache;

    const prices = await this.pricesService.get95();
    await this.cacheManager.set(EURO95_CACHE, prices, 0);
    return prices;
  }

  @Get(EURO98)
  async get98(): Promise<Euro98[]> {
    const cache = await this.cacheManager.get<Euro98[]>(EURO98_CACHE);
    if (cache) return cache;

    const prices = await this.pricesService.get98();
    await this.cacheManager.set(EURO98_CACHE, prices, 0);
    return prices;
  }

  @Get(DIESEL)
  async getDiesel(): Promise<Diesel[]> {
    const cache = await this.cacheManager.get<Diesel[]>(DIESEL_CACHE);
    if (cache) return cache;

    const prices = await this.pricesService.getDiesel();
    await this.cacheManager.set(DIESEL_CACHE, prices, 0);
    return prices;
  }

  @Get(LPG)
  async getLpg(): Promise<Lpg[]> {
    const cache = await this.cacheManager.get<Lpg[]>(LPG_CACHE);
    if (cache) return cache;

    const prices = await this.pricesService.getLpg();
    await this.cacheManager.set(LPG_CACHE, prices, 0);
    return prices;
  }

  @Post(EURO95)
  async create95(
    @Body()
    new95: Euro95Dto,
  ): Promise<Euro95Dto> {
    await this.cacheManager.del(EURO95_CACHE);
    return this.pricesService.create95(new95);
  }

  @Post(EURO98)
  async create98(
    @Body()
    new98: Euro98Dto,
  ): Promise<Euro98Dto> {
    await this.cacheManager.del(EURO98_CACHE);
    return this.pricesService.create98(new98);
  }

  @Post(DIESEL)
  async createDiesel(
    @Body()
    newDiesel: DieselDto,
  ): Promise<DieselDto> {
    await this.cacheManager.del(DIESEL_CACHE);
    return this.pricesService.createDiesel(newDiesel);
  }

  @Post(LPG)
  async createLpg(
    @Body()
    newLpg: LpgDto,
  ): Promise<LpgDto> {
    await this.cacheManager.del(LPG_CACHE);
    return this.pricesService.createLpg(newLpg);
  }
}
