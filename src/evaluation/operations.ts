import { Token } from '../tokenizer';
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
}
