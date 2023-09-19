import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlcoholScreeningComponent } from './alcohol-screening/alcohol-screening.component';
import { AlcoholCounsellingComponent } from './alcohol-counselling/alcohol-counselling.component';

const routes: Routes = [
  { path: '', redirectTo: 'alcoholScreening', pathMatch: 'full' },
  { path: 'alcoholScreening/:sId', component: AlcoholScreeningComponent , data: { showPatientLayout: true }},
  { path: 'alcoholCounselling/:cId', component: AlcoholCounsellingComponent , data: { showPatientLayout: true }},
  { path: 'Counselling/:cId', component: AlcoholCounsellingComponent , data: { showPatientLayout: true , gCounselling: true}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PcmAlcoholRoutingModule { }
