import { Pipe, PipeTransform } from '@angular/core';
import { CreateFacilityUserDto } from '../model/Facility/facility.model';

@Pipe({
  name: 'filterFUsersByRole'
})
export class FilterFUsersByRolePipe implements PipeTransform {

  transform(collection: Array<CreateFacilityUserDto>, property: string): Array<any> {
    const result = [];
    if (collection) {
      collection.map(item => {
        if (item.roles) {
          const tempArr = item.roles.split(',');
          const res = tempArr.find(x => x.trim() === property);
          if (res) {
            result.push(item);
          }
        }
      });
      return result;
    } else {
      return [];
    }
  }

}
