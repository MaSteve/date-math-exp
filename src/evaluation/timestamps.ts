import { ExpressionNode } from './date-math';

export class CurrentTimestampNode extends ExpressionNode {
  apply(date: Date | null): Date | null {
    return new Date();
  }
}
