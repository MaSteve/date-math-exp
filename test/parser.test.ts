import { DateMathExpression } from '../src/evaluation/date-math';
import { OperandNode } from '../src/evaluation/operations';
import { RoundingNode } from '../src/evaluation/rounding';
import { CurrentTimestampNode } from '../src/evaluation/timestamps';
import { parseDateMathExpression } from '../src/parser';
import { Token, TokenType, tokenize } from '../src/tokenizer';
import { getToken } from './helper';

describe('parseDateMathExpression', () => {
  it.each([
    '',
    '+',
    'nownow',
    'now1y',
    'now+y',
    'now+1',
    'now-1/d',
    'now-1y/',
    'now-1y//',
    'now-1y/dd',
    'now-1y/d/h',
  ])('should throw an exception for expression %s', (faultyExpression) => {
    let tokens = tokenize(faultyExpression);
    expect(() => parseDateMathExpression(tokens)).toThrowError();
  });

  it('should throw an exception when empty list of tokens', () => {
    expect(() => parseDateMathExpression([])).toThrowError();
  });

  it('should throw an exception when list of tokens has more tokens beyond EOE', () => {
    let tokens: Token[] = tokenize('now+1d/y').concat([
      getToken(-1, TokenType.EndOfExpression),
    ]);
    expect(() => parseDateMathExpression(tokens)).toThrowError();
  });

  it('should throw an exception when EOE token is missing', () => {
    let tokens: Token[] = tokenize('now+1d/y');
    expect(() => parseDateMathExpression(tokens.slice(0, -1))).toThrowError();
  });

  it('should parse some expression', () => {
    let tokens: Token[] = tokenize('now+1y-123d/y');
    let res = parseDateMathExpression(tokens);
    expect(res).toEqual(
      new DateMathExpression([
        new CurrentTimestampNode(),
        new OperandNode(
          getToken(3, TokenType.Plus),
          getToken(4, TokenType.Numeral, '1'),
          getToken(5, TokenType.Year)
        ),
        new OperandNode(
          getToken(6, TokenType.Minus),
          getToken(7, TokenType.Numeral, '123'),
          getToken(10, TokenType.Day)
        ),
        new RoundingNode(getToken(12, TokenType.Year)),
      ])
    );
  });
});
