import { BBCCDAComponent } from './bb-ccda/bb-ccda.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EOBComponent } from './eob/eob.component';
import { EOBV2Component } from './eobv2/eobv2.component';
import { MedicareEobComponent } from './medicare-eob/medicare-eob.component';
import { ParticalHealthComponent } from './partical-health/partical-health.component';

const routes: Routes = [
  // { path: '', redirectTo: 'EOB', pathMatch: 'full' },
  { path: 'eob', component: EOBComponent, data: { showPatientLayout: true } },
  { path: 'bb-ccda/:id', component: BBCCDAComponent, data: { showPatientLayout: true } },
  { path: 'medicareEob', component: MedicareEobComponent, data: { showPatientLayout: true } },
  { path: 'medicareEob2', component: EOBV2Component, data: { showPatientLayout: true } },
  { path: 'particalHealth/:id', component: ParticalHealthComponent, data: { showPatientLayout: true } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediCareRoutingModule { }
