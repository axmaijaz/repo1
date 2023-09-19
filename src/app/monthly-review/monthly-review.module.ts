import { UtilityModule } from './../utility/utility.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonthlyReviewRoutingModule } from './monthly-review-routing.module';
import { MonthlyReviewComponent } from './monthly-review/monthly-review.component';
import { SharedModule } from '../shared/shared.module';
import { MrAssessmentComponent } from './mr-assessment/mr-assessment.component';
import { PatientSharedModule } from '../patient-shared/patient-shared.module';

@NgModule({
  declarations: [MonthlyReviewComponent, MrAssessmentComponent],
  imports: [
    CommonModule,
    MonthlyReviewRoutingModule,
    PatientSharedModule,
    SharedModule,
    UtilityModule
  ]
})
export class MonthlyReviewModule { }
