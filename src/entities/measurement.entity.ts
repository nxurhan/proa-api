import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Variable } from './variable.entity';

@Entity()
export class Measurement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Variable, (variable) => variable.measurements)
  variable: Variable;

  @Column('datetime')
  timestamp: Date;

  @Column('float')
  value: number;
}
