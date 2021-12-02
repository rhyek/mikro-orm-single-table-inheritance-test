import { EntityManager } from '@mikro-orm/mysql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { entities } from './entities';

const storage = new AsyncLocalStorage<EntityManager>();

@Module({
  imports: [
    MikroOrmModule.forRoot({
      type: 'mysql',
      entities,
      clientUrl: 'mysql://root:root@localhost:6000/test',
      forceUtcTimezone: true,
      registerRequestContext: false,
      context: () => storage.getStore(),
      highlighter: new SqlHighlighter(),
    }),
    MikroOrmModule.forFeature({
      entities,
    }),
  ],
  exports: [MikroOrmModule],
})
export class DatabaseModule {}
