export abstract class ExpressionNode {
  abstract apply(date: Date | null): Date | null;
}

export class EvaluationError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, EvaluationError.prototype);
  }
}

export class DateMathExpression {
  private nodes: ExpressionNode[];
  constructor(nodes: ExpressionNode[]) {
    this.nodes = nodes;
  }

  public evaluate(dateOverride?: Date): Date | null {
    let date = dateOverride ?? null;
    for (let idx = 0; idx < this.nodes.length; idx++) {
      date = this.nodes[idx].apply(date);
    }
    return date;
  }
}
