import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomListConfigurationComponent } from './custom-list-configuration/custom-list-configuration.component';
import { CustomPatientsListComponent } from './custom-patients-list/custom-patients-list.component';


const routes: Routes = [
  { path: "", redirectTo: ":id", pathMatch: "full" },
  { path: "listConfigration", component: CustomListConfigurationComponent },
  { path: ":id", component: CustomPatientsListComponent },
  // { path: "patientTable", component: PatientsTableComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomPatientListingRoutingModule { }
