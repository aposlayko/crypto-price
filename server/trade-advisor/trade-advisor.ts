import { Kline, ServerKline } from "./kline.interface";
import { Klines } from "./klines.model";
import { KlineListener } from "./listener";
import { Trades } from "./trades.model";

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
  klines = new Klines({maxStorageSize: MAX_KLINES});
  klineListener: KlineListener;
  trades = new Trades();

  start() {
    this.klineListener = new KlineListener(klineSettings, this.update.bind(this));
    this.klineListener.start();
  }

  stop() {
    this.klineListener.stop();
    this.klines.clear();
  }
  
  update(data: ServerKline): void {
    const isKlineClosed = data.k.x;
    const kline = this.dataToKline(data);
    const symbol = data.s;

    if (isKlineClosed) {      
      this.klines.add(symbol, kline);
      this.openTrade(symbol, kline);   
      console.log(symbol, this.analizeKline(kline)); 
    }

    this.trades.onPriceTick(symbol, kline.closeP);
  }

  dataToKline(data: ServerKline): Kline {
    return {
      openP: Number(data.k.o),
      closeP: Number(data.k.c),
      highP: Number(data.k.h),
      lowP: Number(data.k.l),
    };
  }
  
  openTrade(symbol: string, kline: Kline): void {
    const ar = Klines.aspectRatioPrice(kline);
    if (Klines.isHummerUp(kline)) {
      const stopLoss = ar.bodyHigh + (ar.high - ar.bodyHigh) * 0.66;
      const stopLimit = kline.closeP - (stopLoss - kline.closeP) * 2;
      this.trades.open({
        symbol,
        type: 'short',
        startPrice: kline.closeP,
        stopLimit,
        stopLoss,
      });
    }
    if (Klines.isHummerDown(kline)) {
      const stopLoss = ar.bodyLow + (ar.low - ar.bodyLow) * 0.66;
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

  analizeKline(kline: Kline) {
    // up body down
    const sortedPrices = [kline.lowP, kline.openP, kline.closeP, kline.highP].sort();
    const range = kline.highP - kline.lowP;
    const low = ((sortedPrices[1] - sortedPrices[0]) / range * 100).toFixed(1);
    const body = ((sortedPrices[2] - sortedPrices[1]) / range * 100).toFixed(1);
    const high = ((sortedPrices[3] - sortedPrices[2]) / range * 100).toFixed(1);
    const date = new Date();

    return `${low}% / ${body}% / ${high}% - ${date.getDate()}.${date.getMonth()} ${date.getHours()}:${date.getMinutes()}`;
  }
}