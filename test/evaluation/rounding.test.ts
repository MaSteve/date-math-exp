import { tokenize } from '../../src/tokenizer';
import { RoundingNode } from '../../src/evaluation/rounding';

describe('apply in OperandNode', () => {
  it.each([
    ['y', '2023-08-20T12:34:56.789Z', '2024-01-01T00:00:00.000Z'],
    ['y', '2023-05-20T12:34:56.789Z', '2023-01-01T00:00:00.000Z'],
    ['M', '2023-08-20T12:34:56.789Z', '2023-09-01T00:00:00.000Z'],
    ['M', '2023-08-10T12:34:56.789Z', '2023-08-01T00:00:00.000Z'],
    ['w', '2023-08-22T12:34:56.789Z', '2023-08-20T00:00:00.000Z'],
    ['w', '2023-08-18T12:34:56.789Z', '2023-08-20T00:00:00.000Z'],
    ['d', '2023-08-20T12:34:56.789Z', '2023-08-21T00:00:00.000Z'],
    ['d', '2023-08-20T11:34:56.789Z', '2023-08-20T00:00:00.000Z'],
    ['h', '2023-08-20T12:34:56.789Z', '2023-08-20T13:00:00.000Z'],
    ['h', '2023-08-20T12:24:56.789Z', '2023-08-20T12:00:00.000Z'],
    ['m', '2023-08-20T12:34:56.789Z', '2023-08-20T12:35:00.000Z'],
    ['m', '2023-08-20T12:34:26.789Z', '2023-08-20T12:34:00.000Z'],
    ['s', '2023-08-20T12:34:56.789Z', '2023-08-20T12:34:57.000Z'],
    ['s', '2023-08-20T12:34:56.489Z', '2023-08-20T12:34:56.000Z'],
  ])('should return expected date', (expression, date, expected) => {
    let tokens = tokenize(expression);
    expect(new RoundingNode(tokens[0]).apply(new Date(date))).toEqual(
      new Date(expected)
    );
  });

  it('should throw an exception when unexpected token', () => {
    let tokens = tokenize('/');
    expect(() => new RoundingNode(tokens[0]).apply(new Date())).toThrowError();
  });
});
