import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DexcomDashboardComponent } from './dexcom-dashboard/dexcom-dashboard.component';


const routes: Routes = [
  // { path: '', redirectTo: 'dexcomDashboard', pathMatch: 'full' },
  { path: 'dexcomDashboard', component: DexcomDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DexcomRoutingModule { }
