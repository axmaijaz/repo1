import { InsightsSettingComponent } from './insights-setting/insights-setting.component';
import { MedicationComponent } from './../admin/patient/medication/medication.component';
import { DiagnoseComponent } from './../admin/patient/diagnose/diagnose.component';
import { InsightsLayoutComponent } from './insights-layout/insights-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllergiesComponent } from '../patient-shared/allergies/allergies.component';
import { RpmInsightsComponent } from './rpm-insights/rpm-insights.component';
import { InsightsSummaryComponent } from './insights-summary/insights-summary.component';
import { PatientRpmModalitiesComponent } from '../patient-shared/patient-rpm-modalities/patient-rpm-modalities.component';
import { MasterCarePlanComponent } from '../admin/patient/master-care-plan/master-care-plan.component';
import { InsightsEmrLayoutComponent } from './insights-emr-layout/insights-emr-layout.component';
import { PatientRpmAlertsComponent } from '../patient-shared/patient-rpm-alerts/patient-rpm-alerts.component';
import { ServiceConfigGuard } from '../core/guards/service-config.guard';
import { PatientNotificationSettingComponent } from '../patient-shared/patient-notification-setting/patient-notification-setting.component';
import { PatientSmsvoiceConsentComponent } from '../patient-shared/patient-smsvoice-consent/patient-smsvoice-consent.component';
import { PatientSettingLayoutComponent } from '../patient-shared/patient-setting/patient-setting-layout.component';
import { SyncPatientWithEmrComponent } from './sync-patient-with-emr/sync-patient-with-emr.component';


const routes: Routes = [
  { path: 'settings', component: InsightsSettingComponent, data: { showPatientLayout: true } },
  {
    path: '', component: InsightsLayoutComponent,
    children: [
      { path: 'summary/:id', component: InsightsSummaryComponent },
      { path: 'consents', loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule) },
      { path: 'diagnoses/:id', component: DiagnoseComponent },
      { path: 'medications/:id', component: MedicationComponent },
      { path: 'allergies/:id', component: AllergiesComponent },
      { path: 'careplan/:id', component: MasterCarePlanComponent },
      // {path: 'rpm/:id', component: RpmInsightsComponent},
      { path: 'modalities/:id', component: PatientRpmModalitiesComponent },
      { path: 'rpmModal', loadChildren: () => import('../rpm/rpm.module').then(m => m.RpmModule) },
      { path: 'mrModal/:id', loadChildren: () => import('../monthly-review/monthly-review.module').then(m => m.MonthlyReviewModule) },
      { path: 'ccmLogs', loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule) },
      { path: 'rpmLogs', loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule) },
    ]
  },
  {
    path: 'embedded', component: InsightsEmrLayoutComponent,
    children: [
      { path: 'summary/:id', component: InsightsSummaryComponent },
      { path: 'diagnoses/:id', component: DiagnoseComponent },
      { path: 'medications/:id', component: MedicationComponent },
      { path: 'allergies/:id', component: AllergiesComponent },
      { path: 'careplan/:id', component: MasterCarePlanComponent },
      { path: 'sync/:id', component: SyncPatientWithEmrComponent },
      // {path: 'rpm/:id', component: RpmInsightsComponent},
      { path: 'modalities/:id', data: { serviceType: "RPM" }, canActivate: [ServiceConfigGuard], component: PatientRpmModalitiesComponent },
      { path: 'rpmModal', canActivate: [ServiceConfigGuard], loadChildren: () => import('../rpm/rpm.module').then(m => m.RpmModule) },
      { path: 'mrModal/:id', data: { claimType: ['CanViewMonthlyReview'], serviceType: "CCM" }, canActivate: [ServiceConfigGuard], loadChildren: () => import('../monthly-review/monthly-review.module').then(m => m.MonthlyReviewModule) },
      { path: 'ccmLogs', loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule) },
      { path: 'rpmLogs', loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule) },
      { path: 'rpmAlerts/:id', data: { serviceType: "RPM" }, canActivate: [ServiceConfigGuard], component: PatientRpmAlertsComponent },
      { path: 'consents', loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule) },
    ]
  },
  {
    path: 'setting', component: PatientSettingLayoutComponent, data: { showPatientLayout: true },
    children: [
      { path: 'rpmNotifications/:id', component: PatientNotificationSettingComponent },
      { path: 'sms-voice-consent/:id', component: PatientSmsvoiceConsentComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientInsightsRoutingModule { }
