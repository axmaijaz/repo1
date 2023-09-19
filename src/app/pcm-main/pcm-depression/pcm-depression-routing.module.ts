import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepressionScreeningComponent } from './depression-screening/depression-screening.component';
import { DepressionCounsellingComponent } from './depression-counselling/depression-counselling.component';

const routes: Routes = [
  { path: '', redirectTo: 'depressionScreening', pathMatch: 'full' },
  { path: 'depressionScreening/:sId', component: DepressionScreeningComponent , data: { showPatientLayout: true }},
  { path: 'depressionCounselling/:cId', component: DepressionCounsellingComponent , data: { showPatientLayout: true }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PcmDepressionRoutingModule { }
