import { CoinsInfo } from "./coinmarketcap.service";

const SCHEMA = [];

enum Operation {
  Buy = "купля",
  Sell = "продажа",
  Get = "завод",
  Send = "вывод",
}

enum TransactionProps {
  Name = "name",
  Operation = "operation",
  Price = "price",
  Amount = "amount",
  Date = "date",
}

const schema = [
  TransactionProps.Name,
  TransactionProps.Operation,
  TransactionProps.Price,
  TransactionProps.Amount,
  TransactionProps.Date,
];

interface Transaction {
  name: string;
  operation: Operation;
  price: number;
  amount: number;
  date: Date;
}

interface Analytic {
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

export class TransactionsListModel {
  transactionList: Transaction[];

  constructor(rawData: string[][]) {
    this.transactionList = this.fromServer(rawData);
  }

  fromServer(rawData: string[][]): Transaction[] {
    return rawData
      .map((o: string[]) => {
        let transaction;

        o.forEach((value, index) => {
          let resultValue: any;

          if (schema[index] === TransactionProps.Price) {
            resultValue = TransactionsListModel.convertToNumber(value);
          } else if (schema[index] === TransactionProps.Amount) {
            resultValue = TransactionsListModel.convertToNumber(value);
          } else if (schema[index] === TransactionProps.Date) {
            const dateArr = value.split(".");
            resultValue = new Date(`${dateArr[1]}.${dateArr[0]}.${dateArr[2]}`);
          } else if (schema[index] === TransactionProps.Name) {
            resultValue = value;
          } else {
            resultValue = value;
          }

          if (!transaction) transaction = {};

          transaction[schema[index]] = resultValue;
        });

        return transaction;
      })
      .sort((t1: Transaction, t2: Transaction) => {
        return Number(t1.date) - Number(t2.date);
      });
  }

  getUniqueNames() {
    return this.transactionList
      .map((o) => o.name)
      .filter((v, i, a) => a.indexOf(v) === i);
  }

  filterByName(name: string): Transaction[] {
    return this.transactionList.filter((o) => o.name === name);
  }

  getAnalytic(coinInfo: CoinsInfo): Analytic {    
    let analytic: Analytic = {};

    this.transactionList.forEach((t) => {
      if (!analytic[t.name]) {
        analytic[t.name] = {
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

      const analyticUnit = analytic[t.name];
      analyticUnit.name = coinInfo[t.name].name;
      analyticUnit.currentPrice = coinInfo[t.name].price;

      switch (t.operation) {
        case Operation.Buy:
          analyticUnit.amount += t.amount;
          analyticUnit.buyAmount += t.amount;

          if (analyticUnit.amount) {
            analyticUnit.cost += t.price * t.amount;
            analyticUnit.lastActionPrice = t.price;
          } else {
            analyticUnit.cost = 0;
            analyticUnit.midPrice = 0;
            analyticUnit.lastActionPrice = 0;
            analyticUnit.percentFromLastAction = 0;
          }

          break;

        case Operation.Sell:
          analyticUnit.amount -= t.amount;

          if (analyticUnit.buyAmount >= t.amount) {
            analyticUnit.buyAmount -= t.amount;
          } else {
            analyticUnit.buyAmount = 0;
          }
          

          if (analyticUnit.amount) {
            analyticUnit.cost -= analyticUnit.midPrice * t.amount;
            analyticUnit.lastActionPrice = t.price;
          } else {
            analyticUnit.cost = 0;
            analyticUnit.midPrice = 0;
            analyticUnit.lastActionPrice = 0;
            analyticUnit.percentFromLastAction = 0;
          }

          break;

        case Operation.Get:
          analyticUnit.amount += t.amount;

          if (!analyticUnit.amount) {
            analyticUnit.cost = 0;
            analyticUnit.midPrice = 0;
          }

          break;

        case Operation.Send:
          analyticUnit.amount -= t.amount;

          if (!analyticUnit.amount) {
            analyticUnit.cost = 0;
            analyticUnit.midPrice = 0;
          }

          break;
        }
      
      analyticUnit.midPrice = analyticUnit.buyAmount ? analyticUnit.cost / analyticUnit.buyAmount : 0;
      analyticUnit.currentCost = analyticUnit.buyAmount ? analyticUnit.buyAmount * analyticUnit.currentPrice : 0;
      analyticUnit.profitPer = analyticUnit.cost ? ((analyticUnit.currentCost / analyticUnit.cost) - 1) * 100 : 0;
      analyticUnit.profit = analyticUnit.currentCost - analyticUnit.cost;

      // in case of single transaction or buy lower price
      if (analyticUnit.lastActionPrice <= analyticUnit.midPrice) {
        analyticUnit.lastActionPrice = 0;
      }
      if (analyticUnit.lastActionPrice) {
        analyticUnit.percentFromLastAction = (analyticUnit.currentPrice - analyticUnit.lastActionPrice) / analyticUnit.lastActionPrice * 100;
      }
    });

    return analytic = TransactionsListModel.removeEmptyAnalytic(analytic);
  }

  static removeEmptyAnalytic(analytic: Analytic): Analytic {
    const newAnalytic = {};

    for (let key in analytic) {
      if (analytic[key].amount) {
        newAnalytic[key] = analytic[key];
      }
    }

    return newAnalytic;
  }

  static transformAnalyticToTableFormat(analytic: Analytic): Array<Array<string>> {
    const table: Array<Array<string>> = [[
      'Актив',
      'Название', 
      'Количество', 
      'Текущая цена', 
      'Средняя цена', 
      'Текущая стоимость', 
      'Вложено', 
      'Доходность %', 
      'Доходность $', 
      'Цена последней транзакции', 
      '% от последней транзакции'
    ]];

    for (let key in analytic) {
      const row = [
        key,
        analytic[key].name,
        TransactionsListModel.convertToTextNumber(analytic[key].amount),
        TransactionsListModel.convertToTextNumber(analytic[key].currentPrice),
        TransactionsListModel.convertToTextNumber(analytic[key].midPrice),
        TransactionsListModel.convertToTextNumber(analytic[key].currentCost),
        TransactionsListModel.convertToTextNumber(analytic[key].cost),
        TransactionsListModel.convertToTextNumber(analytic[key].profitPer),
        TransactionsListModel.convertToTextNumber(analytic[key].profit),
        TransactionsListModel.convertToTextNumber(analytic[key].lastActionPrice),
        TransactionsListModel.convertToTextNumber(analytic[key].percentFromLastAction),
      ];

      table.push(row);
    }

    return table;
  }

  static convertToNumber(value: string): number {
    return Number(value.replace(/\s/gi, "").replace(",", "."));
  }

  static convertToTextNumber(value: number): string {
    return value.toString().replace(".", ",");
  }
}
