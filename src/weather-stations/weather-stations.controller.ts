import { Controller, Get, Query } from '@nestjs/common';
import { WeatherStationsService } from './weather-stations.service';

@Controller('weather-stations')
export class WeatherStationsController {
  constructor(private readonly service: WeatherStationsService) {}

  @Get('by-state')
  getStationsByState(@Query('state') state?: string) {
    if (!state || state.toUpperCase() === 'ALL') {
      return this.service.findAllWithLatestMeasurements();
    }
    return this.service.findByStateWithLatestMeasurements(state.toUpperCase());
  }
}
