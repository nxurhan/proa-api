import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { WeatherStation } from './weather-station.entity';
import { Measurement } from './measurement.entity';

@Entity()
export class Variable {
  @PrimaryGeneratedColumn()
  var_id: number;

  @ManyToOne(() => WeatherStation, (station) => station.variables)
  station: WeatherStation;

  @Column()
  name: string;

  @Column()
  unit: string;

  @Column()
  long_name: string;

  @OneToMany(() => Measurement, (measurement) => measurement.variable)
  measurements: Measurement[];
}
