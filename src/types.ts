export interface CapacitorSQLiteKyselyConfig {
  /**
   * name of database
   *
   * @default database
   */
  name: string;

  /**
   * whether the database should be encrypted
   *
   * @default false
   */
  encryption: boolean;

  /**
   * whether the database should be encrypted
   *
   * @default false
   * @modes "no-encryption", "encryption", "secret", "decryption", "newsecret", "wrongsecret"
   */
  mode: string;

  /**
   * @default 1
   */
  version: number;

  /**
   * whether use the database in read only mode
   *
   * @default false
   */
  readonly: boolean;
}

export interface CapacitorSQLiteKyselyDatabaseConnectionResult {
  result?: boolean;
}

export interface CapacitorSQLiteOptions {
  database?: string;
  readonly?: boolean;
}

export interface CapacitorSQLiteChangesResult {
  changes?: {
    changes?: number;
    lastId?: number;
    values?: any[];
  };
}

export interface CapacitorSQLiteKyselyDatabaseConnection {
  open(): Promise<void>;
  run(
    statement: string,
    values?: any[],
    transaction?: boolean,
    returnMode?: string,
    isSQL92?: boolean
  ): Promise<CapacitorSQLiteChangesResult>;
  query(
    statement: string,
    values?: any[],
    isSQL92?: boolean
  ): Promise<{
    values?: any[];
  }>;
  beginTransaction(): Promise<CapacitorSQLiteChangesResult>;
  commitTransaction(): Promise<CapacitorSQLiteChangesResult>;
  rollbackTransaction(): Promise<CapacitorSQLiteChangesResult>;
  isTransactionActive(): Promise<{ result?: boolean }>;
}

export interface CapacitorSQLiteKysely {
  closeConnection(database: string, readonly: boolean): Promise<void>;
  createConnection(
    database: string,
    encrypted: boolean,
    mode: string,
    version: number,
    readonly: boolean
  ): Promise<CapacitorSQLiteKyselyDatabaseConnection>;
  checkConnectionsConsistency({
    dbNames,
    openModes,
  }?: {
    dbNames?: string[];
    openModes?: string[];
  }): Promise<CapacitorSQLiteKyselyDatabaseConnectionResult>;
  isConnection(
    database: string,
    readonly: boolean
  ): Promise<CapacitorSQLiteKyselyDatabaseConnectionResult>;
  retrieveConnection(
    database: string,
    readonly: boolean
  ): Promise<CapacitorSQLiteKyselyDatabaseConnection>;
  initWebStore(): Promise<void>;
  saveToStore(database: string): Promise<void>;
}
