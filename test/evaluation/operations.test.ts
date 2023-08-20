import { tokenize } from '../../src/tokenizer';
import { OperandNode } from '../../src/evaluation/operations';

describe('apply in OperandNode', () => {
  it.each([
    ['+28y', '1995-02-22T05:45:00.000Z', '2023-02-22T05:45:00.000Z'],
    ['-1y', '2023-08-20T12:34:56.789Z', '2022-08-20T12:34:56.789Z'],
    ['+3M', '2023-08-20T12:34:56.789Z', '2023-11-20T12:34:56.789Z'],
    ['-2M', '2023-08-20T12:34:56.789Z', '2023-06-20T12:34:56.789Z'],
    ['+5w', '2023-08-20T12:34:56.789Z', '2023-09-24T12:34:56.789Z'],
    ['-1w', '2023-08-20T12:34:56.789Z', '2023-08-13T12:34:56.789Z'],
    ['+3d', '2023-08-20T12:34:56.789Z', '2023-08-23T12:34:56.789Z'],
    ['-3d', '2023-08-20T12:34:56.789Z', '2023-08-17T12:34:56.789Z'],
    ['+1d', '2020-02-28T12:34:56.789Z', '2020-02-29T12:34:56.789Z'],
    ['-1d', '2020-03-01T12:34:56.789Z', '2020-02-29T12:34:56.789Z'],
    ['+3h', '2023-08-20T12:34:56.789Z', '2023-08-20T15:34:56.789Z'],
    ['-3h', '2023-08-20T12:34:56.789Z', '2023-08-20T09:34:56.789Z'],
    ['+3m', '2023-08-20T12:34:56.789Z', '2023-08-20T12:37:56.789Z'],
    ['-3m', '2023-08-20T12:34:56.789Z', '2023-08-20T12:31:56.789Z'],
    ['+3s', '2023-08-20T12:34:56.789Z', '2023-08-20T12:34:59.789Z'],
    ['-3s', '2023-08-20T12:34:56.789Z', '2023-08-20T12:34:53.789Z'],
  ])('should return expected date', (expression, date, expected) => {
    let tokens = tokenize(expression);
    expect(
      new OperandNode(tokens[0], tokens[1], tokens[2]).apply(new Date(date))
    ).toEqual(new Date(expected));
  });

  it.each(['/1y', '+1/'])(
    'should throw an exception when unexpected tokens',
    (expression) => {
      let tokens = tokenize(expression);
      expect(() =>
        new OperandNode(tokens[0], tokens[1], tokens[2]).apply(new Date())
      ).toThrowError();
    }
  );
});
