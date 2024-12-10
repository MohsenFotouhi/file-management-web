import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'storage',
  standalone: true
})
export class StoragePipe implements PipeTransform {
  transform(value: number): unknown {
    const temp = Math.trunc(value / (1024 * 1024));
    let res = '';
    if (temp > 1024) {
      res = `${(temp / 1024).toFixed(2)}GB`;
    } else {
      res = `${temp}MB`;
    }
    return res;
  }
}
