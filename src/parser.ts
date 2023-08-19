import { DateMathExpression, ExpressionNode } from './evaluation/date-math';
import { OperandNode } from './evaluation/operations';
import { RoundingNode } from './evaluation/rounding';
import { CurrentTimestampNode } from './evaluation/timestamps';
import {
  OPERATORS,
  Token,
  TokenType,
  UNITS_OF_TIME,
  isOperator,
  isUnitOfTime,
} from './tokenizer';

class ParsingError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, ParsingError.prototype);
  }
}

function unexpectedTokenFound(token: Token, expectation: TokenType[]) {
  throw new ParsingError(
    `'${token.tokenType}' token found in position ${token.startPosition}. '${expectation}' expected instead`
  );
}

function tokenNotFound(previousToken: Token, expectation: TokenType[]) {
  throw new ParsingError(
    `Token not found after ${previousToken.tokenType} in position ${previousToken.endPosition}. Expected ${expectation}.`
  );
}

export function parseDateMathExpression(tokens: Token[]): DateMathExpression {
  let nodes: ExpressionNode[] = [];
  if (tokens.length == 0) {
    throw new ParsingError('List of tokens is empty');
  }
  if (tokens[0].tokenType != TokenType.Now) {
    unexpectedTokenFound(tokens[0], [TokenType.Now]);
  } else {
    nodes.push(new CurrentTimestampNode());
  }

  let idx = 1;
  let roundingExpression = false;
  let endOfExpression = false;
  while (idx < tokens.length) {
    if (
      roundingExpression &&
      tokens[idx].tokenType != TokenType.EndOfExpression
    ) {
      unexpectedTokenFound(tokens[idx], [TokenType.EndOfExpression]);
    }
    if (tokens[idx].tokenType == TokenType.EndOfExpression) {
      endOfExpression = true;
      idx++;
      break;
    }
    if (roundingExpression) {
      unexpectedTokenFound(tokens[idx], [TokenType.EndOfExpression]);
    }
    if (tokens[idx].tokenType == TokenType.Slash) {
      let roundingUnit = tokens[idx + 1];
      if (roundingUnit === undefined) {
        tokenNotFound(tokens[idx], UNITS_OF_TIME);
      } else if (isUnitOfTime(roundingUnit.tokenType)) {
        nodes.push(new RoundingNode(roundingUnit));
        roundingExpression = true;
        idx += 2;
      } else {
        unexpectedTokenFound(roundingUnit, UNITS_OF_TIME);
      }
    } else if (isOperator(tokens[idx].tokenType)) {
      let numeral = tokens[idx + 1];
      let timeUnit = tokens[idx + 2];

      if (numeral === undefined) {
        tokenNotFound(tokens[idx], [TokenType.Numeral]);
      } else if (numeral.tokenType != TokenType.Numeral) {
        unexpectedTokenFound(numeral, [TokenType.Numeral]);
      }

      if (timeUnit === undefined) {
        tokenNotFound(numeral, UNITS_OF_TIME);
      } else if (!isUnitOfTime(timeUnit.tokenType)) {
        unexpectedTokenFound(timeUnit, UNITS_OF_TIME);
      }

      nodes.push(new OperandNode(tokens[idx], numeral, timeUnit));
      idx += 3;
    } else {
      unexpectedTokenFound(tokens[idx], OPERATORS);
    }
  }

  if (idx != tokens.length) {
    throw new ParsingError('Tokens found after end of expression.');
  } else if (!endOfExpression) {
    throw new ParsingError('End of expression token missing.');
  }

  return new DateMathExpression(nodes);
}
