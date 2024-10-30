import {
  Driver,
  Kysely,
  Dialect,
  QueryCompiler,
  SqliteAdapter,
  DialectAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler,
  DatabaseIntrospector,
} from 'kysely';

import { CapacitorSQLiteKyselyDriver } from './CapacitorSQLiteKyselyDriver';
import type {
  CapacitorSQLiteKysely,
  CapacitorSQLiteKyselyConfig,
} from './types';

export class CapacitorSQLiteKyselyDialect implements Dialect {
  #config: CapacitorSQLiteKyselyConfig;
  #sqlite: CapacitorSQLiteKysely;

  constructor(
    sqlite: CapacitorSQLiteKysely,
    config: Partial<CapacitorSQLiteKyselyConfig>
  ) {
    this.#config = {
      name: 'database',
      encryption: false,
      mode: 'no-encryption',
      version: 1,
      readonly: false,
      ...config,
    };
    this.#sqlite = sqlite;
  }

  createDriver(): Driver {
    return new CapacitorSQLiteKyselyDriver(this.#sqlite, this.#config);
  }

  createQueryCompiler(): QueryCompiler {
    return new SqliteQueryCompiler();
  }

  createAdapter(): DialectAdapter {
    return new SqliteAdapter();
  }

  createIntrospector(db: Kysely<any>): DatabaseIntrospector {
    return new SqliteIntrospector(db);
  }
}
