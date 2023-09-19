import { Pipe, PipeTransform } from '@angular/core';
import { CreateFacilityUserDto } from '../model/Facility/facility.model';
import { AppAdminDto } from '../core/administration.model';

@Pipe({
  name: 'filterAdminUsersByRole'
})
export class FilterAdminUsersByRolePipe implements PipeTransform {

  transform(collection: Array<AppAdminDto>, property: string): Array<any> {
    const result = [];
    if (collection) {
      collection.map(item => {
        if (item.roleNames) {
          const tempArr = item.roleNames.split(',');
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
