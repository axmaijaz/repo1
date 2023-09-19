import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileHealthGuideRoutingModule } from './mobile-health-guide-routing.module';
import { HealthGuideLinesComponent } from './health-guide-lines/health-guide-lines.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [HealthGuideLinesComponent],
  imports: [
    CommonModule,
    MobileHealthGuideRoutingModule,
    SharedModule
  ]
})
export class MobileHealthGuideModule { }
