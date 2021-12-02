import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { PersonEntity } from './person.entity';

@Entity({
  tableName: 'task',
})
export class TaskEntity {
  @PrimaryKey()
  id!: number;

  @ManyToOne({
    entity: () => PersonEntity,
  })
  person: PersonEntity;
}
