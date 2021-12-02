import { Entity, Enum, PrimaryKey } from '@mikro-orm/core';

@Entity({
  tableName: 'person',
  discriminatorColumn: 'type',
  abstract: true,
})
export abstract class PersonEntity {
  @PrimaryKey()
  id!: number;

  @Enum()
  type!: 'BOSS' | 'EMPLOYEE';
}
