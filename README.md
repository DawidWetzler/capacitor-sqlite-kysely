# Kysely - Capacitor SQLite

Custom dialect for [kysely] to use together with [capacitor sqlite][capacitor-sqlite].

## Installation
Ensure that you have [kysely][kysely], [@capacitor-community/sqlite][capacitor-sqlite] with `capacitor-sqlite-kysely` installed. 

```
npm install --save kysely @capacitor-community/sqlite capacitor-sqlite-kysely
```

```
yarn add kysely @capacitor-community/sqlite capacitor-sqlite-kysely
```

```
pnpm install --save kysely
pnpm install --save @capacitor-community/sqlite
pnpm install --save capacitor-sqlite-kysely
```

Please refer to [`@capacitor-community/sqlite`][capacitor-sqlite] as there is manual configuration necessary to run on the web for example.

## Usage

```typescript
import { Kysely } from 'kysely';
import CapacitorSQLiteKyselyDialect from 'capacitor-sqlite-kysely';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

export default new Kysely({
  dialect: new CapacitorSQLiteKyselyDialect(
    new SQLiteConnection(CapacitorSQLite),
    { name: 'database' }
  ),
});
```

## Configuration

```typescript
interface CapacitorSQLiteKyselyConfig {
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
   * @default 'no-encryption'
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

```

For further readings please refer to [@capacitor-community/sqlite][capacitor-sqlite].

## License

MIT License, see `LICENSE`.

[capacitor-sqlite]: https://github.com/capacitor-community/sqlite
[kysely]: https://kysely.dev