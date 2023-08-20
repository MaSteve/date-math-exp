import { Token, TokenType } from '../tokenizer';
import { ExpressionNode } from './date-math';

export class OperandNode extends ExpressionNode {
  private operator: Token;
  private numeral: Token;
  private timeUnit: Token;

  constructor(operator: Token, numeral: Token, timeUnit: Token) {
    super();
    this.operator = operator;
    this.numeral = numeral;
    this.timeUnit = timeUnit;
  }

  private applyOperation(value: number, factor?: number): number {
    let delta: number = Number(this.numeral.value) * (factor ?? 1);
    if (this.operator.tokenType === TokenType.Plus) {
      return value + delta;
    } else if (this.operator.tokenType === TokenType.Minus) {
      return value - delta;
    } else {
      // TODO: throw error
      throw 'Unsupported operator';
    }
  }

  apply(date: Date | null): Date | null {
    if (date === null) {
      return null;
    }

    switch (this.timeUnit.tokenType) {
      case TokenType.Year:
        date.setUTCFullYear(this.applyOperation(date.getUTCFullYear()));
        break;
      case TokenType.Month:
        date.setUTCMonth(this.applyOperation(date.getUTCMonth()));
        break;
      case TokenType.Week:
        date.setUTCDate(this.applyOperation(date.getUTCDate(), 7));
        break;
      case TokenType.Day:
        date.setUTCDate(this.applyOperation(date.getUTCDate()));
        break;
      case TokenType.Hour:
        date.setUTCHours(this.applyOperation(date.getUTCHours()));
        break;
      case TokenType.Minute:
        date.setUTCMinutes(this.applyOperation(date.getUTCMinutes()));
        break;
      case TokenType.Second:
        date.setUTCSeconds(this.applyOperation(date.getUTCSeconds()));
        break;
    }

    return date;
  }
}
