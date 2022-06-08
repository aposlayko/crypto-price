import { Kline } from "./kline.model";

interface KlineSettings {
  maxStorageSize: number;
}

export class KlinesStorage {
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

  /**
   * 
   * @param price current price 
   * @param symbol crypto name
   * @returns from 0 to 1 (0 - lowest price position, 1 - highest)
   */
  getHighOrDeepValue(price: number, symbol: string, lastKlineCount?: number): number {    
    let deepP = Infinity;
    let highP = -Infinity;
    let limit = this.settings.maxStorageSize;

    if (lastKlineCount) {
      limit = lastKlineCount;
    }

    this.storage[symbol].slice(-limit).forEach(k => {
      if (k.highP > highP) {
        highP = k.highP;
      }
      if (k.lowP < deepP) {
        deepP = k.lowP;
      }
    });    

    return (price - deepP) / (highP - deepP);
  }
}