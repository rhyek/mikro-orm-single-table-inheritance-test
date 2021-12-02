import { Entity } from '@mikro-orm/core';
import { PersonEntity } from './person.entity';

@Entity({
  discriminatorValue: 'BOSS',
})
export class BossEntity extends PersonEntity {}
