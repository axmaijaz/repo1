import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonthlyReviewComponent } from './monthly-review/monthly-review.component';
import { DeactivateMRRouteGuard } from './Guards/deactivate-mrroute.guard';
import { AuthGuard } from '../core/guards/auth.guard';
import { ServiceConfigGuard } from '../core/guards/service-config.guard';
import { PatientSummaryGuard } from '../core/guards/patient-summary.guard';

const routes: Routes = [
  { path: '', redirectTo: 'monthlyReview', pathMatch: 'full' },
  { path: 'monthlyReview', component: MonthlyReviewComponent, data: { showPatientLayout: true, claimType: ['CanViewMonthlyReview'], serviceType:"CCM" }, canDeactivate: [DeactivateMRRouteGuard], canActivate: [AuthGuard, ServiceConfigGuard, PatientSummaryGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthlyReviewRoutingModule { }
