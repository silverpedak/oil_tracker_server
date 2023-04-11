import { Body, Controller, Get, Post } from '@nestjs/common';
import { PricesService } from './prices.service';
import { Euro95 } from './schemas/euro95.schema';
import { Diesel, Euro98, Lpg } from './schemas';
import { DieselDto, Euro95Dto, Euro98Dto, LpgDto } from './dtos';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  // GET
  @Get('/euro95')
  async get95(): Promise<Euro95[]> {
    return this.pricesService.get95();
  }
  @Get('/euro98')
  async get98(): Promise<Euro98[]> {
    return this.pricesService.get98();
  }
  @Get('/diesel')
  async getDiesel(): Promise<Diesel[]> {
    return this.pricesService.getDiesel();
  }
  @Get('/lpg')
  async getLpg(): Promise<Lpg[]> {
    return this.pricesService.getLpg();
  }

  // POST
  @Post('/euro95')
  async create95(
    @Body()
    new95: Euro95Dto,
  ): Promise<Euro95Dto> {
    return await this.pricesService.create95(new95);
  }
  @Post('/euro98')
  async create98(
    @Body()
    new98: Euro98Dto,
  ): Promise<Euro98Dto> {
    return await this.pricesService.create98(new98);
  }
  @Post('/diesel')
  async createDiesel(
    @Body()
    newDiesel: DieselDto,
  ): Promise<DieselDto> {
    return await this.pricesService.createDiesel(newDiesel);
  }
  @Post('/lpg')
  async createLpg(
    @Body()
    newLpg: LpgDto,
  ): Promise<LpgDto> {
    return await this.pricesService.createLpg(newLpg);
  }
}
