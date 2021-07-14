import { EventEmitter } from "stream";
import fs from "fs";
import { hystoricalData } from "./hystirical-data.service";
import path from "path";
import readline from "readline";

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

  private runFileEmitter(fileName: string, delayInSec: number): void {
    const fileStream = fs.createReadStream(
      path.join(hystoricalData.getFolderPath(), '/' + fileName)
    );

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      this.emitter.emit('new-quote', line);
    }).on('close', () => {
      this.emitter.emit('close');        
    });
  }
}