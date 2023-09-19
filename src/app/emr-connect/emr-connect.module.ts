import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EMRConnectRoutingModule } from './emr-connect-routing.module';
import { AthenaHealthComponent } from './athena-health/athena-health.component';
import { EmrActionsComponent } from './emr-actions/emr-actions.component';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'ng-uikit-pro-standard'
import { DatepickerModule } from 'ng-uikit-pro-standard';
import { DpDatePickerModule } from 'ng2-date-picker';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';
import { PatientSharedModule } from '../patient-shared/patient-shared.module';
import { SharedDirectivesModule } from '../shared/shared-directives/shared-directives.module';

@NgModule({
  declarations: [AthenaHealthComponent, EmrActionsComponent],
  imports: [
CommonModule,
    EMRConnectRoutingModule,
    MdbSharedModule,
    DpDatePickerModule,
    SharedPipesModule,
    SharedDirectivesModule,
    PatientSharedModule,
    FormsModule,
    DropdownModule,
    DatepickerModule
  ],
  exports: [
    EmrActionsComponent
  ]
})
export class EMRConnectModule { }
