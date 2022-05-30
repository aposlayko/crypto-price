import { Kline, ServerKline } from "./kline.interface";

const MAX_KLINES = 10;

export class Chart {
  klines: Kline[] = [];

  /**
   * @method update adds kline to list
   * @returns conclusion about kline
   */
  update(data: ServerKline): void {
    // if kline closed
    if (data.k.x) {
      const kline = this.dataToKline(data);
      this.addKline(kline);
      console.log(this.analizeKline(kline)); 
    }
  }

  dataToKline(data: ServerKline): Kline {
    return {
      openP: Number(data.k.o),
      closeP: Number(data.k.c),
      highP: Number(data.k.h),
      lowP: Number(data.k.l),
    };
  }

  addKline(kline: Kline) {
    this.klines.push(kline);    

    if(this.klines.length > MAX_KLINES)  {
      this.klines.shift();        
    }
  }

  analizeKline(kline: Kline) {
    // up body down
    const sortedPrices = [kline.lowP, kline.openP, kline.closeP, kline.highP].sort();
    const range = kline.highP - kline.lowP;
    const low = ((sortedPrices[1] - sortedPrices[0]) / range * 100).toFixed(1);
    const body = ((sortedPrices[2] - sortedPrices[1]) / range * 100).toFixed(1);
    const high = ((sortedPrices[3] - sortedPrices[2]) / range * 100).toFixed(1);
    const date = new Date();

    return `${low}% / ${body}% / ${high}% - ${date.getDate()}.${date.getMonth()} ${date.getHours()}:${date.getMinutes()}`;
  }
}