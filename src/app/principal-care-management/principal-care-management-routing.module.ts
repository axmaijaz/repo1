import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EndoDashboardComponent } from '../endo-dashboard/endo-dashboard.component';
import { PrCMEncounterComponent } from './pr-cm-encounter/pr-cm-encounter.component';
import { PrincipalCareManagementsComponent } from './principal-care-managements/principal-care-managements.component';


const routes: Routes = [
  { path: '', redirectTo: 'Principal', pathMatch: 'full' },
  { path: 'Principal', component: PrincipalCareManagementsComponent },
  { path: 'Dashboard', component: EndoDashboardComponent },
  { path: 'PrcmEncounters/:id', component: PrCMEncounterComponent , data: { showPatientLayout: true } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalCareManagementRoutingModule { }
