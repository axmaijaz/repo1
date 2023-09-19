import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PcmPatientsListComponent } from './pcm-patients-list/pcm-patients-list.component';
import { PayersManageComponent } from './payers-manage/payers-manage.component';
import { PcmCareGapsListComponent } from './pcm-care-gaps-list/pcm-care-gaps-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'iPatients', pathMatch: 'full' },
  { path: 'iPatients', component: PcmPatientsListComponent },
  { path: 'payers', component: PayersManageComponent },
  { path: 'pcm-status', component: PcmCareGapsListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuranceRoutingModule { }
