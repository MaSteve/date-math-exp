import { Token, TokenType } from '../tokenizer';
import { EvaluationError, ExpressionNode } from './date-math';

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
      throw new EvaluationError(
        `Unsupported operator ${this.operator.tokenType} in position ${this.operator.startPosition}`
      );
    }
  }

  apply(date: Date | null): Date | null {
    if (date === null) {
      return null;
    }

    let result = new Date(date);

    switch (this.timeUnit.tokenType) {
      case TokenType.Year:
        result.setUTCFullYear(this.applyOperation(result.getUTCFullYear()));
        break;
      case TokenType.Month:
        result.setUTCMonth(this.applyOperation(result.getUTCMonth()));
        break;
      case TokenType.Week:
        result.setUTCDate(this.applyOperation(result.getUTCDate(), 7));
        break;
      case TokenType.Day:
        result.setUTCDate(this.applyOperation(result.getUTCDate()));
        break;
      case TokenType.Hour:
        result.setUTCHours(this.applyOperation(result.getUTCHours()));
        break;
      case TokenType.Minute:
        result.setUTCMinutes(this.applyOperation(result.getUTCMinutes()));
        break;
      case TokenType.Second:
        result.setUTCSeconds(this.applyOperation(result.getUTCSeconds()));
        break;
      default:
        throw new EvaluationError(
          `Unsupported unit of time ${this.operator.tokenType} in position ${this.operator.startPosition}`
        );
    }

    return result;
  }
}
