import { Token, TokenType } from '../tokenizer';
import { ExpressionNode } from './date-math';

export class RoundingNode extends ExpressionNode {
  private roundingUnit: Token;

  constructor(roundingUnit: Token) {
    super();
    this.roundingUnit = roundingUnit;
  }

  apply(date: Date | null): Date | null {
    if (date === null) {
      return null;
    }

    switch (this.roundingUnit.tokenType) {
      case TokenType.Year:
        if (date.getUTCMonth() >= 6) {
          date.setUTCFullYear(date.getUTCFullYear() + 1);
        }
        date.setUTCMonth(0);
        date.setUTCDate(1);
        date.setUTCHours(0, 0, 0, 0);
        break;
      case TokenType.Month:
        if (date.getUTCDate() >= 15) {
          date.setUTCMonth(date.getUTCMonth() + 1);
        }
        date.setUTCDate(1);
        date.setUTCHours(0, 0, 0, 0);
        break;
      case TokenType.Week:
        let dayOfWeek = date.getUTCDay();
        if (dayOfWeek >= 3) {
          date.setUTCDate(date.getUTCDate() + 7 - dayOfWeek);
        } else {
          date.setUTCDate(date.getUTCDate() - dayOfWeek);
        }
        date.setUTCHours(0, 0, 0, 0);
        break;
      case TokenType.Day:
        if (date.getUTCHours() >= 12) {
          date.setUTCDate(date.getUTCDate() + 1);
        }
        date.setUTCHours(0, 0, 0, 0);
        break;
      case TokenType.Hour:
        if (date.getUTCMinutes() >= 30) {
          date.setUTCHours(date.getUTCHours() + 1);
        }
        date.setUTCMinutes(0, 0, 0);
        break;
      case TokenType.Minute:
        if (date.getUTCSeconds() >= 30) {
          date.setUTCMinutes(date.getUTCMinutes() + 1);
        }
        date.setUTCSeconds(0, 0);
        break;
      case TokenType.Second:
        if (date.getUTCMilliseconds() >= 500) {
          date.setUTCSeconds(date.getUTCSeconds() + 1);
        }
        date.setUTCMilliseconds(0);
        break;
    }

    return date;
  }
}
