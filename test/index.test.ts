import { parseAndApply } from '../src/index';

describe('parseAndApply', () => {
  it.each([
    ['now-1y/y', '2020-05-01T00:00:00.000Z', '2019-01-01T00:00:00.000Z'],
    ['now/y', '2020-05-01T00:00:00.000Z', '2020-01-01T00:00:00.000Z'],
    ['now-1d', '2020-05-01T00:00:00.000Z', '2020-04-30T00:00:00.000Z'],
    ['now+1d', '2020-05-01T00:00:00.000Z', '2020-05-02T00:00:00.000Z'],
    ['now-4d-4h', '2020-05-01T00:00:00.000Z', '2020-04-26T20:00:00.000Z'],
  ])('should return expected date', (expression, dateOverride, expected) => {
    expect(parseAndApply(expression, new Date(dateOverride))).toEqual(
      new Date(expected)
    );
  });
});
