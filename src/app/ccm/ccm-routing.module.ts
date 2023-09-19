import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CcmApprovalComponent } from './ccm-approval/ccm-approval.component';

const routes: Routes = [
  { path: '', redirectTo: 'approvals', pathMatch: 'full' },
  { path: 'approvals', component: CcmApprovalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CcmRoutingModule { }
