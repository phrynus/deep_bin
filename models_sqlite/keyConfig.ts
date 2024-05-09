import { db } from './lib';

type keyConfigType = {
  key_id: string;
  symbol: string;
  type: string;
  timelnForce: string;
  doubly: string;
  leverage: string;
  necessary: string;
  balance: string;
};
type keyConfigSetType = {
  type: string;
  timelnForce: string;
  doubly: string;
  leverage: string;
  necessary: string;
  balance: string;
};

export const _keyConfig = {
  get: db.query(`SELECT * FROM "key_config" WHERE key_id = ? AND symbol = ?`),
  getAll: db.query(`SELECT * FROM "key_config" WHERE key_id = ?`),
  add: db.query(`INSERT INTO "key_config" (key_id,symbol,type,timelnForce,doubly,leverage,necessary,balance) VALUES (?,?,?,?,?,?,?,?)`),
  set: db.query(`UPDATE "key_config" SET type = ?, timelnForce = ?, doubly = ?, leverage = ?, necessary = ?, balance = ? WHERE key_id = ? AND symbol = ?`),
};
export const keyConfig = {
  get: (mark_id: string, symbol: string) => _keyConfig.get.get(mark_id, symbol),
  getAll: (mark_id: string) => _keyConfig.get.get(mark_id),
  add: (obj: keyConfigType) => {
    try {
      if (keyConfig.get(obj.key_id, obj.symbol)) {
        return false;
      } else {
        _keyConfig.add.run(...Object.keys(obj).map((v) => obj[v]));
        return true;
      }
    } catch (e: any) {
      return false;
    }
  },
  set: (key_id: string, symbol: string, obj: keyConfigSetType) => {
    try {
      let keyConfigData: any = keyConfig.get(key_id, symbol);
      obj = { ...keyConfigData, ...obj };
      _keyConfig.set.run(obj.type, obj.timelnForce, obj.doubly, obj.leverage, obj.necessary, obj.balance, key_id, symbol);
      return true;
    } catch (e: any) {
      return e.toString();
    }
  },
};
