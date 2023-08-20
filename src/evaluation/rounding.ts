import { Token, TokenType } from '../tokenizer';
import { EvaluationError, ExpressionNode } from './date-math';

export class RoundingNode extends ExpressionNode {
  private roundingUnit: Token;

  constructor(roundingUnit: Token) {
    super();
    this.roundingUnit = roundingUnit;
  }

  private resetDateFields(date: Date): Date {
    switch (this.roundingUnit.tokenType) {
      case TokenType.Year:
        date.setUTCMonth(0);
        date.setUTCDate(1);
        date.setUTCHours(0, 0, 0, 0);
        break;
      case TokenType.Month:
        date.setUTCDate(1);
        date.setUTCHours(0, 0, 0, 0);
        break;
      case TokenType.Week:
      case TokenType.Day:
        date.setUTCHours(0, 0, 0, 0);
        break;
      case TokenType.Hour:
        date.setUTCMinutes(0, 0, 0);
        break;
      case TokenType.Minute:
        date.setUTCSeconds(0, 0);
        break;
      case TokenType.Second:
        date.setUTCMilliseconds(0);
        break;
      default:
        throw new EvaluationError(
          `Unsupported unit of time ${this.roundingUnit.tokenType} in position ${this.roundingUnit.startPosition}`
        );
    }
    return date;
  }

  private roundUpDate(original: Date): Date {
    let date = new Date(original);
    switch (this.roundingUnit.tokenType) {
      case TokenType.Year:
        date.setUTCFullYear(date.getUTCFullYear() + 1);
        break;
      case TokenType.Month:
        date.setUTCMonth(date.getUTCMonth() + 1);
        break;
      case TokenType.Week:
        let dayOfWeek = date.getUTCDay();
        date.setUTCDate(date.getUTCDate() + 7 - dayOfWeek);
        break;
      case TokenType.Day:
        date.setUTCDate(date.getUTCDate() + 1);
        break;
      case TokenType.Hour:
        date.setUTCHours(date.getUTCHours() + 1);
        break;
      case TokenType.Minute:
        date.setUTCMinutes(date.getUTCMinutes() + 1);
        break;
      case TokenType.Second:
        date.setUTCSeconds(date.getUTCSeconds() + 1);
        break;
      default:
        throw new EvaluationError(
          `Unsupported unit of time ${this.roundingUnit.tokenType} in position ${this.roundingUnit.startPosition}`
        );
    }
    return this.resetDateFields(date);
  }

  private roundDownDate(original: Date): Date {
    let date = new Date(original);
    if (this.roundingUnit.tokenType === TokenType.Week) {
      let dayOfWeek = date.getUTCDay();
      date.setUTCDate(date.getUTCDate() - dayOfWeek);
    }
    return this.resetDateFields(date);
  }

  apply(date: Date | null): Date | null {
    if (date === null) {
      return null;
    }

    let roundedDown = this.roundDownDate(date);
    let roundedUp = this.roundUpDate(date);

    let diffDown = Math.abs(roundedDown.getTime() - date.getTime());
    let diffUp = Math.abs(roundedUp.getTime() - date.getTime());

    return diffDown < diffUp ? roundedDown : roundedUp;
  }
}
