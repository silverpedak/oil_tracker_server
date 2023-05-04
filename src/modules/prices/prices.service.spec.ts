import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import mongoose, { Connection, connect } from 'mongoose';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
let httpMocks = require('node-mocks-http');

import { fuelDataStub, getCrudeDataStub } from '../../../test/stubs';
import { PricesService } from './prices.service';
import { DEFAULT_QUERY, Order } from 'src/common';
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
import { IConfigService } from '../config/config.service';
import { CRUDE_CACHE } from './prices-routes.const';

describe('AuthService', () => {
  let pricesService: PricesService;
  let httpService: DeepMocked<HttpService>;
  let configService: IConfigService;

  let cacheManager: Cache;

  let euro95Model: mongoose.Model<Euro95>;
  let euro98Model: mongoose.Model<Euro98>;
  let dieselModel: mongoose.Model<Diesel>;
  let lpgModel: mongoose.Model<Lpg>;

  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;

  const mockResponse = httpMocks.createResponse();

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
          provide: IConfigService,
          useValue: createMock<IConfigService>(),
        },
      ],
    }).compile();

    pricesService = moduleRef.get<PricesService>(PricesService);
    httpService = moduleRef.get(HttpService);
    configService = moduleRef.get<IConfigService>(IConfigService);
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

  describe('handleCron', () => {
    it('sets cache', async () => {
      mockResponse.data = getCrudeDataStub();
      jest
        .spyOn(pricesService, 'getCrudeData')
        .mockResolvedValueOnce(mockResponse);

      await pricesService.handleCrudeCron();
      expect(cacheManager.set).toHaveBeenCalledWith(
        CRUDE_CACHE,
        mockResponse.data,
        0,
      );
    });
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
    const baseUrl = 'https://example.com/crude';
    const apiKey = 'my-api-key';
    const config = { apiKey, baseUrl };

    it('should make a GET request to the CRUDE API with the correct parameters', async () => {
      jest
        .spyOn(configService, 'getCrudeApiConfig')
        .mockReturnValueOnce(config);
      // Act
      await pricesService.getCrudeData(query);
      // Assert
      expect(httpService.axiosRef).toHaveBeenCalledWith(baseUrl, {
        method: 'GET',
        params: {
          start_date: query.start,
          order: query.order,
          api_key: apiKey,
        },
      });
    });

    it('should make a GET request to the CRUDE API with default parameters when called without query object', async () => {
      const expectedQuery = {
        start_date: DEFAULT_QUERY.start,
        order: DEFAULT_QUERY.order,
        api_key: apiKey,
      };
      const expectedResponse = { data: getCrudeDataStub() };
      jest
        .spyOn(configService, 'getCrudeApiConfig')
        .mockReturnValueOnce(config);
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
