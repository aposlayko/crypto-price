import { ServerKline } from "./server-kline.interface";

interface KlineAdditionalData {
  low: number;         // lowest price (same as lowP)
  bodyLow: number;     // lowest body canle price (actualy openP or closeP depends on time)
  bodyHigh: number;    // highest body candle price (actualy openP or closeP depends on time)
  high: number;        // highest price (same as closeP)
  lowPerc: number;     // aspect ratio for low part of candle (0 - 1)
  bodyPerc: number;    // aspect ratio for body part of candle (0 - 1)
  highPerc: number;    // aspect ratio for high part of candle (0 - 1)
}

export class Kline {
  openP: number;
  closeP: number;
  highP: number;
  lowP: number;
  
  constructor(openP: number, closeP: number, highP: number, lowP: number) {
    this.openP = openP;
    this.closeP = closeP;
    this.highP = highP;
    this.lowP = lowP;
  }

  static fromServer(data: ServerKline): Kline {
    return new Kline(
      Number(data.k.o),
      Number(data.k.c),
      Number(data.k.h),
      Number(data.k.l)
    );
  }

  getMoreData(): KlineAdditionalData {
    const sortedPrices = [this.lowP, this.openP, this.closeP, this.highP].sort();
    const range = this.highP - this.lowP;
    const lowPerc = (sortedPrices[1] - sortedPrices[0]) / range;
    const bodyPerc = (sortedPrices[2] - sortedPrices[1]) / range;
    const highPerc = (sortedPrices[3] - sortedPrices[2]) / range;  

    return {
      low: sortedPrices[0],
      bodyLow: sortedPrices[1],
      bodyHigh: sortedPrices[2],
      high: sortedPrices[3],
      lowPerc,
      bodyPerc,
      highPerc,
    };
  }

  isHummerUp(): boolean {
    return this.getMoreData().highPerc > 0.6;
  }

  isHummerDown(): boolean {
    return this.getMoreData().lowPerc > 0.6;
  }

  log(): void {
    const {lowPerc, bodyPerc, highPerc} = this.getMoreData();
    const low = (lowPerc * 100).toFixed(1);
    const body = (bodyPerc * 100).toFixed(1);
    const high = (highPerc * 100).toFixed(1);
    const date = new Date();

    console.log(`${low}% / ${body}% / ${high}% - ${date.getDate()}.${date.getMonth()} ${date.getHours()}:${date.getMinutes()}`);
  }
}