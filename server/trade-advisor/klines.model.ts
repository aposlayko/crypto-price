import { Kline } from "./kline.interface";

interface KlineSettings {
  maxStorageSize: number;
}

export class Klines {
  storage: {[key: string]: Kline[]} = {};
  settings: KlineSettings;

  constructor(settings: KlineSettings) {
    this.settings = settings;
  }

  add(symbol: string, kline: Kline): void {
    if (!this.storage[symbol]) {
      this.storage[symbol] = [];
    }

    this.storage[symbol].push(kline);    

    if(this.storage[symbol].length > this.settings.maxStorageSize)  {
      this.storage[symbol].shift();        
    }
  }

  clear() {
    this.storage = {};
  }
  static aspectRatioPrice(kline: Kline): {low: number, bodyLow: number, bodyHigh: number, high: number} {
    const sortedPrices = [kline.lowP, kline.openP, kline.closeP, kline.highP].sort();
    

    return {low: sortedPrices[0], bodyLow: sortedPrices[1], bodyHigh: sortedPrices[2], high: sortedPrices[3]};
  }

  static aspectRatioPercent(kline: Kline): {low: number, body: number, high: number} {
    const sortedPrices = [kline.lowP, kline.openP, kline.closeP, kline.highP].sort();
    const range = kline.highP - kline.lowP;
    const low = (sortedPrices[1] - sortedPrices[0]) / range * 100;
    const body = (sortedPrices[2] - sortedPrices[1]) / range * 100;
    const high = (sortedPrices[3] - sortedPrices[2]) / range * 100;

    return {low, body, high};
  }

  static isHummerUp(kline: Kline): boolean {
    const ratio = this.aspectRatioPercent(kline);
    return ratio.high >= 60;
  }

  static isHummerDown(kline: Kline): boolean {
    const ratio = this.aspectRatioPercent(kline);
    return ratio.low >= 60;
  }
}