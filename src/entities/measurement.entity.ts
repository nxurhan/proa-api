import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Variable } from './variable.entity';

@Entity()
export class Measurement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Variable, (v) => v.measurements)
  @JoinColumn({ name: 'variable_id' })
  variable: Variable;

  @Column('datetime')
  timestamp: Date;

  @Column('float')
  value: number;
}
