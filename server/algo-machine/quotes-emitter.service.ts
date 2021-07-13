import { EventEmitter } from "stream";

export enum QuotesDataType {
  File,
  Sockets
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

  private runFileEmitter(path: string, delayInSec: number): void {
    setInterval(() => {
      
    }, delayInSec * 1000);
  }
}