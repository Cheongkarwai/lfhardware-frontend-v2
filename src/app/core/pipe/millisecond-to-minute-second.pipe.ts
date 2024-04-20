import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'millisecondToMinuteSecond',
  standalone: true
})
export class MillisecondToMinuteSecondPipe implements PipeTransform {

  transform(value: number): unknown {
        const minutes: number = Math.floor(value / 60);
        return minutes.toString().padStart(2, '0') + ':' +
          (value - minutes * 60).toString().padStart(2, '0');


  }

}
