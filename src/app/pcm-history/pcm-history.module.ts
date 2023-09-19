import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PcmHistoryRoutingModule } from './pcm-history-routing.module';
import { SurgicalHistoryComponent } from './surgical-history/surgical-history.component';
import { FamilyHistoryComponent } from './family-history/family-history.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SurgicalHistoryComponent, FamilyHistoryComponent],
  imports: [
    CommonModule,
    PcmHistoryRoutingModule,
    SharedModule
  ],
  exports: [
    SurgicalHistoryComponent, FamilyHistoryComponent
  ]
})
export class PcmHistoryModule { }
