import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RpmMainRoutingModule } from './rpm-main-routing.module';
import { RpmPatientsListComponent } from './rpm-patients-list/rpm-patients-list.component';
import { RpmReadingsListComponent } from './rpm-readings-list/rpm-readings-list.component';
import { SharedDirectivesModule } from 'src/app/shared/shared-directives/shared-directives.module';
import { DataTablesModule } from 'angular-datatables';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { DpDatePickerModule } from 'ng2-date-picker';
import { PatientSharedModule } from 'src/app/patient-shared/patient-shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MdbSharedModule } from 'src/app/mdb-shared/mdb-shared.module';
import { FormsModule } from '@angular/forms';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [RpmPatientsListComponent, RpmReadingsListComponent],
  imports: [
    CommonModule,
    RpmMainRoutingModule,
    PatientSharedModule,
    NgSelectModule,
    SharedDirectivesModule,
    DataTablesModule,
    DpDatePickerModule,
    Daterangepicker,
    MdbSharedModule,
    NgxDatatableModule,
    FormsModule,
    NgxPageScrollCoreModule.forRoot({duration: 500}),
  ]
})
export class RpmMainModule { }
