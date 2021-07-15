import { PropNumber, Quote } from "./quote.model";

export class QuoteList {
  private quoteList: Quote[] = [];

  constructor(quoteList?: Quote[]) {
    this.quoteList = quoteList ? quoteList : [];
  }
  
  add(quote: Quote): void {
    this.quoteList.push(quote);
  }

  getAll(): Quote[] {
    return this.quoteList;
  }

  reverse(): Quote {
    this.quoteList.reverse();
    return this.quoteList[this.quoteList.length - 1];
  }
}