const SCHEMA = [];

enum Operation {
  Buy = 'купля',
  Sell = 'продажа',
  Get = 'завод',
  Send = 'вывод'
}

enum TransactionProps {
  Name = 'name',
  Operation = 'operation',
  Price = 'price',
  Amount = 'amount',
  Date = 'date'
}

const schema = [
  TransactionProps.Name,
  TransactionProps.Operation,
  TransactionProps.Price,
  TransactionProps.Amount,
  TransactionProps.Date
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

  constructor (rawData: string[][]) {
    this.transactionList = this.fromServer(rawData);
  }

  fromServer(rawData: string[][]): Transaction[] {
    return rawData.map((o: string[]) => {
      let transaction;      

      o.forEach((value, index) => {
        let resultValue: any;

        if (schema[index] === TransactionProps.Price) {          
          resultValue = Number(value.replace(/\s/gi, '').replace(',', '.'));
        } else if (schema[index] === TransactionProps.Amount) {
          resultValue = Number(value.replace(/\s/gi, '').replace(',', '.'));
        } else if (schema[index] === TransactionProps.Date) {
          const dateArr = value.split('.');
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
    }).sort((t1: Transaction, t2: Transaction) => {
      return Number(t1.date) - Number(t2.date);
    });
  }
  
  getUniqueNames() {
    return this.transactionList.map(o => o.name).filter((v, i, a) => a.indexOf(v) === i);
  }

  filterByName(name: string): Transaction[] {
    return this.transactionList.filter(o => o.name === name);
  }

  getAmount(name: string): number {
    const transactions = this.filterByName(name);
    return transactions.reduce((prev, curr) => {
      switch(curr.operation) {
        case Operation.Buy:
        case Operation.Get:  
          return prev + curr.amount;
          break;

        case Operation.Send:
        case Operation.Sell:
          return prev - curr.amount;
          break;

        default:
          return prev;
      }      
    }, 0);
  }
}