import { Token } from '../tokenizer';
import { ExpressionNode } from './date-math';

export class RoundingNode extends ExpressionNode {
  private roundingUnit: Token;
  constructor(roundingUnit: Token) {
    super();
    this.roundingUnit = roundingUnit;
  }
}
