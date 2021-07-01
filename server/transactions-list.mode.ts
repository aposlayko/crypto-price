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

  getAnalytic() {    
    let analytic = {};

    this.transactionList.forEach((t) => {
      if (!analytic[t.name]) {
        analytic[t.name] = {
          amount: 0,
          buyAmount: 0,
          cost: 0,
          midPrice: 0,
        }
      }

      const analyticUnit = analytic[t.name];

      switch (t.operation) {
        case Operation.Buy:
          analyticUnit.amount += t.amount;
          analyticUnit.buyAmount += t.amount;

          if (analyticUnit.amount) {
            analyticUnit.cost += t.price * t.amount;
            analyticUnit.midPrice = analyticUnit.cost / analyticUnit.buyAmount;
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
            analyticUnit.midPrice = analyticUnit.cost / analyticUnit.buyAmount;
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
    });

    return analytic;
  }
}
