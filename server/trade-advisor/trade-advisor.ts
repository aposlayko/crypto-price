import { ServerKline } from "./server-kline.interface";
import { KlinesStorage } from "./klines-storage.model";
import { KlineListener } from "./listener";
import { Trades } from "./trades.model";
import { Kline } from "./kline.model";

const MAX_KLINES = 60;
const klineSettings = [{
  symbol: 'btcusdt',
  timeframe: '1m'
}, {
  symbol: 'ethusdt',
  timeframe: '1m'
}, {
  symbol: 'solusdt',
  timeframe: '1m'
}];

export class TradeAdvisor {
  klines = new KlinesStorage({maxStorageSize: MAX_KLINES});
  klineListener: KlineListener;
  trades = new Trades();

  start() {
    this.klineListener = new KlineListener(klineSettings, this.update.bind(this));
    this.klineListener.start();
  }

  stop() {
    this.klineListener.stop();
    this.klines.clear();
    this.trades.clear();
  }
  
  update(data: ServerKline): void {
    const isKlineClosed = data.k.x;
    const kline = Kline.fromServer(data);
    const symbol = data.s;

    if (isKlineClosed) {      
      this.klines.add(symbol, kline);
      this.openTrade(symbol, kline);   
      console.log(symbol);
      kline.log();
    }

    this.trades.onPriceTick(symbol, kline.closeP);
  }  
  
  openTrade(symbol: string, kline: Kline): void {
    const {low, bodyLow, bodyHigh, high} = kline.getMoreData();
    
    if (kline.isHummerUp()) {
      const stopLoss = bodyHigh + (high - bodyHigh) * 0.66;
      const stopLimit = kline.closeP - (stopLoss - kline.closeP) * 2;
      this.trades.open({
        symbol,
        type: 'short',
        startPrice: kline.closeP,
        stopLimit,
        stopLoss,
      });
    }
    if (kline.isHummerDown()) {
      const stopLoss = bodyLow + (low - bodyLow) * 0.66;
      const stopLimit = kline.closeP + (kline.closeP - stopLoss) * 2;
      this.trades.open({
        symbol,
        type: 'long',
        startPrice: kline.closeP,
        stopLimit,
        stopLoss,
      });
    }
  }  
}