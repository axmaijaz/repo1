import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsuranceRoutingModule } from './insurance-routing.module';
import { PcmPatientsListComponent } from './pcm-patients-list/pcm-patients-list.component';
import { PayersManageComponent } from './payers-manage/payers-manage.component';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { SharedModule } from '../shared/shared.module';
import { Daterangepicker } from 'ng2-daterangepicker';
import { PcmCareGapsListComponent } from './pcm-care-gaps-list/pcm-care-gaps-list.component';
import { CustomPatientListingModule } from '../custom-patient-listing/custom-patient-listing.module';

@NgModule({
  declarations: [PcmPatientsListComponent, PayersManageComponent, PcmCareGapsListComponent],
  imports: [
    CommonModule,
    SharedModule,
    MdbSharedModule,
    Daterangepicker,
    // FormsModule,
    // NgSelectModule,
    // NgxDatatableModule,
    // SharedDirectivesModule,
    // SharedPipesModule,
    // DpDatePickerModule,
    // DataTablesModule,
    InsuranceRoutingModule,
    // MalihuScrollbarModule,
    // NgxSkltnModule,
    EditorModule,
    CustomPatientListingModule,
  ]
})
export class InsuranceModule { }
