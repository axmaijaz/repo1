import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FhirIndexComponent } from './fhir-index/fhir-index.component';
import { FhirLaunchComponent } from './fhir-launch/fhir-launch.component';


const routes: Routes = [
  { path: 'launch', component: FhirLaunchComponent },
  { path: 'index', component: FhirIndexComponent },
  { path: 'epic/launch', component: FhirLaunchComponent },
  { path: 'epic/index', component: FhirIndexComponent },
  { path: 'ecw/launch', component: FhirLaunchComponent },
  { path: 'ecw/index', component: FhirIndexComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class FHIRConnectRoutingModule { }
