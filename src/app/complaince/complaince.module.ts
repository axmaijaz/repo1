import { SharedDirectivesModule } from 'src/app/shared/shared-directives/shared-directives.module';
import { MdbSharedModule } from 'src/app/mdb-shared/mdb-shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpDatePickerModule } from 'ng2-date-picker';

import { ComplainceRoutingModule } from './complaince-routing.module';
import { RpmMuteListComponent } from './rpm-mute-list/rpm-mute-list.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Daterangepicker } from 'ng2-daterangepicker';


@NgModule({
  declarations: [RpmMuteListComponent],
  imports: [
    CommonModule,
    ComplainceRoutingModule,
    MdbSharedModule,
    FormsModule,
    SharedDirectivesModule,
    NgSelectModule,
    Daterangepicker,
    DpDatePickerModule
  ]
})
export class ComplainceModule { }
