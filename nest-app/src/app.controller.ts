import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PersonEntity } from './entities/person.entity';
import { TaskEntity } from './entities/task.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly em: EntityManager,
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: EntityRepository<TaskEntity>,
    @InjectRepository(PersonEntity)
    private readonly personsRepository: EntityRepository<PersonEntity>,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('persons')
  async getPersons(): Promise<string[]> {
    return (
      await this.personsRepository.createQueryBuilder().getResultList()
    ).map((p) => p.constructor.name);
  }

  @Get('tasks-then-persons')
  async getTasksThenPersons(): Promise<any> {
    const tasks = await this.tasksRepository
      .createQueryBuilder()
      .getResultList();
    const persons = await this.personsRepository
      .createQueryBuilder()
      .where({
        id: tasks.map((task) => task.person?.id).filter((id) => id),
      })
      .getResultList();
    return persons.map((person) => person.constructor.name);
  }

  @Get('tasks-then-fork-em-then-persons')
  async getTasksThenForkEmThenPersons(): Promise<any> {
    const tasks = await this.tasksRepository
      .createQueryBuilder()
      .getResultList();
    const persons = await this.em
      .fork(true)
      .createQueryBuilder(PersonEntity)
      .where({
        id: tasks.map((task) => task.person?.id).filter((id) => id),
      })
      .getResultList();
    return persons.map((person) => person.constructor.name);
  }
}
