import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EllipsisPipe } from '../ellipsis.pipe';
import { FilterFUsersByRolePipe } from './filter-fusers-by-role.pipe';
import { FilterByprop } from './filter-by-model.pipe';
import { GroupByDatePipe } from './group-by-date.pipe';
import { DateMaskPipe } from '../shared/pipes/date-mask.pipe';
import { FilterAdminUsersByRolePipe } from './filter-adminusers-by-role.pipe';



@NgModule({
  declarations: [EllipsisPipe, FilterFUsersByRolePipe, FilterAdminUsersByRolePipe, FilterByprop, GroupByDatePipe, DateMaskPipe],
  imports: [
    CommonModule
  ],
  exports: [ EllipsisPipe, FilterFUsersByRolePipe, FilterByprop, GroupByDatePipe, DateMaskPipe, FilterAdminUsersByRolePipe]
})
export class SharedPipesModule { }
