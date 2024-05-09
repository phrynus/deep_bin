import { db } from './lib';
type LogType = { _id: string; type: 'trace' | 'info' | 'warn' | 'error'; tag: string; msg: string; data: string };
export const _log = {
  add: db.query(`INSERT INTO "log" (_id,type, tag, msg,data, created_at) VALUES (?, ?, ?, ?, ?, ?)`),
};
export const log = {
  add: (obj: LogType) => {
    try {
      _log.add.run(...Object.keys(obj).map((v) => obj[v]), new Date().getTime());
      return true;
    } catch (e: any) {
      return false;
    }
  },
};
