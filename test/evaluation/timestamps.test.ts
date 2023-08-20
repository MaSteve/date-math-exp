import { CurrentTimestampNode } from '../../src/evaluation/timestamps';

describe('apply in CurrentTimestampNode', () => {
  it('should return current date', () => {
    let now = new Date();
    const spy = jest.spyOn(global, 'Date').mockImplementation(() => now);
    let res = new CurrentTimestampNode().apply(null);
    spy.mockRestore();
    expect(res).toEqual(now);
  });

  it('should return overriden date when provided', () => {
    let date = new Date('2020-01-01T00:00:00.000Z');
    let res = new CurrentTimestampNode().apply(date);
    expect(res).toEqual(date);
  });
});
