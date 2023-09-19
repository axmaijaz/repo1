import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RpmDashboardComponent } from '../rpm-dashboard/rpm-dashboard.component';
import { RpmPatientsListComponent } from './rpm-patients-list/rpm-patients-list.component';
import { RpmReadingsListComponent } from './rpm-readings-list/rpm-readings-list.component';


const routes: Routes = [
  // { path: '', redirectTo: '', pathMatch: 'full' },
  // { path: '', component: RpmPatientsListComponent },
  { path: '', component: RpmDashboardComponent },
  { path: ':id/readings', component: RpmReadingsListComponent, data: { showPatientLayout: true}},
  { path: 'readings', component: RpmReadingsListComponent, data: { showPatientLayout: true}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RpmMainRoutingModule { }
