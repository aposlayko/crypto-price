import { EventEmitter } from "stream";
import fs from "fs";

import readline from "readline";
import { PropNumber, Quote } from "./quote.model";

export enum QuotesDataType {
  File,
  Sockets,
}

interface QuotesOptions {
  type: QuotesDataType;
  path: string;
  delay: number;
}

export class QuotesEmitterService {
  private emitter: EventEmitter;
  private options: QuotesOptions;

  constructor(options: QuotesOptions) {
    this.emitter = new EventEmitter();
    this.options = options;
  }

  start(): EventEmitter {
    if (this.options.type === QuotesDataType.File) {
      this.runFileEmitter(this.options.path, this.options.delay);
    }

    return this.emitter;
  }

  private runFileEmitter(filePath: string, delayInSec: number): void {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      const quote = this.convertCsvStringToQuote(line);

      if (quote) {
        this.emitter.emit("new-quote", quote);
      }
    }).on("close", () => {
      this.emitter.emit("close");
    });
  }

  private convertCsvStringToQuote(csvStr: string): Quote {
    if (!csvStr) return;

    const arr = csvStr.split(",").map((o) => Number(o));
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
        [Quote.PropNames[PropNumber.quoteAssetVolume]]:
          arr[PropNumber.quoteAssetVolume],
        [Quote.PropNames[PropNumber.numberOfTrades]]:
          arr[PropNumber.numberOfTrades],
        [Quote.PropNames[PropNumber.takerBuyBaseAssetVolume]]:
          arr[PropNumber.takerBuyBaseAssetVolume],
        [Quote.PropNames[PropNumber.takerBuyQuoteAssetVolume]]:
          arr[PropNumber.takerBuyQuoteAssetVolume],
        [Quote.PropNames[PropNumber.ignore]]: arr[PropNumber.ignore],
      });      
    } else {
      console.log("Wrong string format (CSV)");
    }

    return quote;
  }
}
