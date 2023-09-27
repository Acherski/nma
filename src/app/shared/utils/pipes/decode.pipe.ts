import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'decode', standalone: true })
export class DecodePipe implements PipeTransform {
  transform(value: string): string {
    return value
      .split('|')
      .map(item => decodeURI(item))
      .join('|');
  }
}
