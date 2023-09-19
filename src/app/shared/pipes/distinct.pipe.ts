import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distinct',
  pure: false
})
export class DistinctPipe implements PipeTransform {

  transform(collection: Array<any>, property: string): Array<any> {
    const distictArray = Array.from(new Set(collection.map(x => x[property])))
    .map(id => {
      return collection.find(x => x[property] === id);
    });

    return distictArray;
  }

}
