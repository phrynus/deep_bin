import { db } from './lib';
type UserType = { uuid: string; user: string; password: string; vip: number; fen: number; data: string };
type UserSetType = { user: string; password: string; vip: number; fen: number; data: string };
export const _user = {
  get: db.query(`SELECT * FROM "user" WHERE user = ? AND password = ?`),
  getUuid: db.query(`SELECT * FROM "user" WHERE uuid = ?`),
  getIsVip: db.query(`SELECT * FROM "user" WHERE user = ? AND vip > ?`),
  getIsName: db.query(`SELECT user FROM "user" WHERE user = ?`),
  add: db.query(`INSERT INTO "user" (uuid, user, password, vip, fen, data) VALUES (?, ?, ?, ?, ?, ?)`),
  set: db.query(`UPDATE "user" SET user = ?, password = ?, vip = ?, fen = ?, data = ? WHERE uuid = ?`),
  setName: db.query(`UPDATE "user" SET user = ? WHERE uuid = ?`),
  setVip: db.query(`UPDATE "user" SET vip = ? WHERE uuid = ?`),
  setFen: db.query(`UPDATE "user" SET fen = ? WHERE uuid = ?`),
  setData: db.query(`UPDATE "user" SET data = ? WHERE uuid = ?`),
};
export const user = {
  get: (...e: any) => _user.get.get(...e),
  getUuid: (uuid: string) => _user.getUuid.get(uuid),
  getIsVip: (user: string) => _user.getIsVip.all(user, new Date().getTime()).length > 0,
  getIsName: (user: string) => _user.getIsName.all(user).length > 0,
  add: (obj: UserType) => {
    try {
      if (user.getIsName(obj.user)) throw new Error('用户名已存在');
      _user.add.run(...Object.keys(obj).map((v) => obj[v]));
      return true;
    } catch (e: any) {
      return false;
    }
  },
  set: (uuid: string, obj: UserSetType) => {
    try {
      let userdata: any = user.getUuid(uuid);
      obj = { ...userdata, ...obj };
      _user.set.run(obj.user, obj.password, obj.vip, obj.fen, obj.data, uuid);
      return true;
    } catch (e: any) {
      return false;
    }
  },
  setName: (uuid: string, user: string) => _user.setName.run(user, uuid),
  setVip: (uuid: string, vip: number) => _user.setVip.run(vip, uuid),
  setFen: (uuid: string, fen: number) => _user.setFen.run(fen, uuid),
  setData: (uuid: string, data: string) => _user.setData.run(data, uuid),
};
