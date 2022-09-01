import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vocalsToNumbers',
})
export class VocalsToNumbersPipe implements PipeTransform {
  transform(value: string): string {
    return value
      .split('')
      .map((letter) =>
        letter
          .replace('a', '4')
          .replace('e', '3')
          .replace('i', '1')
          .replace('o', '0')
          .replace('u', 'X')
      )
      .join('');
  }
}
