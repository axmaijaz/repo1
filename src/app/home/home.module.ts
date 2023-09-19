import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { PatientsListComponent } from './patients-list/patients-list.component';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedDirectivesModule } from '../shared/shared-directives/shared-directives.module';
import { DpDatePickerModule } from 'ng2-date-picker';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';
import { DataTablesModule } from 'angular-datatables';
import { PatientTaskModule } from '../patient-Task-modal/patient-task.module';
import { LandingComponent } from '../landing/landing.component';
import { Daterangepicker } from 'ng2-daterangepicker';
// import { PatientsTableComponent } from './patients-table/patients-table.component';
import { PopoverModule } from 'ng-uikit-pro-standard'
import { PatientSharedModule } from '../patient-shared/patient-shared.module';
import { UtilityModule } from '../utility/utility.module';
import { CustomPatientListingModule } from '../custom-patient-listing/custom-patient-listing.module';

@NgModule({
  declarations: [PatientsListComponent,LandingComponent,
    // PatientsTableComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    // SharedModule,
    SharedPipesModule,
    MdbSharedModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    SharedDirectivesModule,
    DpDatePickerModule,
    DataTablesModule,
    PatientTaskModule,
    Daterangepicker,
    PopoverModule,
    PatientSharedModule,
    UtilityModule,
    CustomPatientListingModule,
    NgxPageScrollCoreModule.forRoot({duration: 500}),
  ],
  schemas:      [ NO_ERRORS_SCHEMA ]
})
export class HomeModule { }
