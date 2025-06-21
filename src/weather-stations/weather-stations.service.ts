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
  async findByState(state: string) {
    return this.stationRepo.find({ where: { state } });
  }
  async findLatestMeasurements(id: number) {
    const station = await this.stationRepo.findOne({
      where: { id },
      relations: ['variables'],
    });
    if (!station) return null;

    const latest = await Promise.all(
      station.variables.map(async (v) => {
        const m = await this.measurementRepo.findOne({
          where: { variable: { var_id: v.var_id } },
          order: { timestamp: 'DESC' },
        });

        return m
          ? {
              variable: v.name,
              long_name: v.long_name,
              unit: v.unit,
              value: m.value,
              timestamp: m.timestamp,
            }
          : null;
      }),
    );

    return {
      station: {
        id: station.id,
        ws_name: station.ws_name,
        site: station.site,
        portfolio: station.portfolio,
        state: station.state,
        latitude: station.latitude,
        longitude: station.longitude,
      },
      measurements: latest.filter((m) => m !== null),
    };
  }
}
