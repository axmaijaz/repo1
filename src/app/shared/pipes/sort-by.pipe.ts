import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

  transform(collection: Array<any>, property: string): Array<any> {
    const SortedArray = collection.sort(function(a, b) {
      return a[property] - b[property];
    });

    return SortedArray;
  }
}
