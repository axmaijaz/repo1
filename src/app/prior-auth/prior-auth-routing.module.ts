import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPriorAuthComponent } from './add-prior-auth/add-prior-auth.component';
import { ManageCasesComponent } from './manage-cases/manage-cases.component';
import { PriorAuthListComponent } from './prior-auth-list/prior-auth-list.component';


const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'add', component: AddPriorAuthComponent },
  { path: 'list', component: PriorAuthListComponent },
  { path: 'cases', component: ManageCasesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriorAuthRoutingModule { }
