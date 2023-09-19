import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientDetailRoutingModule } from './patient-detail-routing.module';
import { PatientDetailsComponent } from '../patient-details.component';
// import { PatientGapDetailComponent } from './patient-gap-detail/patient-gap-detail.component';
import { NgxSkltnModule } from 'ngx-skltn';
import { FormsModule } from '@angular/forms';
import { DpDatePickerModule } from 'ng2-date-picker';
import { MdbSharedModule } from 'src/app/mdb-shared/mdb-shared.module';
import { SharedPipesModule } from 'src/app/shared-pipes/shared-pipes.module';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { DocumentViewerModule } from 'src/app/document-viewer/document-viewer.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableModule } from 'ng-uikit-pro-standard';

@NgModule({
  declarations: [PatientDetailsComponent],
  imports: [
  CommonModule,
    FormsModule,
    MdbSharedModule,
    SharedPipesModule,
    MalihuScrollbarModule.forRoot(),
    DpDatePickerModule,
    NgxSkltnModule,
    PatientDetailRoutingModule,
    DocumentViewerModule,
    NgSelectModule,
    TableModule
  ],
  exports: [
    PatientDetailsComponent,
    // PatientGapDetailComponent
  ]
})
export class PatientDetailModule { }
