import { Entity } from '@mikro-orm/core';
import { PersonEntity } from './person.entity';

@Entity({
  discriminatorValue: 'EMPLOYEE',
})
export class EmployeeEntity extends PersonEntity {}
