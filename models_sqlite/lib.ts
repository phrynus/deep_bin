import { Database } from 'bun:sqlite';

export const db = new Database('mydb.sqlite');
db.exec('PRAGMA journal_mode = WAL;');
