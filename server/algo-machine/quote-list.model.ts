import { PropNumber, Quote } from "./quote.model";

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