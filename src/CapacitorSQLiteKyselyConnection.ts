import { Capacitor } from '@capacitor/core';
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

  get db(): CapacitorSQLiteKyselyDatabaseConnection {
    return this.#database;
  }

  async executeQuery<R>(
    compiledQuery: CompiledQuery<unknown>
  ): Promise<QueryResult<R>> {
    const isTransaction = (await this.#database.isTransactionActive()).result;

    if (compiledQuery.sql.toLowerCase().includes('select') || isTransaction) {
      return this.executeSelectOrTransactionQuery(compiledQuery);
    }

    const { changes } = await this.#database.run(
      compiledQuery.sql,
      compiledQuery.parameters as any[],
      true,
      // everything or nothing is only supported
      compiledQuery.sql.toLowerCase().includes('returning') ? 'all' : 'no'
    );

    if (Capacitor.getPlatform() === 'web') {
      this.#sqlite.saveToStore(this.#config.name);
    }

    return {
      numAffectedRows: changes?.changes as bigint | undefined,
      insertId: changes?.lastId as bigint | undefined,
      rows: changes?.values as R[],
    };
  }

  async executeSelectOrTransactionQuery<R>(
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
