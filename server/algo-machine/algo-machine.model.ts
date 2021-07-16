import { EventEmitter } from "stream";
import { QuoteList } from "./quote-list.model";
import { Quote } from "./quote.model";
import { QuotesEmitterService } from "./quotes-emitter.service";
import { DateRule } from "./rules/date.rule";
import { QuouteCountMoreThen } from "./rules/quote-count-more-then.rule";

interface AlgoMachineOptions {
  emitter: QuotesEmitterService;
  quoteList?: QuoteList;
}

export class AlgoMachine {
  private emitter: QuotesEmitterService;
  private quoteList: QuoteList;

  private dateRule: DateRule;
  private quoteCountMoreThenRule: QuouteCountMoreThen;

  constructor(options: AlgoMachineOptions) {
    this.emitter = options.emitter; 
    this.quoteList = options.quoteList ? options.quoteList : new QuoteList();
    this.initRules();
  }

  start() {
    this.emitter.start()
    .on("new-quote", (quote: Quote) => {
      this.quoteList.add(quote);
      this.checkRules(quote);
    })
    .on("close", () => {
      // console.log(this.quoteList.reverse());
    });
  }

  initRules() {
    this.dateRule = new DateRule(new Date(1559001600000), new Date(1564704000000));
    this.quoteCountMoreThenRule = new QuouteCountMoreThen(760);
  }

  checkRules(quote: Quote) {
    this.dateRule.update(quote);
    this.quoteCountMoreThenRule.update(quote);

    if (this.dateRule.check() && this.quoteCountMoreThenRule.check()) {
      console.log(quote);      
    }
  }
}
