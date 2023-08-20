import { parseDateMathExpression } from './parser';
import { tokenize } from './tokenizer';

type DateString = string;

export function parse(datestring: DateString): Date {
  return parseDateMathExpression(tokenize(datestring)).evaluate()!;
}

export function stringify(date: Date): DateString {
  return '';
}
