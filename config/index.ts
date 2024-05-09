import axios, { AxiosStatic } from "axios";
import { keys } from "./key";

export const _config = {
  binance: {
    futures: {
      exchangeInfo: null,
    },
  },
  bitget: {},
};
export const config = {
  binance: {
    getFuturesSymbols: () => {
      if (_config.binance.futures.exchangeInfo?.symbols) {
        return _config.binance.futures.exchangeInfo.symbols.filter(
          (s: any) => s.status === "TRADING",
        );
      }
      return [];
    },
    getFuturesSymbol: (symbol: string) => {
      return config.binance
        .getFuturesSymbols()
        .filter((s: any) => s.symbol + ".P" === symbol)[0];
    },
    getFuturesSymbolsText: () => {
      return config.binance.getFuturesSymbols().map((s: any) => s.symbol);
    },
  },
  bitget: {},
};
