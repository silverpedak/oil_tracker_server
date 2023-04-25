import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import mongoose, { Connection, connect } from 'mongoose';
import {
  Diesel,
  DieselSchema,
  Euro95,
  Euro95Schema,
  Euro98,
  Euro98Schema,
  Lpg,
  LpgSchema,
} from './schemas';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PricesService } from './prices.service';
import { getModelToken } from '@nestjs/mongoose';
import { fuelDataStub } from '../../test/stubs/fuel_data.stub';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Order } from 'src/common/enums/order.enum';
import { getCrudeDataStub } from '../../test/stubs/crude_data.stub';
import { CrudeData, DEFAULT_QUERY } from 'src/common';
import { AxiosResponse } from 'axios';

describe('AuthService', () => {
  let pricesService: PricesService;
  let httpService: DeepMocked<HttpService>;
  let configService: ConfigService;
  let cacheManager: Cache;

  let euro95Model: mongoose.Model<Euro95>;
  let euro98Model: mongoose.Model<Euro98>;
  let dieselModel: mongoose.Model<Diesel>;
  let lpgModel: mongoose.Model<Lpg>;

  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;

    euro95Model = mongoConnection.model(Euro95.name, Euro95Schema);
    euro98Model = mongoConnection.model(Euro98.name, Euro98Schema);
    dieselModel = mongoConnection.model(Diesel.name, DieselSchema);
    lpgModel = mongoConnection.model(Lpg.name, LpgSchema);

    const moduleRef = await Test.createTestingModule({
      providers: [
        PricesService,
        { provide: CACHE_MANAGER, useValue: createMock<Cache>() },
        {
          provide: getModelToken(Euro95.name),
          useValue: euro95Model,
        },
        {
          provide: getModelToken(Euro98.name),
          useValue: euro98Model,
        },
        {
          provide: getModelToken(Diesel.name),
          useValue: dieselModel,
        },
        {
          provide: getModelToken(Lpg.name),
          useValue: lpgModel,
        },
        {
          provide: HttpService,
          useValue: createMock<HttpService>(),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
      ],
    }).compile();

    pricesService = moduleRef.get<PricesService>(PricesService);
    httpService = moduleRef.get(HttpService);
    configService = moduleRef.get<ConfigService>(ConfigService);
    cacheManager = moduleRef.get<Cache>(CACHE_MANAGER);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('95', () => {
    describe('get95', () => {
      it('should return an array of prices', async () => {
        // arrange
        jest.spyOn(euro95Model, 'find');
        // // act
        const result = await pricesService.get95();
        // assert
        expect(result.length).toBe(0);
        expect(euro95Model.find).toHaveBeenCalled();
      });
    });

    describe('create95', () => {
      it('should return the saved object', async () => {
        const result = await pricesService.create95(fuelDataStub());
        expect(result.time).toEqual(fuelDataStub().time);
      });
    });

    test('creates new prices and gets the array of prices', async () => {
      // arrange
      await pricesService.create95(fuelDataStub());
      // act
      const result = await pricesService.get95();
      // assert
      expect(result.length).toBe(1);
      expect(result[0].time).toEqual(fuelDataStub().time);
    });
  });

  describe('98', () => {
    describe('get98', () => {
      it('should return an array of prices', async () => {
        // arrange
        jest.spyOn(euro98Model, 'find');
        // // act
        const result = await pricesService.get98();
        // assert
        expect(result.length).toBe(0);
        expect(euro98Model.find).toHaveBeenCalled();
      });
    });

    describe('create98', () => {
      it('should return the saved object', async () => {
        const result = await pricesService.create98(fuelDataStub());
        expect(result.time).toEqual(fuelDataStub().time);
      });
    });

    test('creates new prices and gets the array of prices', async () => {
      // arrange
      await pricesService.create98(fuelDataStub());
      // act
      const result = await pricesService.get98();
      // assert
      expect(result.length).toBe(1);
      expect(result[0].time).toEqual(fuelDataStub().time);
    });
  });

  describe('diesel', () => {
    describe('getDiesel', () => {
      it('should return an array of prices', async () => {
        // arrange
        jest.spyOn(dieselModel, 'find');
        // // act
        const result = await pricesService.getDiesel();
        // assert
        expect(result.length).toBe(0);
        expect(dieselModel.find).toHaveBeenCalled();
      });
    });

    describe('createDiesel', () => {
      it('should return the saved object', async () => {
        const result = await pricesService.createDiesel(fuelDataStub());
        expect(result.time).toEqual(fuelDataStub().time);
      });
    });

    test('creates new prices and gets the array of prices', async () => {
      // arrange
      await pricesService.createDiesel(fuelDataStub());
      // act
      const result = await pricesService.getDiesel();
      // assert
      expect(result.length).toBe(1);
      expect(result[0].time).toEqual(fuelDataStub().time);
    });
  });

  describe('lpg', () => {
    describe('getLpg', () => {
      it('should return an array of prices', async () => {
        // arrange
        jest.spyOn(lpgModel, 'find');
        // // act
        const result = await pricesService.getLpg();
        // assert
        expect(result.length).toBe(0);
        expect(lpgModel.find).toHaveBeenCalled();
      });
    });

    describe('createLpg', () => {
      it('should return the saved object', async () => {
        const result = await pricesService.createLpg(fuelDataStub());
        expect(result.time).toEqual(fuelDataStub().time);
      });
    });

    test('creates new prices and gets the array of prices', async () => {
      // arrange
      await pricesService.createLpg(fuelDataStub());
      // act
      const result = await pricesService.getLpg();
      // assert
      expect(result.length).toBe(1);
      expect(result[0].time).toEqual(fuelDataStub().time);
    });
  });

  describe('getCrude', () => {
    const query = {
      start: '2020-01-01',
      order: Order.asc,
    };

    it('should make a GET request to the CRUDE API with the correct parameters', async () => {
      // Arrange
      const baseUrl = 'https://example.com/crude';
      const key = 'my-api-key';
      const expectedUrl = `${baseUrl}?start_date=2020-01-01&order=asc&api_key=${key}`;
      const expectedResponse = { data: getCrudeDataStub() };
      jest
        .spyOn(httpService, 'axiosRef')
        .mockResolvedValueOnce(expectedResponse);

      // Act
      const result = await pricesService.getCrudeData(query);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(httpService.axiosRef).toHaveBeenCalledWith(expectedUrl, {
        method: 'GET',
        params: { start_date: query.start, order: query.order, api_key: key },
      });
    });

    it('throws an error when missing required configurational values', async () => {
      // arrange
      jest.spyOn(configService, 'get').mockReturnValueOnce(undefined);
      jest.spyOn(configService, 'get').mockReturnValueOnce(undefined);

      // act and assert
      await expect(pricesService.getCrudeData(query)).rejects.toThrow();
    });

    it('should make a GET request to the CRUDE API with default parameters when called without query object', async () => {
      // arrange
      const baseUrl = 'https://example.com/crude';
      const key = 'my-api-key';
      const expectedQuery = {
        start_date: DEFAULT_QUERY.start,
        order: DEFAULT_QUERY.order,
        api_key: key,
      };
      const expectedResponse = { data: getCrudeDataStub() };

      jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce(baseUrl)
        .mockReturnValueOnce(key);
      jest
        .spyOn(httpService, 'axiosRef')
        .mockResolvedValueOnce(expectedResponse);

      //act
      const result = await pricesService.getCrudeData();

      // assert
      expect(result).toEqual(expectedResponse);
      expect(httpService.axiosRef).toHaveBeenCalledWith(baseUrl, {
        method: 'GET',
        params: expectedQuery,
      });
    });
  });
});
