import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupMrProblemsComponent } from './setup-mr-problems/setup-mr-problems.component';
import { SetupMrGoalsComponent } from './setup-mr-goals/setup-mr-goals.component';
import { SetupMrInterventionsComponent } from './setup-mr-interventions/setup-mr-interventions.component';
import { SetupAssessmentProblemsComponent } from './setup-assessment-problems/setup-assessment-problems.component';
import { SetupAssessmentQustionsComponent } from './setup-assessment-qustions/setup-assessment-qustions.component';


const routes: Routes = [
  { path: '', redirectTo: 'Problems', pathMatch: 'full' },
  { path: 'Problems', component: SetupMrProblemsComponent },
  { path: 'Goals', component: SetupMrGoalsComponent },
  { path: 'Interventions', component: SetupMrInterventionsComponent },
  { path: 'AssessmentProblems', component: SetupAssessmentProblemsComponent },
  { path: 'AssessmentQuestions', component: SetupAssessmentQustionsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MRSetupRoutingModule { }
