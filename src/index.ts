import { parseDateMathExpression } from './parser';
import { tokenize } from './tokenizer';

type DateString = string;

export function parse(datestring: DateString, dateOverride?: Date): Date {
  return parseDateMathExpression(tokenize(datestring)).evaluate(dateOverride)!;
}

export function stringify(date: Date): DateString {
  return '';
}
