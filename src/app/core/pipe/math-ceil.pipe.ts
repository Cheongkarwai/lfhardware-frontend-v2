import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mathCeil',
  standalone: true
})
export class MathCeilPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): number {
    console.log(value);
    return Math.ceil(value);
  }

}
