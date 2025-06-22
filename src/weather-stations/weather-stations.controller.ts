import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { WeatherStationsService } from './weather-stations.service';

@Controller('weather-stations')
export class WeatherStationsController {
  constructor(private readonly service: WeatherStationsService) {}

  @Get()
  getAllStations() {
    return this.service.findAllWithLatestMeasurements();
  }

  @Get('by-state')
  getStationsByState(@Query('state') state: string) {
    return this.service.findByState(state);
  }
}
