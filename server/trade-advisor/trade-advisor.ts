import { Kline, ServerKline } from "./kline.interface";
import { Klines } from "./klines.model";
import { KlineListener } from "./listener";

const MAX_KLINES = 10;
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
    if (isKlineClosed) {
      const kline = this.dataToKline(data);
      const symbol = data.s;
      this.klines.add(symbol, kline);      
      console.log(this.analizeKline(kline)); 
    }
  }

  dataToKline(data: ServerKline): Kline {
    return {
      openP: Number(data.k.o),
      closeP: Number(data.k.c),
      highP: Number(data.k.h),
      lowP: Number(data.k.l),
    };
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