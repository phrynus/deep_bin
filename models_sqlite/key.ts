import { db } from "./lib";

type keyType = {
  user_id: string;
  mark_id: string;
  name: string;
  key: string;
  secret: string;
  password: string;
  exchange: string;
};

export const _key = {
  get: db.query(`SELECT * FROM "key" WHERE mark_id = ?`),
  getUser: db.query(`SELECT * FROM "key" WHERE user_id = ?`),
  getKey: db.query(`SELECT * FROM "key" WHERE key = ?`),
  getAll: db.query(`SELECT * FROM "key"`),
  add: db.query(
    `INSERT INTO "key" (user_id,mark_id,name,key,secret,password,exchange) VALUES (?,?,?,?,?,?,?)`,
  ),
  setName: db.query(`UPDATE "key" SET name = ? WHERE mark_id = ?`),
};
export const key = {
  get: (mark_id: string) => _key.get.get(mark_id),
  getUser: (user_id: string) => _key.getUser.all(user_id),
  getKey: (key: string) => _key.getKey.get(key),
  getAll: () => _key.getAll.all(),
  add: (obj: keyType) => {
    try {
      _key.add.run(...Object.keys(obj).map((v) => obj[v]));
      return true;
    } catch (e: any) {
      console.log(e);
      return false;
    }
  },
  setName: (mark_id: string, name: string) => _key.setName.run(name, mark_id),
};
