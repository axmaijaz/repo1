import { UtilityModule } from './../utility/utility.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BhiMainRoutingModule } from './bhi-main-routing.module';
import { BhiPatientListComponent } from './bhi-patient-list/bhi-patient-list.component';
import { DataTablesModule } from 'angular-datatables';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { FormsModule } from '@angular/forms';
import { DpDatePickerModule } from 'ng2-date-picker';
import { NgSelectModule } from '@ng-select/ng-select';
import { BhiAddEncountersComponent } from './bhi-add-encounters/bhi-add-encounters.component';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { PatientDetailModule } from '../admin/patient/patient-details/patient-detail/patient-detail.module';
import { PatientSharedModule } from '../patient-shared/patient-shared.module';
import { SharedDirectivesModule } from '../shared/shared-directives/shared-directives.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { DocumentViewerModule } from '../document-viewer/document-viewer.module';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';
import { ScreeningToolsModule } from '../screening-tools/screening-tools.module';
import { Daterangepicker } from 'ng2-daterangepicker';
import { CustomPatientListingModule } from '../custom-patient-listing/custom-patient-listing.module';
@NgModule({

    declarations: [BhiPatientListComponent, BhiAddEncountersComponent,
  ],
  imports: [
    CommonModule,
    PatientSharedModule,
    BhiMainRoutingModule,
    SharedDirectivesModule,
    SharedPipesModule,
    FormsModule,
    EditorModule,
    DocumentViewerModule,
    ScreeningToolsModule,
    // PatientSharedModule,
    // SharedModule,
    DpDatePickerModule,
    NgSelectModule,
    MdbSharedModule,
    PatientDetailModule,
    MalihuScrollbarModule.forRoot(),
    DataTablesModule,
    UtilityModule,
    Daterangepicker,
    CustomPatientListingModule,
    NgxPageScrollCoreModule.forRoot({duration: 500}),
  ]
})
export class BhiMainModule { }
