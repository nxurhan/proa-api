import { Test, TestingModule } from '@nestjs/testing';
import { WeatherStationsController } from './weather-stations.controller';

describe('WeatherStationsController', () => {
  let controller: WeatherStationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherStationsController],
    }).compile();

    controller = module.get<WeatherStationsController>(WeatherStationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
