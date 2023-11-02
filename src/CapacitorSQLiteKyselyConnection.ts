import { CompiledQuery, DatabaseConnection, QueryResult } from 'kysely';

export class CapacitorSQLiteKyselyConnection implements DatabaseConnection {
  #config: CapacitorSQLiteKyselyConfig;
  #database: CapacitorSQLiteKyselyDatabaseConnection;
  #sqlite: CapacitorSQLiteKysely;

  constructor(
    config: CapacitorSQLiteKyselyConfig,
    db: CapacitorSQLiteKyselyDatabaseConnection,
    sqlite: CapacitorSQLiteKysely
  ) {
    this.#config = config;
    this.#database = db;
    this.#sqlite = sqlite;
  }

  async executeQuery<R>(
    compiledQuery: CompiledQuery<unknown>
  ): Promise<QueryResult<R>> {
    if (compiledQuery.sql.toLowerCase().includes('select')) {
      return this.executeSelectQuery(compiledQuery);
    }

    const { changes } = await this.#database.run(
      compiledQuery.sql,
      compiledQuery.parameters as any[],
      true,
      // everything or nothing is only supported
      compiledQuery.sql.toLowerCase().includes('returning') ? 'all' : 'no'
    );

    try {
      this.#sqlite.saveToStore(this.#config.name);
    } catch (e) {
      // will throw on ios/android
    }

    return {
      numAffectedRows: changes?.changes as bigint | undefined,
      insertId: changes?.lastId as bigint | undefined,
      rows: changes?.values as R[],
    };
  }

  async executeSelectQuery<R>(
    compiledQuery: CompiledQuery<unknown>
  ): Promise<QueryResult<R>> {
    const { values } = await this.#database.query(
      compiledQuery.sql,
      compiledQuery.parameters as any[]
    );

    return {
      rows: values as R[],
    };
  }

  streamQuery<R>(
    compiledQuery: CompiledQuery<unknown>,
    chunkSize?: number | undefined
  ): AsyncIterableIterator<QueryResult<R>> {
    throw new Error('Streaming is not supported with SQLite3');
  }
}
