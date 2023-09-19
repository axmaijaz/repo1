import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FilterByprop'
})
export class FilterByprop implements PipeTransform {

  transform(items: any[], prop:string, value: string): any[] {

    if(!items) return [];
    if(!value) return items;


    return items.filter( str => {
          return str[prop].toLowerCase().includes(value.toLowerCase());
        });
   }
}
