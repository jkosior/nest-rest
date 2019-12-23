import { pick } from 'lodash';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CurrencyDto } from '../currency/currency.dto';

@Entity('currency')
export class Currency extends BaseEntity {
  @Column()
  name: string;

  @Column('float')
  rate: number;

  static toDto(currency: Currency): CurrencyDto {
    return pick(currency, ['id', 'name', 'rate']);
  }
}
