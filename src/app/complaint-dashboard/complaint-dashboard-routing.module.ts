import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComplaintDashboardCenterComponent } from './complaint-dashboard-center/complaint-dashboard-center.component';


const routes: Routes = [
  { path: '', redirectTo: 'center', pathMatch: 'full' },
  { path: 'center', component: ComplaintDashboardCenterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplaintDashboardRoutingModule { }
