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

enum PropNumber {
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

export class QuoteList {
  private quoteList: Quote[] = [];

  constructor(quoteList?: Quote[]) {
    this.quoteList = quoteList ? quoteList : [];
  }

  addFromStr(str: string): Quote {
    if (!str) return;

    const arr = str.split(',').map(o => Number(o));
    let quote: Quote;

    if (arr.length === Quote.PropNames.length) {
      quote = new Quote({
        [Quote.PropNames[PropNumber.openTime]]: arr[PropNumber.openTime],
        [Quote.PropNames[PropNumber.open]]: arr[PropNumber.open],
        [Quote.PropNames[PropNumber.high]]: arr[PropNumber.high],
        [Quote.PropNames[PropNumber.low]]: arr[PropNumber.low],
        [Quote.PropNames[PropNumber.close]]: arr[PropNumber.close],
        [Quote.PropNames[PropNumber.volum]]: arr[PropNumber.volum],
        [Quote.PropNames[PropNumber.closeTime]]: arr[PropNumber.closeTime],
        [Quote.PropNames[PropNumber.quoteAssetVolume]]: arr[PropNumber.quoteAssetVolume],
        [Quote.PropNames[PropNumber.numberOfTrades]]: arr[PropNumber.numberOfTrades],
        [Quote.PropNames[PropNumber.takerBuyBaseAssetVolume]]: arr[PropNumber.takerBuyBaseAssetVolume],
        [Quote.PropNames[PropNumber.takerBuyQuoteAssetVolume]]: arr[PropNumber.takerBuyQuoteAssetVolume],
        [Quote.PropNames[PropNumber.ignore]]: arr[PropNumber.ignore],
      });

      this.quoteList.push(quote);
    } else {
      console.log('Wrong string format (Quote List Model)');      
    }

    return quote;
  }

  reverse(): Quote {
    this.quoteList.reverse();
    return this.quoteList[this.quoteList.length - 1];
  }
}