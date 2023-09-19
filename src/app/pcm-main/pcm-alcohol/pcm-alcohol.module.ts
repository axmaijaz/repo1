import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PcmAlcoholRoutingModule } from './pcm-alcohol-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AlcoholScreeningComponent } from './alcohol-screening/alcohol-screening.component';
import { AlcoholCounsellingComponent } from './alcohol-counselling/alcohol-counselling.component';

@NgModule({
  declarations: [AlcoholScreeningComponent, AlcoholCounsellingComponent],
  imports: [
    CommonModule,
    PcmAlcoholRoutingModule,
    SharedModule
  ],
  exports: [
    AlcoholScreeningComponent
  ]
})
export class PcmAlcoholModule { }
