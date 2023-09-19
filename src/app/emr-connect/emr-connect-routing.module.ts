import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AthenaHealthComponent } from './athena-health/athena-health.component';


const routes: Routes = [
  // {path: '', component: AthenaHealthComponent},
  {path: 'athenaHealth', component: AthenaHealthComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class EMRConnectRoutingModule { }
