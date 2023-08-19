export abstract class ExpressionNode {}

export class DateMathExpression {
  private nodes: ExpressionNode;
  constructor(nodes: ExpressionNode) {
    this.nodes = nodes;
  }
}
