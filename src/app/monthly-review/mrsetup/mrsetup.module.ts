import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MRSetupRoutingModule } from './mrsetup-routing.module';
import { SetupMrProblemsComponent } from './setup-mr-problems/setup-mr-problems.component';
import { FormsModule } from '@angular/forms';
import { MdbSharedModule } from 'src/app/mdb-shared/mdb-shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { SetupMrGoalsComponent } from './setup-mr-goals/setup-mr-goals.component';
import { SetupMrInterventionsComponent } from './setup-mr-interventions/setup-mr-interventions.component';
import { SetupAssessmentProblemsComponent } from './setup-assessment-problems/setup-assessment-problems.component';
import { SetupAssessmentQustionsComponent } from './setup-assessment-qustions/setup-assessment-qustions.component';


@NgModule({
  declarations: [SetupMrProblemsComponent, SetupMrGoalsComponent, SetupMrInterventionsComponent, SetupAssessmentProblemsComponent, SetupAssessmentQustionsComponent],
  imports: [
    CommonModule,
    MRSetupRoutingModule,
    FormsModule,
    MdbSharedModule,
    NgxDatatableModule,
    NgSelectModule
  ]
})
export class MRSetupModule { }
