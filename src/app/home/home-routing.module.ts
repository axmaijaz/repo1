import { LandingComponent } from './../landing/landing.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientsListComponent } from './patients-list/patients-list.component';
// import { PatientsTableComponent } from './patients-table/patients-table.component';

const routes: Routes = [
  { path: "", redirectTo: "page", pathMatch: "full" },
  { path: "patients", component: PatientsListComponent },
  { path: "page", component: LandingComponent },
  // { path: "patientTable", component: PatientsTableComponent }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
