import { Cache } from 'cache-manager';
import { PricesController } from './prices.controller';
import { PricesService } from './prices.service';
import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getCrudeDataStub } from '../../test/stubs/crude_data.stub';
import { fuelDataStub } from '../../test/stubs/fuel_data.stub';

describe('PricesController', () => {
  let pricesController: PricesController;
  let pricesService: PricesService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PricesController],
      providers: [
        { provide: PricesService, useValue: createMock<PricesService>() },
        { provide: CACHE_MANAGER, useValue: createMock<Cache>() },
      ],
    }).compile();

    pricesController = moduleRef.get<PricesController>(PricesController);
    pricesService = moduleRef.get<PricesService>(PricesService);
    cacheManager = moduleRef.get<Cache>(CACHE_MANAGER);
  });

  describe('GET', () => {
    describe('getCrude', () => {
      it('should return cached data when data exists', async () => {
        jest
          .spyOn(cacheManager, 'get')
          .mockResolvedValueOnce(getCrudeDataStub());
        const result = await pricesController.getCrude();
        expect(result).toEqual(getCrudeDataStub());
      });

      it('should cache data when no cached data', async () => {
        jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
        await pricesController.getCrude();
        expect(cacheManager.set).toHaveBeenCalled();
      });

      it('should return fresh data when no cached data', async () => {
        jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
        pricesService.getCrude = jest.fn().mockResolvedValueOnce({
          data: getCrudeDataStub(),
        });
        const result = await pricesController.getCrude();
        expect(result).toEqual(getCrudeDataStub());
        expect(cacheManager.get).toHaveBeenCalled();
      });
    });

    describe('get95', () => {
      const response = [fuelDataStub()];
      it('should return cached data when data exists', async () => {
        jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(response);
        const result = await pricesController.get95();
        expect(result).toEqual(response);
        expect(pricesService.get95).not.toHaveBeenCalled();
      });

      it('should cache data when no cached data', async () => {
        jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
        await pricesController.get95();
        expect(cacheManager.set).toHaveBeenCalled();
      });

      it('should return fresh data when no cached data', async () => {
        jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
        pricesService.get95 = jest.fn().mockResolvedValueOnce(response);
        const result = await pricesController.get95();
        expect(result).toEqual(response);
        expect(cacheManager.get).toHaveBeenCalled();
      });
    });

    describe('get98', () => {
      const response = [fuelDataStub()];

      it('should return cached data when data exists', async () => {
        jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(response);
        const result = await pricesController.get98();
        expect(result).toEqual(response);
        expect(pricesService.get98).not.toHaveBeenCalled();
      });

      it('should cache data when no cached data', async () => {
        jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
        await pricesController.get98();
        expect(cacheManager.set).toHaveBeenCalled();
      });

      it('should return fresh data when no cached data', async () => {
        jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
        pricesService.get98 = jest.fn().mockResolvedValueOnce(response);
        const result = await pricesController.get98();
        expect(result).toEqual(response);
        expect(cacheManager.get).toHaveBeenCalled();
      });
    });

    describe('getDiesel', () => {
      const response = [fuelDataStub()];

      it('should return cached data when data exists', async () => {
        jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(response);
        const result = await pricesController.getDiesel();
        expect(result).toEqual(response);
        expect(pricesService.getDiesel).not.toHaveBeenCalled();
      });

      it('should cache data when no cached data', async () => {
        jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
        await pricesController.getDiesel();
        expect(cacheManager.set).toHaveBeenCalled();
      });

      it('should return fresh data when no cached data', async () => {
        jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
        pricesService.getDiesel = jest.fn().mockResolvedValueOnce(response);
        const result = await pricesController.getDiesel();
        expect(result).toEqual(response);
        expect(cacheManager.get).toHaveBeenCalled();
      });
    });

    describe('getLpg', () => {
      const response = [fuelDataStub()];

      it('should return cached data when data exists', async () => {
        jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(response);
        const result = await pricesController.getLpg();
        expect(result).toEqual(response);
        expect(pricesService.getLpg).not.toHaveBeenCalled();
      });

      it('should cache data when no cached data', async () => {
        jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
        await pricesController.getLpg();
        expect(cacheManager.set).toHaveBeenCalled();
      });

      it('should return fresh data when no cached data', async () => {
        jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
        pricesService.getLpg = jest.fn().mockResolvedValueOnce(response);
        const result = await pricesController.getLpg();
        expect(result).toEqual(response);
        expect(cacheManager.get).toHaveBeenCalled();
      });
    });
  });

  describe('create95', () => {
    it('deletes cache', async () => {
      await pricesController.create95(fuelDataStub());
      expect(cacheManager.del).toHaveBeenCalled();
    });

    it('returns created data', async () => {
      jest
        .spyOn(pricesService, 'create95')
        .mockResolvedValueOnce(fuelDataStub());
      const result = await pricesController.create95(fuelDataStub());
      expect(result).toEqual(fuelDataStub());
      expect(pricesService.create95).toHaveBeenCalled();
    });
  });

  describe('create98', () => {
    it('deletes cache', async () => {
      await pricesController.create98(fuelDataStub());
      expect(cacheManager.del).toHaveBeenCalled();
    });

    it('returns created data', async () => {
      jest
        .spyOn(pricesService, 'create98')
        .mockResolvedValueOnce(fuelDataStub());
      const result = await pricesController.create98(fuelDataStub());
      expect(result).toEqual(fuelDataStub());
      expect(pricesService.create98).toHaveBeenCalled();
    });
  });

  describe('createDiesel', () => {
    it('deletes cache', async () => {
      await pricesController.createDiesel(fuelDataStub());
      expect(cacheManager.del).toHaveBeenCalled();
    });

    it('returns created data', async () => {
      jest
        .spyOn(pricesService, 'createDiesel')
        .mockResolvedValueOnce(fuelDataStub());
      const result = await pricesController.createDiesel(fuelDataStub());
      expect(result).toEqual(fuelDataStub());
      expect(pricesService.createDiesel).toHaveBeenCalled();
    });
  });

  describe('createLpg', () => {
    it('deletes cache', async () => {
      await pricesController.createLpg(fuelDataStub());
      expect(cacheManager.del).toHaveBeenCalled();
    });

    it('returns created data', async () => {
      jest
        .spyOn(pricesService, 'createLpg')
        .mockResolvedValueOnce(fuelDataStub());
      const result = await pricesController.createLpg(fuelDataStub());
      expect(result).toEqual(fuelDataStub());
      expect(pricesService.createLpg).toHaveBeenCalled();
    });
  });
});
