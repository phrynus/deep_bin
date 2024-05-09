import axios, { AxiosRequestConfig, AxiosStatic } from 'axios';
import crypto from 'crypto';
import { db } from '../../models_sqlite';

export class Binance {
  axios: any;
  key: string;
  secret: string;
  timeGap: number;
  timeRquest: number;
  consuming: number;

  constructor(key: string, secret: string) {
    this.axios = axios.create({
      baseURL: process.env.BINANCE_API_URL,
    });
    // KEY密钥
    this.key = key;
    this.secret = secret;
    // 时间差
    this.timeGap = Number(process.env.BINANCE_TIME_GAP) || 0;
    //
    this.consuming = 0;
    // 初始化
    const _this = this;
    // 配置
    // 请求
    this.axios.interceptors.request.use((config: any) => {
      _this.consuming = new Date().getTime();
      if (!config.params) config.params = {};
      config.params.timestamp = new Date().getTime() + _this.timeGap;
      const serialisedParams = Object.entries(config.params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      const signature = crypto.createHmac('sha256', this.secret).update(serialisedParams).digest('hex');
      config.url = `${config.url}?${serialisedParams}&signature=${signature}`;
      config.headers = {
        'X-MBX-APIKEY': this.key,
      };
      config.params = undefined;
      return config;
    });
    // 接收
    this.axios.interceptors.response.use(
      (response: any) => {
        db.log.add({
          _id: _this.key,
          type: 'trace',
          tag: 'axios_binance',
          msg: `Ms:${new Date().getTime() - _this.consuming}`,
          data: JSON.stringify(response.data),
        });
        return response.data;
      },
      (error: any) => {
        db.log.add({
          _id: _this.key,
          type: 'error',
          tag: 'axios_binance',
          msg: `Ms:${new Date().getTime() - _this.consuming}`,
          data: JSON.stringify(error.response?.data || error.message),
        });
        if (error.response?.data) {
          if (error.response.status != 404) {
            console.error('axios_binance', error.response.data);
          } else {
            console.error('axios_binance', error.response.message);
          }
        }
        return false;
      }
    );
  }

  _axios(options: AxiosRequestConfig) {
    return this.axios(options);
  }
}
