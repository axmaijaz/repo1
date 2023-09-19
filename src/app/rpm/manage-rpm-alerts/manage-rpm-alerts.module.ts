import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRpmAlertsRoutingModule } from './manage-rpm-alerts-routing.module';
import { AlertsListComponent } from './alerts-list/alerts-list.component';
import { MdbSharedModule } from 'src/app/mdb-shared/mdb-shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DpDatePickerModule } from 'ng2-date-picker';
import { FormsModule } from '@angular/forms';
import { PatientTaskModule } from 'src/app/patient-Task-modal/patient-task.module';


@NgModule({
  declarations: [AlertsListComponent],
  imports: [
    CommonModule,
    MdbSharedModule,
    NgxDatatableModule,
    NgSelectModule,
    FormsModule,
    DpDatePickerModule,
    PatientTaskModule,
    ManageRpmAlertsRoutingModule
  ]
})
export class ManageRpmAlertsModule { }
