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
            resultValue = Number(value.replace(/\s/gi, "").replace(",", "."));
          } else if (schema[index] === TransactionProps.Amount) {
            resultValue = Number(value.replace(/\s/gi, "").replace(",", "."));
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

  getAnalytic(name: string) {
    const transactions = this.filterByName(name);
    const analytic = {
      amount: 0,
      buyAmount: 0,
      cost: 0,
      midPrice: 0,
    };

    transactions.forEach((t) => {
      switch (t.operation) {
        case Operation.Buy:
          analytic.amount += t.amount;
          analytic.buyAmount += t.amount;

          if (analytic.amount) {
            analytic.cost += t.price * t.amount;
            analytic.midPrice = analytic.cost / analytic.buyAmount;
          } else {
            analytic.cost = 0;
            analytic.midPrice = 0;
          }

          break;

        case Operation.Sell:
          analytic.amount -= t.amount;

          if (analytic.buyAmount >= t.amount) {
            analytic.buyAmount -= t.amount;
          } else {
            analytic.buyAmount = 0;
          }
          

          if (analytic.amount) {
            analytic.cost -= analytic.midPrice * t.amount;
            analytic.midPrice = analytic.cost / analytic.buyAmount;
          } else {
            analytic.cost = 0;
            analytic.midPrice = 0;
          }

          break;

        case Operation.Get:
          analytic.amount += t.amount;

          if (!analytic.amount) {
            analytic.cost = 0;
            analytic.midPrice = 0;
          }

          break;

        case Operation.Send:
          analytic.amount -= t.amount;

          if (!analytic.amount) {
            analytic.cost = 0;
            analytic.midPrice = 0;
          }

          break;
      }
    });

    return analytic;
  }
}
