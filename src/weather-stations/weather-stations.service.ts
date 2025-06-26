import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeatherStation } from '../entities/weather-station.entity';
import { Variable } from '../entities/variable.entity';
import { Measurement } from '../entities/measurement.entity';

@Injectable()
export class WeatherStationsService {
  constructor(
    @InjectRepository(WeatherStation)
    private stationRepo: Repository<WeatherStation>,
    @InjectRepository(Variable)
    private variableRepo: Repository<Variable>,
    @InjectRepository(Measurement)
    private measurementRepo: Repository<Measurement>,
  ) {}

  findAll() {
    return this.stationRepo.find();
  }

  async findByStateWithLatestMeasurements(state: string) {
    const stations = await this.stationRepo.find({
      where: { state },
      relations: ['variables'],
    });

    return this.buildStationsWithMeasurements(stations);
  }

  async findAllWithLatestMeasurements() {
    const stations = await this.stationRepo.find({
      relations: ['variables'],
    });

    return this.buildStationsWithMeasurements(stations);
  }

  private async buildStationsWithMeasurements(stations: WeatherStation[]) {
    return await Promise.all(
      stations.map(async (station) => {
        const latestMeasurements = await Promise.all(
          station.variables.map(async (v) => {
            const m = await this.measurementRepo.findOne({
              where: { variable: { var_id: v.var_id } },
              order: { timestamp: 'DESC' },
            });

            if (!m) return null;

            return {
              long_name: v.long_name,
              unit: v.unit,
              value: m.value,
              timestamp: m.timestamp,
            };
          }),
        );

        return {
          id: station.id,
          ws_name: station.ws_name,
          site: station.site,
          portfolio: station.portfolio,
          state: station.state,
          latitude: station.latitude,
          longitude: station.longitude,
          latestMeasurements: latestMeasurements.filter(Boolean),
        };
      }),
    );
  }
}
