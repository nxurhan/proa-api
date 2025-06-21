import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeatherStation } from 'src/entities/weather-station.entity';
import { Variable } from 'src/entities/variable.entity';
import { Measurement } from 'src/entities/measurement.entity';
import * as glob from 'glob';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(WeatherStation)
    private weatherRepo: Repository<WeatherStation>,
    @InjectRepository(Variable)
    private variableRepo: Repository<Variable>,
    @InjectRepository(Measurement)
    private measurementRepo: Repository<Measurement>,
  ) {}
  mapColumnName(col: string, stationId: number): string {
    const map: Record<number, Record<string, string>> = {
      2: {
        avg_Wm2: 'GHI_inst',
        avg_airTemp: 'AirT_inst',
      },
    };

    return map[stationId]?.[col] || col;
  }
  async onApplicationBootstrap() {
    await this.seedWeatherStations();
    await this.seedVariables();
    await this.seedMeasurements();
    console.log('Seeding complete');
  }

  async seedWeatherStations() {
    const stations: WeatherStation[] = [];

    return new Promise<void>((resolve, reject) => {
      fs.createReadStream(
        path.join(__dirname, '../../data/weather_stations.csv'),
      )
        .pipe(csv())
        .on('data', (row) => {
          const station = this.weatherRepo.create({
            id: parseInt(row.id),
            ws_name: row.ws_name,
            site: row.site,
            portfolio: row.portfolio,
            state: row.state,
            latitude: parseFloat(row.latitude),
            longitude: parseFloat(row.longitude),
          });
          stations.push(station);
        })
        .on('end', async () => {
          await this.weatherRepo.save(stations);
          console.log(`Seeded ${stations.length} weather stations`);
          resolve();
        })
        .on('error', reject);
    });
  }

  async seedVariables() {
    const variables: Variable[] = [];

    return new Promise<void>((resolve, reject) => {
      fs.createReadStream(path.join(__dirname, '../../data/variables.csv'))
        .pipe(csv())
        .on('data', (row) => {
          const variable = this.variableRepo.create({
            var_id: parseInt(row.var_id),
            name: row.name,
            unit: row.unit,
            long_name: row.long_name,
            station: { id: parseInt(row.id) },
          });
          variables.push(variable);
        })
        .on('end', async () => {
          await this.variableRepo.save(variables);
          console.log(`Seeded ${variables.length} variables`);
          resolve();
        })
        .on('error', reject);
    });
  }

  async seedMeasurements() {
    const files = glob.sync('data/data_*.csv', { cwd: process.cwd() });
    console.log(`📂 Found ${files.length} measurement files`);

    for (const filePath of files) {
      const fileName = path.basename(filePath);
      const stationId = parseInt(fileName.match(/data_(\d+)\.csv/)?.[1] ?? '');

      const variables = await this.variableRepo.find({
        where: { station: { id: stationId } },
      });

      if (!variables.length) {
        console.warn(`No variables found for station ID ${stationId}`);
        continue;
      }

      const nameToVarMap = new Map(variables.map((v) => [v.name.trim(), v]));
      const batch: Measurement[] = [];

      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => {
            const rawTimestamp = row.timestamp;
            const timestamp = this.parseDate(rawTimestamp);

            if (!timestamp) {
              console.warn(`Invalid timestamp in ${fileName}:`, rawTimestamp);
              return;
            }

            for (const [key, value] of Object.entries(row)) {
              if (key.toLowerCase() === 'timestamp') continue;

              const trimmedKey = key.trim();
              const normalizedKey = this.mapColumnName(trimmedKey, stationId);
              const variable = nameToVarMap.get(normalizedKey);

              if (!variable) {
                console.warn(
                  `Variable not found for column '${trimmedKey}' in ${fileName}`,
                );
                continue;
              }

              const numericValue = parseFloat(value as string);
              if (isNaN(numericValue)) {
                console.warn(
                  `Invalid value '${value}' for '${trimmedKey}' in ${fileName}`,
                );
                continue;
              }

              const measurement = this.measurementRepo.create({
                variable: { var_id: variable.var_id },
                timestamp,
                value: numericValue,
              });

              batch.push(measurement);
            }
          })
          .on('end', async () => {
            if (batch.length > 0) {
              await this.measurementRepo.save(batch);
              console.log(
                `Seeded ${batch.length} measurements from ${fileName}`,
              );
            } else {
              console.warn(`⚠️ No valid measurements found in ${fileName}`);
            }
            resolve();
          })
          .on('error', (err) => {
            console.error(`Error reading ${fileName}:`, err);
            reject(err);
          });
      });
    }
  }

  parseDate(dateStr: string): Date | null {
    if (!dateStr || typeof dateStr !== 'string') return null;

    // Match format like: 29/08/2023 2:05:00 or 29/08/23 06:10
    const match = dateStr.match(
      /^(\d{2})\/(\d{2})\/(\d{2,4}) (\d{1,2}:\d{2})(?::\d{2})?$/,
    );
    if (!match) return null;

    let [_, day, month, year, time] = match;

    // Normalize to 4-digit year
    if (year.length === 2) {
      year = parseInt(year) < 50 ? `20${year}` : `19${year}`;
    }

    const iso = `${year}-${month}-${day}T${time.padStart(5, '0')}:00`;
    const date = new Date(iso);
    return isNaN(date.getTime()) ? null : date;
  }
}
