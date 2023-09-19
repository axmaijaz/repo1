import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DexcomRoutingModule } from './dexcom-routing.module';
import { DexcomDashboardComponent } from './dexcom-dashboard/dexcom-dashboard.component';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { PatientSharedModule } from '../patient-shared/patient-shared.module';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';
import { SharedDirectivesModule } from '../shared/shared-directives/shared-directives.module';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { Daterangepicker } from 'ng2-daterangepicker';


@NgModule({
  declarations: [DexcomDashboardComponent],
  imports: [
    CommonModule,
    DexcomRoutingModule,
    Daterangepicker,
    SharedDirectivesModule,
    SharedPipesModule,
    MdbSharedModule,
    FormsModule,
    EditorModule,
  ],
  exports: [
    DexcomDashboardComponent
  ]
})
export class DexcomModule { }
