import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { WeatherStationsService } from './weather-stations.service';

@Controller('weather-stations')
export class WeatherStationsController {
  constructor(private readonly service: WeatherStationsService) {}

  @Get()
  getAllStations() {
    return this.service.findAll();
  }

  @Get(':id/latest')
  async getLatest(@Param('id') id: string) {
    const result = await this.service.findLatestMeasurements(+id);
    if (!result) throw new NotFoundException('Station not found');
    return result;
  }
}
