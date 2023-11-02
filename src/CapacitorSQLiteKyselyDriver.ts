import {
  Driver,
  CompiledQuery,
  DatabaseConnection,
  TransactionSettings,
} from 'kysely';

import { CapacitorSQLiteKyselyConnection } from './CapacitorSQLiteKyselyConnection';

export class CapacitorSQLiteKyselyDriver implements Driver {
  #config: CapacitorSQLiteKyselyConfig;
  #sqlite: CapacitorSQLiteKysely;

  constructor(
    client: CapacitorSQLiteKysely,
    config: CapacitorSQLiteKyselyConfig
  ) {
    this.#sqlite = client;
    this.#config = config;
  }

  async init(): Promise<void> {
    try {
      await this.#sqlite.initWebStore();
    } catch (e) {
      // will throw on ios/android
    }
  }

  async acquireConnection(): Promise<DatabaseConnection> {
    const ret = await this.#sqlite.checkConnectionsConsistency();

    const isConn = (
      await this.#sqlite.isConnection(this.#config.name, this.#config.readonly)
    ).result;

    if (ret.result && isConn) {
      const db = await this.#sqlite.retrieveConnection(
        this.#config.name,
        this.#config.readonly
      );

      return new CapacitorSQLiteKyselyConnection(
        this.#config,
        db,
        this.#sqlite
      );
    }

    const db = await this.#sqlite.createConnection(
      this.#config.name,
      this.#config.encryption,
      this.#config.mode,
      this.#config.version,
      this.#config.readonly
    );

    await db.open();

    return new CapacitorSQLiteKyselyConnection(this.#config, db, this.#sqlite);
  }

  async beginTransaction(
    connection: DatabaseConnection,
    settings: TransactionSettings
  ): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('BEGIN'));
  }

  async commitTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('COMMIT'));
  }

  async rollbackTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('ROLLBACK'));
  }

  async releaseConnection(connection: DatabaseConnection): Promise<void> {
    // not implemented
  }

  async destroy(): Promise<void> {
    this.#sqlite.closeConnection(this.#config.name, this.#config.readonly);
  }
}
