import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherStation } from './entities/weather-station.entity';
import { Variable } from './entities/variable.entity';
import { Measurement } from './entities/measurement.entity';
import { SeedService } from './seed/seed.service';
import { WeatherStationsModule } from './weather-stations/weather-stations.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'weather.db',
      entities: [WeatherStation, Variable, Measurement],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([WeatherStation, Variable, Measurement]),
    WeatherStationsModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
