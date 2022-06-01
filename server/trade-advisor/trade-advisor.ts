import { Kline, ServerKline } from "./kline.interface";
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
  klines: {[key: string]: Kline[]} = {};
  klineListener: KlineListener;

  start() {
    this.klineListener = new KlineListener(klineSettings, this.update.bind(this));
    this.klineListener.start();
  }

  stop() {
    this.klineListener.stop();
  }
  
  update(data: ServerKline): void {
    // if kline closed
    if (data.k.x) {
      const kline = this.dataToKline(data);
      this.addKline(data.s, kline);
      console.log(this.klines[data.s]);
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

  addKline(symbol: string, kline: Kline) {
    if (!this.klines[symbol]) {
      this.klines[symbol] = [];
    }

    this.klines[symbol].push(kline);    

    if(this.klines[symbol].length > MAX_KLINES)  {
      this.klines[symbol].shift();        
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