import { routes } from './routes';
import { db } from './models_sqlite';
import CryptoJS from 'crypto';
import { cronInit } from './lib/cron';

try {
  // 初始化配置
  cronInit();
  //启动服务
  routes.listen(3000, (t) => {
    console.log(`${t.url}`);
  });
} catch (error) {
  console.log(error);
}
// console.log(db.key.get("664a2c1e-e0e4-4229-975a-17ec04d6b7fd"));
