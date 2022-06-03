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
}