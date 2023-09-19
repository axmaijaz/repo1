import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from '../Main/main-layout/main-layout.component';
import { PatientModalityListComponent } from './patient-modality-list/patient-modality-list.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { UploadImageComponent } from './upload-image/upload-image.component';


const routes: Routes = [
  // {
  //   path: '',
  //   component: MainLayoutComponent,
  //   canActivate: [AuthGuard],
  //   data: { claimType: 'IsAuthenticated' },
  //   children: [
      { path: 'modalityList/:id', component: PatientModalityListComponent },
      { path: 'modalityList', component: PatientModalityListComponent },
      { path: 'uploadImage', component: UploadImageComponent },
  //   ]
  // }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientDeviceManagementRoutingModule { }
