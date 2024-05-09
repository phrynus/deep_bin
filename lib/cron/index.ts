import { CronJob } from 'cron';
import { _config } from '../../config';
import { db } from '../../models_sqlite';
import { Binance } from '../fun/binance';
import axios from 'axios';

await new Binance('', '')
  ._axios({
    method: 'GET',
    url: '/fapi/v1/time',
  })
  .then((res: any) => {
    process.env.BINANCE_TIME_GAP = (res.serverTime - new Date().getTime()).toString();
  });

export type binAccountType = {
  // 钱包余额
  wb: number;
  p: Array<{
    s: string; // 交易对
    pa: number; // 仓位
    ep: number; // 入仓价格
    up: number; // 持仓未实现盈亏
    mt: string; // 保证金模式
    ps: string; // 持仓方向
    t: number; // 更新时间
  }>;
};

const exchangeInfo = async () => {
  axios
    .get(`${process.env.BINANCE_API_URL}/fapi/v1/exchangeInfo`)
    .then((res) => {
      _config.binance.futures.exchangeInfo = res.data;
      console.log('exchangeInfo', new Date());
    })
    .catch((error) => {
      console.log('error', error.message);
    });
};
const accountInfo = async () => {
  const keys: Array<any> = db.key.getAll();
  keys.forEach(async (key) => {
    const keyBin = new Binance(key.key, key.secret);
    const accountData = await keyBin._axios({
      method: 'GET',
      url: '/fapi/v2/account',
    });
    if (accountData) {
      let records: binAccountType = {
        wb: accountData?.totalWalletBalance,
        p: accountData?.positions
          .filter((item: any) => Number(item.positionAmt) !== 0)
          .map((item: any) => {
            return {
              s: item.symbol, // 交易对
              pa: Number(item.positionAmt), // 仓位
              ep: Number(item.entryPrice), // 入仓价格
              up: Number(item.unrealizedProfit), // 持仓未实现盈亏
              mt: item.isolated ? 'ISOLATED' : 'CROSSED', // 保证金模式
              ps: item.positionSide, // 持仓方向
              t: item.updateTime, // 更新时间s
            };
          }),
      };
      console.log(records);
    }
  });
};

export const cronInit = () => {
  // 更新参数
  exchangeInfo();
  accountInfo();
  new CronJob('0 * * * *', exchangeInfo).start();
  new CronJob('*/5 * * * *', accountInfo).start();
  new CronJob('0 * * * *', () => {
    new Binance('', '')
      ._axios({
        method: 'GET',
        url: '/fapi/v1/time',
      })
      .then((res: any) => {
        // console.log(res);
        process.env.BINANCE_TIME_GAP = (res.serverTime - new Date().getTime()).toString();
      });
  }).start();
};
