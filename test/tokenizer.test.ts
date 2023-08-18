import { Token, TokenType, tokenize } from '../src/tokenizer';

describe('tokenize', () => {
  it.each([
    ['now', TokenType.Now],
    ['+', TokenType.Plus],
    ['-', TokenType.Minus],
    ['/', TokenType.Slash],
    ['y', TokenType.Year],
    ['M', TokenType.Month],
    ['w', TokenType.Week],
    ['d', TokenType.Day],
    ['h', TokenType.Hour],
    ['m', TokenType.Minute],
    ['s', TokenType.Second],
  ])('should recognize %s token', (tokenExpression, expectedTokenType) => {
    let res = tokenize(tokenExpression);
    expect(res).toEqual([
      getToken(0, expectedTokenType),
      getToken(expectedTokenType.length, TokenType.EndOfExpression),
    ]);
  });

  it.each(['1', '12', '123', '01234567890123456789'])(
    'should recognize numeral %s',
    (numeralExpression) => {
      let res = tokenize(numeralExpression);
      expect(res).toEqual([
        getToken(0, TokenType.Numeral, numeralExpression),
        getToken(numeralExpression.length, TokenType.EndOfExpression),
      ]);
    }
  );

  it('should recognize empty expression', () => {
    let res = tokenize('');
    expect(res).toEqual([getToken(0, TokenType.EndOfExpression)]);
  });

  it.each(['no1', 'now 12', 'now*', '1.5', '()'])(
    'should throw an exception for expression %s',
    (faultyExpression) => {
      expect(() => tokenize(faultyExpression)).toThrowError();
    }
  );

  it('should tokenize some expression', () => {
    let res = tokenize('nownow123yMwdhms///+-');
    expect(res).toEqual([
      getToken(0, TokenType.Now),
      getToken(3, TokenType.Now),
      getToken(6, TokenType.Numeral, '123'),
      getToken(9, TokenType.Year),
      getToken(10, TokenType.Month),
      getToken(11, TokenType.Week),
      getToken(12, TokenType.Day),
      getToken(13, TokenType.Hour),
      getToken(14, TokenType.Minute),
      getToken(15, TokenType.Second),
      getToken(16, TokenType.Slash),
      getToken(17, TokenType.Slash),
      getToken(18, TokenType.Slash),
      getToken(19, TokenType.Plus),
      getToken(20, TokenType.Minus),
      getToken(21, TokenType.EndOfExpression),
    ]);
  });
});

function getToken(
  position: number,
  tokenType: TokenType,
  value?: string
): Token {
  let val = value ?? (tokenType == TokenType.EndOfExpression ? '' : tokenType);
  return {
    value: val,
    startPosition: position,
    endPosition: position + val.length,
    tokenType,
  };
}
