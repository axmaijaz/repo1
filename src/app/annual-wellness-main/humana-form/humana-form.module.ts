import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HumanaFormRoutingModule } from './humana-form-routing.module';
import { HumanaFormDetailComponent } from './humana-form-detail/humana-form-detail.component';
import { MdbSharedModule } from 'src/app/mdb-shared/mdb-shared.module';
import { FormsModule } from '@angular/forms';
import { SharedDirectivesModule } from 'src/app/shared/shared-directives/shared-directives.module';
import { NgxSkltnModule } from 'ngx-skltn';
import { DpDatePickerModule } from 'ng2-date-picker';
import { NgSelectModule } from '@ng-select/ng-select';
import { DocumentViewerModule } from 'src/app/document-viewer/document-viewer.module';
import { PrimeWestFormComponent } from './prime-west-form/prime-west-form.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { AwvReportFormComponent } from './awv-report-form/awv-report-form.component';
import { SharedPipesModule } from 'src/app/shared-pipes/shared-pipes.module';

@NgModule({
  declarations: [HumanaFormDetailComponent, PrimeWestFormComponent, AwvReportFormComponent],
  imports: [
    CommonModule,
    SharedPipesModule,
    FormsModule,
    MdbSharedModule,
    HumanaFormRoutingModule,
    SharedDirectivesModule,
    NgxSkltnModule,
    EditorModule,
    DpDatePickerModule,
    NgSelectModule,
    DocumentViewerModule
  ]
})
export class HumanaFormModule { }
