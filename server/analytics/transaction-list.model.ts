import {convertTextToNumber} from './convert.helper';
import {CoinsInfo} from './coinmarketcap.service';

enum Operation_v2 {
  Buy = "купля",
  Sell = "продажа",
  Deposit = "завод",
  Withdraw = "вывод",
}

export interface Analytic {
  [key: string]: {
    name: string;
    amount: number;
    buyAmount: number;
    cost: number;
    midPrice: number;
    currentPrice: number;
    currentCost: number;
    profit: number;
    profitPer: number;
    lastActionPrice: number;
    percentFromLastAction: number;
  };
}

export class Transaction_v2 {
  from: string;
  to: string;
  amount: number;
  price: number;
  date: Date;
  type: Operation_v2;

  constructor(from: string, to: string, type: string, amount: number, price: number, date: Date) {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.price = price;
    this.date = date;
    this.type = type as Operation_v2;
  }

  get isDeposit(): boolean {
    return Boolean(this.from);
  }

  get isWithdraw(): boolean {
    return Boolean(this.to);
  }
}

export class TransactionList {
  transactionList: Transaction_v2[];

  constructor(rawData: [string, string, string, string, string, string][]) {
    this.transactionList = this.fromServer(rawData);
  }

  fromServer(rawData: [string, string, string, string, string, string][]): Transaction_v2[] {
    return rawData
      .map(([from, to, type, amount, price, date]: [string, string, string, string, string, string]) => {
        const dateArr = date.split(".");

        return new Transaction_v2(
          from,
          to,
          type,
          convertTextToNumber(price),
          convertTextToNumber(amount),
          new Date(`${dateArr[1]}.${dateArr[0]}.${dateArr[2]}`)
        );
      })
      .sort((t1: Transaction_v2, t2: Transaction_v2) => {
        return Number(t1.date) - Number(t2.date);
      });
  }

  getUniqueNames() {
    return this.transactionList
      .map((o) => o.from)
      .concat(this.transactionList.map((o) => o.to))
      .filter(o => Boolean(o))
      .filter((v, i, a) => a.indexOf(v) === i);
  }


  getAnalytic(coinInfo: CoinsInfo): Analytic {
    let analytic: Analytic = {};

    this.transactionList.forEach((t) => {
      if (t.from && !analytic[t.from]) {
        analytic[t.from] = {
          name: '',
          amount: 0,
          buyAmount: 0,
          cost: 0,
          midPrice: 0,
          currentPrice: 0,
          currentCost: 0,
          profitPer: 0,
          profit: 0,
          lastActionPrice: 0,
          percentFromLastAction: 0
        }
      }

      if (t.to && !analytic[t.to]) {
        analytic[t.to] = {
          name: '',
          amount: 0,
          buyAmount: 0,
          cost: 0,
          midPrice: 0,
          currentPrice: 0,
          currentCost: 0,
          profitPer: 0,
          profit: 0,
          lastActionPrice: 0,
          percentFromLastAction: 0
        }
      }

      const analyticFrom = analytic[t.from];
      const analyticTo = analytic[t.to];

      if (analyticFrom) {
        analyticFrom.name = coinInfo[t.from].name;
        analyticFrom.currentPrice = coinInfo[t.from].price;
      }

      if (analyticTo) {
        analyticTo.name = coinInfo[t.to].name;
        analyticTo.currentPrice = coinInfo[t.to].price;
      }

      // ==== OPERATION PHASE ====
      // without analyticFrom
      if (t.type === Operation_v2.Deposit) {
        analyticTo.amount += t.amount;
        analyticTo.cost += t.amount * t.price;
      }

      // without analyticTo
      if (t.type === Operation_v2.Withdraw) {
        analyticFrom.amount -= t.amount;
        analyticFrom.cost -= t.amount * analyticFrom.midPrice;
      }

      if (t.type === Operation_v2.Buy) {
        analyticFrom.amount -= t.amount * t.price;
        analyticTo.amount += t.amount;
        analyticTo.cost += t.amount * t.price;
        analyticFrom.cost -= t.amount * t.price;
      }

      if (t.type === Operation_v2.Sell) {
        analyticFrom.amount -= t.amount;
        analyticTo.amount += t.amount  * t.price;
        analyticTo.cost += t.amount * t.price;
        analyticFrom.cost -= t.amount * analyticFrom.midPrice;
      }

      // ==== FINAL PHASE ====
      if (analyticFrom?.amount > 0) {
        analyticFrom.midPrice = analyticFrom.cost / analyticFrom.amount;
        analyticFrom.currentCost = analyticFrom.amount * analyticFrom.currentPrice;
        analyticFrom.profitPer = (analyticFrom.currentCost / analyticFrom.cost - 1) * 100;
        analyticFrom.profit = analyticFrom.currentCost - analyticFrom.cost;
      } else if (analyticFrom?.amount <= 0) {
        analyticFrom.cost = 0;
        analyticFrom.midPrice = 0;
        analyticFrom.currentCost = 0;
        analyticFrom.profitPer = 0;
        analyticFrom.profit = 0;
      }

      if (analyticTo?.amount > 0) {
        analyticTo.midPrice = analyticTo.cost / analyticTo.amount;
        analyticTo.currentCost = analyticTo.amount * analyticTo.currentPrice;
        analyticTo.profitPer = (analyticTo.currentCost / analyticTo.cost - 1) * 100;
        analyticTo.profit = analyticTo.currentCost - analyticTo.cost;
      } else if (analyticTo?.amount <= 0) {
        analyticTo.cost = 0;
        analyticTo.midPrice = 0;
        analyticFrom.currentPrice = 0;
        analyticTo.profitPer = 0;
        analyticTo.profit = 0;
      }
    });

    return analytic;
  }
}
