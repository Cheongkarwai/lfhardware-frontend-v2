import { MillisecondToMinuteSecondPipe } from './millisecond-to-minute-second.pipe';

describe('MillisecondToMinuteSecondPipe', () => {
  it('create an instance', () => {
    const pipe = new MillisecondToMinuteSecondPipe();
    expect(pipe).toBeTruthy();
  });
});
