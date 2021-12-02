import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/mysql';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MikroORM } from '@mikro-orm/core';
import { PersonEntity } from '../src/entities/person.entity';
import { BossEntity } from '../src/entities/boss.entity';
import { EmployeeEntity } from '../src/entities/emloyee.entity';
import { TaskEntity } from '../src/entities/task.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let orm: MikroORM;
  let em: EntityManager;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    orm = moduleFixture.get(MikroORM);
    em = moduleFixture.get(EntityManager);

    await orm.em.nativeDelete(TaskEntity, {});
    await orm.em.nativeDelete(PersonEntity, {});

    await orm.em.nativeInsert(TaskEntity, {
      person: await orm.em.nativeInsert(PersonEntity, {
        type: 'BOSS',
      }),
    });
    await orm.em.nativeInsert(TaskEntity, {
      person: await orm.em.nativeInsert(PersonEntity, {
        type: 'EMPLOYEE',
      }),
    });
    await orm.em.nativeInsert(TaskEntity, {
      person: await orm.em.nativeInsert(PersonEntity, {
        type: 'BOSS',
      }),
    });
  });

  afterEach(async () => {
    await orm.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('em is available', () => {
    expect(em).toBeDefined();
  });

  it('gets concrete classses using entity manager', async () => {
    const persons = await orm.em.find(
      PersonEntity,
      {},
      { disableIdentityMap: true, orderBy: { id: 'asc' } },
    );
    persons.forEach((person, index) =>
      console.log(`${index}. ${person.constructor.name}`),
    );
    expect(persons[0].constructor).toEqual(BossEntity);
    expect(persons[1].constructor).toEqual(EmployeeEntity);
    expect(persons[2].constructor).toEqual(BossEntity);
  });

  it('gets concrete classses using query builder', async () => {
    const persons = await em
      .getRepository(PersonEntity)
      .createQueryBuilder()
      .where({})
      .orderBy({ id: 'asc' })
      .getResultList();
    persons.forEach((person, index) =>
      console.log(`${index}. ${person.constructor.name}`),
    );
    expect(persons[0].constructor).toEqual(BossEntity);
    expect(persons[1].constructor).toEqual(EmployeeEntity);
    expect(persons[2].constructor).toEqual(BossEntity);
  });

  it('/persons (direct)', async () => {
    await request(app.getHttpServer())
      .get('/persons')
      .expect(200)
      .then((response) => {
        console.log('response', response.body);
        expect(response.body).toMatchObject([
          'BossEntity',
          'EmployeeEntity',
          'BossEntity',
        ]);
      });
  });

  it('/tasks-then-persons (first load tasks, then their persons', async () => {
    await request(app.getHttpServer())
      .get('/tasks-then-persons')
      .expect(200)
      .then((response) => {
        console.log('response', response.body);
        expect(response.body).toMatchObject([
          'BossEntity',
          'EmployeeEntity',
          'BossEntity',
        ]);
      });
  });

  it('/tasks-then-fork-em-then-persons', async () => {
    await request(app.getHttpServer())
      .get('/tasks-then-fork-em-then-persons')
      .expect(200)
      .then((response) => {
        console.log('response', response.body);
        expect(response.body).toMatchObject([
          'BossEntity',
          'EmployeeEntity',
          'BossEntity',
        ]);
      });
  });
});
