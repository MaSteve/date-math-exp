import { Token, TokenType } from '../src/tokenizer';

export function getToken(
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
