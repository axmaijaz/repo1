import { Daterangepicker } from 'ng2-daterangepicker';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageEncountersRoutingModule } from './manage-encounters-routing.module';
import { PendingEncountersListComponent } from './pending-encounters-list/pending-encounters-list.component';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DpDatePickerModule } from 'ng2-date-picker';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';
import { SharedDirectivesModule } from '../shared/shared-directives/shared-directives.module';



@NgModule({
  declarations: [PendingEncountersListComponent],
  imports: [
    CommonModule,
    ManageEncountersRoutingModule,
    MdbSharedModule,
    SharedPipesModule,
    NgxDatatableModule,
    SharedDirectivesModule,
    NgSelectModule,
    FormsModule,
    MalihuScrollbarModule.forRoot(),
    DpDatePickerModule,
    Daterangepicker,
  ]
})
export class ManageEncountersModule { }
