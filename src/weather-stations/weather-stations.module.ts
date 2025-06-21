import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherStationsController } from './weather-stations.controller';
import { WeatherStationsService } from './weather-stations.service';
import { WeatherStation } from '../entities/weather-station.entity';
import { Variable } from '../entities/variable.entity';
import { Measurement } from '../entities/measurement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WeatherStation, Variable, Measurement])],
  controllers: [WeatherStationsController],
  providers: [WeatherStationsService],
})
export class WeatherStationsModule {}
