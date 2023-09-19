import { UtilityModule } from './../utility/utility.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrincipalCareManagementRoutingModule } from './principal-care-management-routing.module';
import { PrincipalCareManagementsComponent } from './principal-care-managements/principal-care-managements.component';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { PatientDetailModule } from '../admin/patient/patient-details/patient-detail/patient-detail.module';
import { PatientSharedModule } from '../patient-shared/patient-shared.module';
import { SharedDirectivesModule } from '../shared/shared-directives/shared-directives.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { DocumentViewerModule } from '../document-viewer/document-viewer.module';
import { DataTablesModule } from 'angular-datatables';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { FormsModule } from '@angular/forms';
import { DpDatePickerModule } from 'ng2-date-picker';
import { NgSelectModule } from '@ng-select/ng-select';
import { PrCMEncounterComponent } from './pr-cm-encounter/pr-cm-encounter.component';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';
import { EndoDashboardComponent } from '../endo-dashboard/endo-dashboard.component';
import { CustomPatientListingModule } from '../custom-patient-listing/custom-patient-listing.module';

@NgModule({
  declarations: [PrincipalCareManagementsComponent, PrCMEncounterComponent, EndoDashboardComponent,],
  imports: [
    PrincipalCareManagementRoutingModule,
    CommonModule,
    PatientSharedModule,
    SharedDirectivesModule,
    FormsModule,
    EditorModule,
    DocumentViewerModule,
    DpDatePickerModule,
    NgSelectModule,
    MdbSharedModule,
    PatientDetailModule,
    SharedPipesModule,
    MalihuScrollbarModule.forRoot(),
    DataTablesModule,
    UtilityModule,
    CustomPatientListingModule,
    NgxPageScrollCoreModule.forRoot({duration: 500}),
  ]
})
export class PrincipalCareManagementModule { }
