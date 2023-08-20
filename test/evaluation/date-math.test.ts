import { parseDateMathExpression } from '../../src/parser';
import { tokenize } from '../../src/tokenizer';

describe('evaluate', () => {
  it('should return expected date without date override', () => {
    let now = new Date();
    const spy = jest.spyOn(global, 'Date').mockImplementation(() => now);
    let res = parseDateMathExpression(tokenize('now')).evaluate();
    spy.mockRestore();
    expect(res).toEqual(now);
  });

  it('should return expected date with date override', () => {
    let date = new Date('2020-01-01T00:00:00.000Z');
    let res = parseDateMathExpression(tokenize('now')).evaluate(date);
    expect(res).toEqual(date);
  });
});
