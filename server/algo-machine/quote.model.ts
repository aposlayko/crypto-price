export enum PropNumber {
  openTime,
  open,
  high,
  low,
  close,
  volum,
  closeTime,
  quoteAssetVolume,
  numberOfTrades,
  takerBuyBaseAssetVolume,
  takerBuyQuoteAssetVolume,
  ignore,
}

export class Quote {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
  quoteAssetVolume: number;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: number;
  takerBuyQuoteAssetVolume: number;
  ignore: number;
  
  static readonly PropNames = [
    'openTime',
    'open',
    'high',
    'low',
    'close',
    'volume',
    'closeTime',
    'quoteAssetVolume',
    'numberOfTrades',
    'takerBuyBaseAssetVolume',
    'takerBuyQuoteAssetVolume',
    'ignore',
  ];

  constructor(options: {[key: string]: number}) {
    this.openTime = options.openTime;
    this.open = options.open;
    this.high = options.high;
    this.low = options.low;
    this.close = options.close;
    this.volume = options.volume;
    this.closeTime = options.closeTime;
    this.quoteAssetVolume = options.quoteAssetVolume;
    this.numberOfTrades = options.numberOfTrades;
    this.takerBuyBaseAssetVolume = options.takerBuyBaseAssetVolume;
    this.takerBuyQuoteAssetVolume = options.takerBuyQuoteAssetVolume;
    this.ignore = options.ignore;
  }
}