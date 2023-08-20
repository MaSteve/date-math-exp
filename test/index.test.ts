import { parse, stringify } from '../src/index';

describe('parse', () => {
  it.each([
    ['now-1y/y', '2020-05-01T00:00:00.000Z', '2019-01-01T00:00:00.000Z'],
    ['now/y', '2020-05-01T00:00:00.000Z', '2020-01-01T00:00:00.000Z'],
    ['now-1d', '2020-05-01T00:00:00.000Z', '2020-04-30T00:00:00.000Z'],
    ['now+1d', '2020-05-01T00:00:00.000Z', '2020-05-02T00:00:00.000Z'],
    ['now-4d-4h', '2020-05-01T00:00:00.000Z', '2020-04-26T20:00:00.000Z'],
  ])('should return expected date', (expression, dateOverride, expected) => {
    expect(parse(expression, new Date(dateOverride))).toEqual(
      new Date(expected)
    );
  });
});

describe('stringify', () => {
  it.each([
    ['2019-01-01T00:00:00.000Z', '2020-05-01T00:00:00.000Z', 'now-1y-4M'],
    ['2020-01-01T00:00:00.000Z', '2020-05-01T00:00:00.000Z', 'now-4M'],
    ['2020-04-30T00:00:00.000Z', '2020-05-01T00:00:00.000Z', 'now-1M+29d'],
    ['2020-05-02T00:00:00.000Z', '2020-05-01T00:00:00.000Z', 'now+1d'],
    ['2020-04-26T20:00:00.000Z', '2020-05-01T00:00:00.000Z', 'now-1M+25d+20h'],
    [
      '2020-02-29T12:34:56.000Z',
      '2023-05-31T12:34:56.000Z',
      'now-30d-3y-3M+28d',
    ],
    [
      '2023-05-31T12:34:56.000Z',
      '2020-05-01T00:00:00.000Z',
      'now+3y+30d+12h+34m+56s',
    ],
    [
      '2023-05-31T12:34:56.000Z',
      '2023-05-31T00:00:00.000Z',
      'now-30d+30d+12h+34m+56s',
    ],
    [
      '2023-05-31T12:34:56.000Z',
      '2023-05-31T21:43:58.000Z',
      'now-30d+30d-9h-9m-2s',
    ],
    [
      '2020-02-29T20:00:00.000Z',
      '2021-02-28T00:00:00.000Z',
      'now-27d-1y+28d+20h',
    ],
    [
      '2021-02-28T20:00:00.000Z',
      '2020-02-29T00:00:00.000Z',
      'now-28d+1y+27d+20h',
    ],
    ['2020-02-29T00:00:00.000Z', '2016-02-29T00:00:00.000Z', 'now-28d+4y+28d'],
  ])(
    'should return expected and valid expression',
    (date, dateOverride, expected) => {
      expect(stringify(new Date(date), new Date(dateOverride))).toEqual(
        expected
      );

      expect(parse(expected, new Date(dateOverride))).toEqual(new Date(date));
    }
  );
});
