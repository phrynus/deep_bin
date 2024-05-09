import { t } from 'elysia';
import { tvTag } from './tag';
import { db } from '../../models_sqlite';
import CryptoJS from 'crypto';
import { Binance } from '../../lib/fun/binance';
import { log } from '../../models_sqlite/log';

export const tv = ({ params: { keyId }, body }: { params: any; body: any; request: any }) => {
  try {
    db.log.add({
      _id: keyId,
      type: 'info',
      tag: 'TV',
      msg: '收到请求',
      data: JSON.stringify(body),
    });
    //
    if (!body || !keyId) throw new Error('Invalid request');
    const key: any = db.key.get(keyId);
    if (!key) throw new Error('Invalid keyId');
    const keyConfig = db.keyConfig.get(keyId, body.ticker);
    if (!keyConfig) throw new Error('Invalid keyConfig');
    const keyBin = new Binance(key.key, key.secret);
    const tvTagData = tvTag(body);
    tvTagData.quantity = Number(tvTagData.quantity) * Number(keyConfig.doubly);

    //
    return tvTagData;
  } catch (error: any) {
    db.log.add({
      _id: keyId,
      type: 'error',
      tag: 'TV',
      msg: error.toString(),
      data: JSON.stringify({ keyId, body, error }),
    });
    return error;
  }
};
