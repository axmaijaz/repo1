import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FHIRConnectRoutingModule } from './fhir-connect-routing.module';
import { FhirLaunchComponent } from './fhir-launch/fhir-launch.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { Daterangepicker } from 'ng2-daterangepicker';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { SharedModule } from '../shared/shared.module';
import { FhirIndexComponent } from './fhir-index/fhir-index.component';


@NgModule({
  declarations: [FhirLaunchComponent, FhirIndexComponent],
  imports: [
    CommonModule,
    FHIRConnectRoutingModule,
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
    // MalihuScrollbarModule,
    // NgxSkltnModule,
    EditorModule
  ]
})
export class FHIRConnectModule { }
