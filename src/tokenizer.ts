export enum TokenType {
  Now = 'now',
  Plus = '+',
  Minus = '-',
  Numeral = 'Numeral',
  Slash = '/',
  Year = 'y',
  Month = 'M',
  Week = 'w',
  Day = 'd',
  Hour = 'h',
  Minute = 'm',
  Second = 's',
  EndOfExpression = 'End of expression',
}

export const UNITS_OF_TIME = [
  TokenType.Year,
  TokenType.Month,
  TokenType.Week,
  TokenType.Day,
  TokenType.Hour,
  TokenType.Minute,
  TokenType.Second,
];

export function isUnitOfTime(tokenType: TokenType) {
  return UNITS_OF_TIME.includes(tokenType);
}

export const OPERATORS = [TokenType.Plus, TokenType.Minus];

export function isOperator(tokenType: TokenType) {
  return OPERATORS.includes(tokenType);
}

export interface Token {
  value: string;
  startPosition: number;
  endPosition: number;
  tokenType: TokenType;
}

class TokenizationError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, TokenizationError.prototype);
  }
}

function extractNumeralToken(expression: string, startPosition: number): Token {
  let idx = startPosition;
  while (/^[0-9]$/.test(expression[idx])) {
    idx++;
  }
  return {
    value: expression.slice(startPosition, idx),
    startPosition,
    endPosition: idx,
    tokenType: TokenType.Numeral,
  };
}

export function tokenize(expression: string): Token[] {
  let tokens: Token[] = [];
  let idx = 0;
  while (idx < expression.length) {
    const currentChar = expression[idx];
    if (Object.values(TokenType).includes(currentChar as TokenType)) {
      tokens.push({
        value: currentChar,
        startPosition: idx,
        endPosition: idx + 1,
        tokenType: currentChar as TokenType,
      });
      idx++;
    } else if (/^[0-9]$/.test(currentChar)) {
      let numeralToken = extractNumeralToken(expression, idx);
      tokens.push(numeralToken);
      idx = numeralToken.endPosition;
    } else if (
      currentChar == 'n' &&
      expression.slice(idx, idx + 3) == TokenType.Now
    ) {
      tokens.push({
        value: TokenType.Now,
        startPosition: idx,
        endPosition: idx + 3,
        tokenType: TokenType.Now,
      });
      idx += 3;
    } else {
      throw new TokenizationError(
        `Unrecognized token starting in position ${idx} (${currentChar}). Expression: ${expression}`
      );
    }
  }
  tokens.push({
    value: '',
    startPosition: idx,
    endPosition: idx,
    tokenType: TokenType.EndOfExpression,
  });
  return tokens;
}
