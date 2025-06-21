import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Variable } from './variable.entity';

@Entity()
export class WeatherStation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ws_name: string;

  @Column()
  site: string;

  @Column()
  portfolio: string;

  @Column()
  state: string;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @OneToMany(() => Variable, (variable) => variable.station)
  variables: Variable[];
}
