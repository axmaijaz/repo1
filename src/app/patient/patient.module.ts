import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientRoutingModule } from './patient-routing.module';
import { AppointmentComponent } from './appointment/appointment.component';
import { SharedModule } from '../shared/shared.module';

import { MedicalRecordsComponent } from './medical-records/medical-records.component';
// import { PatientSharedModule } from '../patient-shared/patient-shared.module';
import { PatientProfileComponent } from './patient-profile/patient-profile.component';
import { AgmCoreModule } from '@agm/core';
import { QRCodeModule } from 'angularx-qrcode';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';

@NgModule({
  declarations: [AppointmentComponent, MedicalRecordsComponent, PatientProfileComponent],
  imports: [
    CommonModule,
    PatientRoutingModule,
    SharedModule,
    QRCodeModule,
    MalihuScrollbarModule
    // AgmCoreModule.forRoot({
    //   apiKey: "AIzaSyDuGcWGIfbZbmIwUD_cHfovG-L8-SSL_I4",
    //   libraries: ["places"]
    // }),
    // PatientSharedModule
  ]
})
export class PatientModule { }
