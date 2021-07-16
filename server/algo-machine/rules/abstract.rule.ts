import { Quote } from "../quote.model";

export abstract class AbstractRule {
  abstract update(quote: Quote): void;
  abstract check(): boolean;
}