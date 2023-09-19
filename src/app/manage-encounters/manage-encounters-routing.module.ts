import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PendingEncountersListComponent } from './pending-encounters-list/pending-encounters-list.component';


const routes: Routes = [
  {path: 'pending', component: PendingEncountersListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageEncountersRoutingModule { }
