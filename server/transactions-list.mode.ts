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
    amount: number;
    buyAmount: number;
    cost: number;
    midPrice: number;
    currentPrice: number;
    currentCost: number;
    profit: number;
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

  getAnalytic(price: {[key: string]: number}): Analytic {    
    let analytic = {};

    this.transactionList.forEach((t) => {
      if (!analytic[t.name]) {
        analytic[t.name] = {
          amount: 0,
          buyAmount: 0,
          cost: 0,
          midPrice: 0,
          currentPrice: 0,
          currentCost: 0,
          profit: 0,
        }
      }

      const analyticUnit = analytic[t.name];
      analyticUnit.currentPrice = price[t.name];

      switch (t.operation) {
        case Operation.Buy:
          analyticUnit.amount += t.amount;
          analyticUnit.buyAmount += t.amount;

          if (analyticUnit.amount) {
            analyticUnit.cost += t.price * t.amount;
          } else {
            analyticUnit.cost = 0;
            analyticUnit.midPrice = 0;
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
          } else {
            analyticUnit.cost = 0;
            analyticUnit.midPrice = 0;
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
      analyticUnit.currentCost = analyticUnit.buyAmount * analyticUnit.currentPrice;
      analyticUnit.profit = ((analyticUnit.currentCost / analyticUnit.cost) - 1) * 100;
    });

    return analytic;
  }

  static transformAnalyticToTableFormat(analytic: Analytic): Array<Array<string>> {
    const table: Array<Array<string>> = [['Актив', 'Количество', 'Текущая цена', 'Средняя цена', 'Текущая стоимость', 'Вложено', 'Доходность']];

    for (let key in analytic) {
      const row = [
        key,
        TransactionsListModel.convertToTextNumber(analytic[key].amount),
        TransactionsListModel.convertToTextNumber(analytic[key].currentPrice),
        TransactionsListModel.convertToTextNumber(analytic[key].midPrice),
        TransactionsListModel.convertToTextNumber(analytic[key].currentCost),
        TransactionsListModel.convertToTextNumber(analytic[key].cost),
        TransactionsListModel.convertToTextNumber(analytic[key].profit),
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
