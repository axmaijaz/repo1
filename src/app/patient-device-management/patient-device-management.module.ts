import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientDeviceManagementRoutingModule } from './patient-device-management-routing.module';
import { PatientModalityListComponent } from './patient-modality-list/patient-modality-list.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { SharedModule } from '../shared/shared.module';
import { DropdownModule } from 'ng-uikit-pro-standard';

@NgModule({
  declarations: [PatientModalityListComponent, UploadImageComponent],
  imports: [
    CommonModule,
    PatientDeviceManagementRoutingModule,
    SharedModule,
    DropdownModule.forRoot()
  ]
})
export class PatientDeviceManagementModule { }
