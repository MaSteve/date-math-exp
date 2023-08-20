import { parse } from '../src/index';

describe('test', () => {
  it('should test', () => {
    console.log('----->>>>', parse('now'));
    console.log('----->>>>', parse('now+1y'));
    console.log('----->>>>', parse('now+1w'));
    console.log('----->>>>', parse('now/y'));
    console.log('----->>>>', parse('now/M'));
    console.log('----->>>>', parse('now/w'));
    console.log('----->>>>', parse('now/d'));
    console.log('----->>>>', parse('now/h'));
    console.log('----->>>>', parse('now/m'));
    console.log('----->>>>', parse('now/s'));
  });
});
