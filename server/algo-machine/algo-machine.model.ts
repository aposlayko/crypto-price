import { EventEmitter } from "stream";
import { QuoteList } from "./quote-list.model";
import { Quote } from "./quote.model";
import { QuotesEmitterService } from "./quotes-emitter.service";

interface AlgoMachineOptions {
  emitter: QuotesEmitterService;
  quoteList?: QuoteList;
}

export class AlgoMachine {
  private emitter: QuotesEmitterService;
  private quoteList: QuoteList;

  constructor(options: AlgoMachineOptions) {
    this.emitter = options.emitter; 
    this.quoteList = options.quoteList ? options.quoteList : new QuoteList();
  }

  start() {
    this.emitter.start()
    .on("new-quote", (quote: Quote) => {
      this.quoteList.add(quote);
    })
    .on("close", () => {
      console.log(this.quoteList.reverse());
    });
  }
}
