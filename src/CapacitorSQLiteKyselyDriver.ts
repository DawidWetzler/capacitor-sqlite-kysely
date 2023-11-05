import { Capacitor } from '@capacitor/core';
import { DatabaseConnection, Driver, TransactionSettings } from 'kysely';

import { CapacitorSQLiteKyselyConnection } from './CapacitorSQLiteKyselyConnection';

export class CapacitorSQLiteKyselyDriver implements Driver {
  #config: CapacitorSQLiteKyselyConfig;
  #sqlite: CapacitorSQLiteKysely;
  #platform: string = '';

  constructor(
    client: CapacitorSQLiteKysely,
    config: CapacitorSQLiteKyselyConfig
  ) {
    this.#sqlite = client;
    this.#config = config;
    this.#platform = Capacitor.getPlatform();
  }

  async init(): Promise<void> {
    if (this.#platform !== 'web') {
      return;
    }

    await this.#sqlite.initWebStore();
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
    connection: CapacitorSQLiteKyselyConnection,
    settings: TransactionSettings
  ): Promise<void> {
    await connection.db.beginTransaction();
  }

  async commitTransaction(
    connection: CapacitorSQLiteKyselyConnection
  ): Promise<void> {
    await connection.db.commitTransaction();

    if (this.#platform !== 'web') {
      return;
    }

    this.#sqlite.saveToStore(this.#config.name);
  }

  async rollbackTransaction(
    connection: CapacitorSQLiteKyselyConnection
  ): Promise<void> {
    await connection.db.rollbackTransaction();
  }

  async releaseConnection(
    connection: CapacitorSQLiteKyselyConnection
  ): Promise<void> {
    // not implemented
  }

  async destroy(): Promise<void> {
    this.#sqlite.closeConnection(this.#config.name, this.#config.readonly);
  }
}
