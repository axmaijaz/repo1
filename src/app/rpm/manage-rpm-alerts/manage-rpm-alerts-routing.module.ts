import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertsListComponent } from './alerts-list/alerts-list.component';


const routes: Routes = [
  {path: 'alertList', component: AlertsListComponent},
  {path: 'alertList/:id', component: AlertsListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRpmAlertsRoutingModule { }
