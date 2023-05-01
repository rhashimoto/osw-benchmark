import * as Comlink from 'comlink';
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

class Database {
  #sqlite3;
  #db;

  constructor() {
  }

  async prepare() {
    // Clear OPFS.
    const root = await navigator.storage.getDirectory();
    // @ts-ignore
    for await (const handle of root.values()) {
      await root.removeEntry(handle.name, { recursive: true });
    }

    this.#sqlite3 = await sqlite3InitModule({
      print: (...args) => console.log(...args),
      printErr: (...args) => console.error(...args),
    });

    this.#db = new this.#sqlite3.oo1.OpfsDb('/benchmarks');
  }

  query(statements) {
    const results = [];
    for (const statement of statements) {
      const output = {
        columns: [],
        rows: []
      };
      this.#db.exec(statement, {
        columnNames: output.columns,
        resultRows: output.rows
      });
      if (output.columns.length) {
        results.push(output)
      }
    }
    return results;
  }
}

Comlink.expose(new Database());