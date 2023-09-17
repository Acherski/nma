import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'encode', standalone: true })
export class EncodePipe implements PipeTransform {
  transform(value: string): string {
    return value
      .split('|')
      .map(item => encodeURI(item))
      .join('|');
  }
}
