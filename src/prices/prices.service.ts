import { Injectable } from '@nestjs/common';
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

@Injectable()
export class PricesService {
  constructor(
    // 95
    @InjectModel(Euro95.name)
    private readonly euro95Model: mongoose.Model<Euro95Document>,

    // 98
    @InjectModel(Euro98.name)
    private readonly euro98Model: mongoose.Model<Euro98Document>,

    // Diesel
    @InjectModel(Diesel.name)
    private readonly dieselModel: mongoose.Model<DieselDocument>,

    // Lpg
    @InjectModel(Lpg.name)
    private readonly lpgModel: mongoose.Model<LpgDocument>,
  ) {}

  // GET
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
