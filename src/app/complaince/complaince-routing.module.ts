import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RpmMuteListComponent } from './rpm-mute-list/rpm-mute-list.component';



const routes: Routes = [
  { path: '', redirectTo: 'mute-list', pathMatch: 'full' },
  { path: 'mute-list', component: RpmMuteListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplainceRoutingModule { }
