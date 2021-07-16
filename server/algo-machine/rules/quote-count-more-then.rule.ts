import { Quote } from "../quote.model";
import { AbstractRule } from "./abstract.rule";

export class QuouteCountMoreThen extends AbstractRule {
  count = 0;
  compareCount: number;

  constructor(compareCount: number, initialCount?: number) {
    super();

    this.count = initialCount ? initialCount : 0;
    this.compareCount = compareCount ? compareCount : 0;
  }

  update(quote: Quote) {
    this.count++;
  }

  check() {
    return this.count > this.compareCount;
  }
}