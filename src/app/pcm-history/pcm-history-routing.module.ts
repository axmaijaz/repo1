import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FamilyHistoryComponent } from './family-history/family-history.component';
import { SurgicalHistoryComponent } from './surgical-history/surgical-history.component';

const routes: Routes = [

  { path: '', redirectTo: 'family', pathMatch: 'full' },
  { path: 'family', component: FamilyHistoryComponent },
  { path: 'surgical', component:  SurgicalHistoryComponent},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PcmHistoryRoutingModule { }
