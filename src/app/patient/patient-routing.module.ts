import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from '../Main/main-layout/main-layout.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { AppointmentComponent } from './appointment/appointment.component';
import { MedicalRecordsComponent } from './medical-records/medical-records.component';
import { DiagnoseComponent } from '../admin/patient/diagnose/diagnose.component';
import { MedicationComponent } from '../admin/patient/medication/medication.component';
import { PatientProfileComponent } from './patient-profile/patient-profile.component';
import { ImunizationComponent } from '../patient-shared/imunization/imunization.component';
import { AllergiesComponent } from '../patient-shared/allergies/allergies.component';
import { ConsentDocComponent } from '../admin/consent-doc/consent-doc.component';
import { CarePlanViewComponent } from '../admin/patient/care-plan-view/care-plan-view.component';

const routes: Routes = [
  // {
  //   path: "",
  //   component: MainLayoutComponent,
  //   canActivate: [AuthGuard],
  //   data: { claimType: "IsAuthenticated" },
  //   children: [
  { path: 'appointment', component: AppointmentComponent },
  { path: ':id/consentdoc', component: ConsentDocComponent },
  {
    path: 'medicalRecords',
    component: MedicalRecordsComponent,
    children: [
      { path: '', redirectTo: 'diagnoses' },
      { path: 'pDetail', loadChildren: () => import('../patient-shared/patient-shared.module').then(m => m.PatientSharedModule) },
      // { path: "diagnoses", component: DiagnoseComponent },
      // { path: "medications", component: MedicationComponent },
      // { path: "immunization", component: ImunizationComponent },
      // { path: "allergies", component: AllergiesComponent }
    ]
  },
  { path: 'pDetail', loadChildren: () => import('../patient-shared/patient-shared.module').then(m => m.PatientSharedModule) },
  {
    path: 'profile',
    component: PatientProfileComponent,
    canActivate: [AuthGuard],
    data: { claimType: ['IsPatient'] }
  }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
