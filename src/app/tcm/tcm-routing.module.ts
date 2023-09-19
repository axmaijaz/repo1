import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientSummaryGuard } from '../core/guards/patient-summary.guard';
import { DischargeInformationComponent } from './discharge-information/discharge-information.component';
import { DischargeOverviewComponent } from './discharge-overview/discharge-overview.component';
import { FaceToFaceComponent } from './face-to-face/face-to-face.component';
import { NonFaceToFaceComponent } from './non-face-to-face/non-face-to-face.component';
import { TcmListComponent } from './tcm-list/tcm-list.component';

const routes: Routes = [
  {
    path: 'dischargeOverview/:id/:tcmId', component: DischargeOverviewComponent,
    canActivate: [PatientSummaryGuard],
    data: { showPatientLayout: true },
    children: [
      { path: '', redirectTo: 'dischargeInformation' },
      { path: 'dischargeInformation', component: DischargeInformationComponent },
      { path: 'nftf', component: NonFaceToFaceComponent },
      { path: 'ftf', component: FaceToFaceComponent },
    ]
  },
  // { path: 'encountersList/:id', data: { showPatientLayout: true }, component: TcmListComponent}
  { path: 'tcmPatients', component: TcmListComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TcmRoutingModule { }
