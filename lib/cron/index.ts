import { CronJob } from "cron";
import { _config } from "../../config";
import axios from "axios";

const exchangeInfo = () => {
  axios
    .get("https://fapi.binance.com/fapi/v1/exchangeInfo")
    .then((res) => {
      _config.binance.futures.exchangeInfo = res.data;
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export const cronInit = () => {
  // 更新参数
  exchangeInfo();
  new CronJob("*/15 * * * *", exchangeInfo).start();
};
