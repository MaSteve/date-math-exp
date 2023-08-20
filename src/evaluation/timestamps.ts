import { ExpressionNode } from './date-math';

export class CurrentTimestampNode extends ExpressionNode {
  apply(date: Date | null): Date | null {
    if (date != null) {
      return new Date(date);
    }
    return new Date();
  }
}
