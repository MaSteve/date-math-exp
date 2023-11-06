import { parseDateMathExpression } from './parser';
import { TokenType, tokenize } from './tokenizer';

type DateString = string;

export function parseAndApply(
  datestring: DateString,
  dateOverride?: Date
): Date {
  return parseDateMathExpression(tokenize(datestring)).evaluate(dateOverride)!;
}
