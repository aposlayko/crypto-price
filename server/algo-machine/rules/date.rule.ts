import { Quote } from "../quote.model";
import { AbstractRule } from "./abstract.rule";

export class DateRule extends AbstractRule {
  dateStart: Date;
  dateFinish: Date;
  currentDate: Date;
  
  constructor(dateStart: Date, dateFinish: Date) {
    super();

    if (!dateStart && !dateFinish) throw 'Date rule: wrong parametrs';    

    this.dateStart = dateStart;
    this.dateFinish = dateFinish;
  }

  update(quote: Quote): void {
    this.currentDate = new Date(quote.closeTime);
  }

  check(): boolean {
    if (this.dateStart && this.dateFinish) {
      return Number(this.currentDate) > Number(this.dateStart) &&
        Number(this.currentDate) <= Number(this.dateFinish)
    } else if (this.dateStart) {
      return Number(this.currentDate) > Number(this.dateStart);
    } else if (this.dateFinish) {
      return Number(this.currentDate) <= Number(this.dateFinish);
    }
  }
}