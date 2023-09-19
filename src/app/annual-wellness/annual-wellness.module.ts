import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnnualWellnessRoutingModule } from './annual-wellness-routing.module';
import { AwDetailComponent } from './aw-detail/aw-detail.component';
import { SharedModule } from '../shared/shared.module';
import { PatientSharedModule } from '../patient-shared/patient-shared.module';
import { PcmHistoryModule } from '../pcm-history/pcm-history.module';
import { SharedDirectivesModule } from '../shared/shared-directives/shared-directives.module';

@NgModule({
  declarations: [AwDetailComponent],
  imports: [
    CommonModule,
    AnnualWellnessRoutingModule,
    SharedDirectivesModule,
    SharedModule,
    PatientSharedModule,
    PcmHistoryModule,
  ]
})
export class AnnualWellnessModule { }
