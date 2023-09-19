import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PcmMainRoutingModule } from './pcm-main-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PcmEncounterListComponent } from './pcm-encounter-list/pcm-encounter-list.component';
import { PcmMeasuresComponent } from './pcm-measures/pcm-measures.component';

@NgModule({
  declarations: [PcmEncounterListComponent, PcmMeasuresComponent],
  imports: [
    CommonModule,
    PcmMainRoutingModule,
    SharedModule
  ]
})
export class PcmMainModule { }
