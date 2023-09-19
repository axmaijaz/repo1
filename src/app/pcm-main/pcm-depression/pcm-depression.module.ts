import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PcmDepressionRoutingModule } from './pcm-depression-routing.module';
import { DepressionScreeningComponent } from './depression-screening/depression-screening.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DepressionCounsellingComponent } from './depression-counselling/depression-counselling.component';

@NgModule({
  declarations: [DepressionScreeningComponent, DepressionCounsellingComponent],
  imports: [
    CommonModule,
    PcmDepressionRoutingModule,
    SharedModule
  ],
  exports: [
    DepressionScreeningComponent
  ]
})
export class PcmDepressionModule { }
