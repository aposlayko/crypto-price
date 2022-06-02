type TradeType = 'long' | 'short';

interface Trade {
  type: TradeType;
  startPrice: number;
  stopLoss: number;
  stopLimit: number;
  symbol: string;
  isActive: boolean;
  dateStart: Date;
  dateFinish: Date;
  isSuccess: boolean;
}

export class Trades {
  storage: Trade[] = [];

  constructor() {

  }

  open(settings: Partial<Trade>): void {
    console.log(`Open trade ${settings.symbol}`);
    
    this.storage.push({
      type: settings.type,
      startPrice: settings.startPrice,
      stopLoss: settings.stopLoss,
      stopLimit: settings.stopLimit,
      symbol: settings.symbol,
      isActive: true,
      dateStart: new Date(),
      dateFinish: null,
      isSuccess: null,
    });
  }

  onPriceTick(symbol: string, price: number): void {
    this.storage.filter(t => t.isActive && t.symbol === symbol).forEach(t => {
      if (t.type === "long") {
        if (price >= t.stopLimit) {
          t.isActive = false;
          t.dateFinish = new Date();
          t.isSuccess = true;
          console.log('Long success', t);
        } else if (price <= t.stopLoss) {
          t.isActive = false;
          t.dateFinish = new Date();
          t.isSuccess = false;
          console.log('Long failed', t);
        }
      } else if (t.type = "short") {
        if (price <= t.stopLimit) {
          t.isActive = false;
          t.dateFinish = new Date();
          t.isSuccess = true;
          console.log('Short success', t);
        } else if (price >= t.stopLoss) {
          t.isActive = false;
          t.dateFinish = new Date();
          t.isSuccess = false;
          console.log('Short failed', t);
        }
      }
    })
  }

  clear(): void {
    this.log();
    this.storage = [];
  }

  log(): void {
    const all = this.storage.length;
    const success = this.storage.filter(t => t.isSuccess).length;
    const fail = this.storage.filter(t => t.isSuccess === false);
    const stillActive = this.storage.filter(t => t.isActive);

    console.log('all / success / fail / still active');
    console.log(`${all} / ${success} / ${fail} / ${stillActive}`);
  }
}