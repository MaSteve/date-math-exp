import { parseDateMathExpression } from './parser';
import { TokenType, tokenize } from './tokenizer';

type DateString = string;

export function parse(datestring: DateString, dateOverride?: Date): Date {
  return parseDateMathExpression(tokenize(datestring)).evaluate(dateOverride)!;
}

function getDeltaForUnitOfTime(
  now: Date,
  date: Date,
  timeUnit: TokenType
): number {
  switch (timeUnit) {
    case TokenType.Year:
      return date.getUTCFullYear() - now.getUTCFullYear();
    case TokenType.Month:
      return date.getUTCMonth() - now.getUTCMonth();
    case TokenType.Hour:
      return date.getUTCHours() - now.getUTCHours();
    case TokenType.Minute:
      return date.getUTCMinutes() - now.getUTCMinutes();
    case TokenType.Second:
      return date.getUTCSeconds() - now.getUTCSeconds();
    default:
      throw new Error('Unsupported unit of time');
  }
}

function getDiffExpression(now: Date, date: Date, timeUnit: TokenType): string {
  let expression = '';
  let delta = getDeltaForUnitOfTime(now, date, timeUnit);
  if (delta > 0) {
    expression += '+';
  }
  if (delta) {
    expression += String(delta) + timeUnit;
  }
  return expression;
}

export function stringify(date: Date, dateOverride?: Date): DateString {
  let now = dateOverride ?? new Date();
  let res = 'now';

  res += getDiffExpression(now, date, TokenType.Year);

  // Months have a variable number of days and subtracting or adding months to
  // a date can be a bit unpredictable. Instead this function goes to the 1st day
  // of the month, move to the correct month and then jump to the expected day.
  // It might result in a longer expression but that's still valid.
  let dayFromNow = now.getUTCDate();
  if (dayFromNow > 1) {
    res += `-${dayFromNow - 1}d`;
  }

  res += getDiffExpression(now, date, TokenType.Month);

  let dayFromDate = date.getUTCDate();
  if (dayFromDate > 1) {
    res += `+${dayFromDate - 1}d`;
  }

  res += getDiffExpression(now, date, TokenType.Hour);

  res += getDiffExpression(now, date, TokenType.Minute);

  res += getDiffExpression(now, date, TokenType.Second);

  // Milliseconds are ignored as there is no operation that allows setting
  // the milliseconds to any arbitrary value, like the one in the provided date.

  return res;
}
