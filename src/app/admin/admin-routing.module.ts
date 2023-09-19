// import { MasterCarePlanComponent } from './patient/master-care-plan/master-care-plan.component';
import { CcmComponent } from './patient/ccm/ccm.component';
// import { PatientsListComponent } from './patients-list/patients-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../shared/page-not-found/page-not-found.component';
// import { MainLayoutComponent } from '../Main/main-layout/main-layout.component';
// import { AdminDashboardComponent } from '../dashboard/admin-dashboard/admin-dashboard.component';
// import { AuthGuard } from '../core/guards/auth.guard';
import { PatientComponent } from './patient/patient.component';
import { EncounterComponent } from './patient/encounter/encounter.component';
// import { DiagnoseComponent } from './patient/diagnose/diagnose.component';
// import { MedicationComponent } from './patient/medication/medication.component';
// import { DiseasesComponent } from './diseases/diseases.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
// import { ProvidersComponent } from './patient/providers/providers.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
// import { CcmPatientListComponent } from './ccm-patient-list/ccm-patient-list.component';
// import { BlueButtonComponent } from './blue-button/blue-button.component';
import { PatientConsentComponent } from './patient-consent/patient-consent.component';
import { AddPatientComponent } from '../shared/add-patient/add-patient.component';
import { CcmQuestionListComponent } from './ccm-question-list/ccm-question-list.component';
import { PatientSummaryComponent } from './patient-summary/patient-summary.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { LogsHistoryComponent } from './logs-history/logs-history.component';
// import { ClinicalSummaryComponent } from './clinical-summary/clinical-summary.component';
// import { EmergencyPlanComponent } from './emergency-plan/emergency-plan.component';
// import { CcmBillingComponent } from './ccm-billing/ccm-billing.component';
import { ConsentDocComponent } from './consent-doc/consent-doc.component';
import { FacilityUserSettingComponent } from './facility-user-setting/facility-user-setting.component';
import { DailyReportingComponent } from './daily-reporting/daily-reporting.component';
import { AppUserClaimsComponent } from '../shared/app-user-claims/app-user-claims.component';
import { PatientSummaryGuard } from '../core/guards/patient-summary.guard';
// import { ImunizationComponent } from '../patient-shared/imunization/imunization.component';
// import { AllergiesComponent } from '../patient-shared/allergies/allergies.component';
// import { PatientRpmComponent } from '../rpm/patient-rpm/patient-rpm.component';

const routes: Routes = [
  // {
  //   path: "",
  //   component: MainLayoutComponent,
  //   canActivate: [AuthGuard],
  //   data: { claimType: "IsAuthenticated" },
  //   children: [
      { path: "", redirectTo: "/home/page", pathMatch: "full" },
      // { path: "dashboard", component: AdminDashboardComponent },
      // { path: "patients", component: PatientsListComponent },
      // { path: 'patients', component: PatientsListComponent , canActivate: [AuthGuard], data: { claimType: [ 'IsAppAdmin' , 'IsPatient', 'IsFacilityUser' ] } },
      // { path: "diseases", component: DiseasesComponent },
      { path: "users", component: UserManagerComponent },
      { path: "questionnaire", component: QuestionnaireComponent },
      // { path: "facilityUsers", component: FacilitUsersComponent, canActivate: [AuthGuard], data: { claimType: ["IsFacilityUser"] } },
      // {
      //   path: 'facilityUsers/:facilityId/:OrgId',
      //   component: FacilitUsersComponent
      // },
      // { path: 'CcmPatients', component: CcmPatientListComponent },
      // { path: 'bluebutton', component: BlueButtonComponent },
      // {
      //   path: 'bluebutton/:id',
      //   component: BlueButtonComponent,
      //   data: { showPatientLayout: true }
      // },
      { path: 'addPatient', component: AddPatientComponent },
      {
        path: 'addPatient/:id',
        component: AddPatientComponent,
        data: { showPatientLayout: true }
      },
      { path: 'patientSummary', component: PatientSummaryComponent },
      { path: 'settings', component: AdminSettingsComponent },
      { path: 'usersettings', component: FacilityUserSettingComponent, data: {isConfigRoute: true},
        children: [
          { path: 'insurance', loadChildren: () => import('../insurance/insurance.module').then(m => m.InsuranceModule) },
          { path: 'priorAuth', loadChildren: () => import('../prior-auth/prior-auth.module').then(m => m.PriorAuthModule) },
          { path: 'insights', loadChildren: () => import('../patient-insights/patient-insights.module').then(m => m.PatientInsightsModule) },
          { path: 'service', loadChildren: () => import('../organization/org.module').then(m => m.OrgModule) },
          { path: 'config', loadChildren: () => import('../configuration/configuration.module').then(m => m.ConfigurationModule) },
        ]
      },
      { path: 'patientConsent/:id', component: PatientConsentComponent },
      {
        path: 'logsHistory/:id',
        component: LogsHistoryComponent,
        data: { showPatientLayout: true }
      },
      { path: "CpQuestions/:id", component: CcmQuestionListComponent, data: { showPatientLayout: true } },
      { path: 'appUsersClaims', component: AppUserClaimsComponent },
      // { path: 'ccmbilling' , component: CcmBillingComponent },
      // { path: 'organizations', component: OrganizationsComponent },
      { path: 'dailyReporting', component: DailyReportingComponent },
      {
        path: 'consentdoc/:id',
        component: ConsentDocComponent,
        data: { showPatientLayout: true }
      },
      {
        path: 'patient/:id',
        component: PatientComponent,
        canActivate: [PatientSummaryGuard],
        data: { showPatientLayout: true },
        children: [
          { path: '', redirectTo: 'summary' },
          // { path: 'diagnoses', component: DiagnoseComponent },
          { path: 'pDetail', loadChildren: () => import('../patient-shared/patient-shared.module').then(m => m.PatientSharedModule)},
          // { path: 'medications', component: MedicationComponent },
          { path: 'summary', component: CcmComponent },
          { path: 'encounter', component: EncounterComponent },
          { path: 'CcmQuestionList', component: CcmQuestionListComponent },
          // { path: 'providers', component: ProvidersComponent },
          // { path: 'clinicalsummary', component: ClinicalSummaryComponent },
          // { path: 'masterCarePlan', component: MasterCarePlanComponent },
          // { path: 'emergencyplan', component: EmergencyPlanComponent },
          // { path: 'immunization', component: ImunizationComponent },
          // { path: 'allergies', component: AllergiesComponent },
            // { path: 'accounts', loadChildren: () => import(`../pcm-history/pcm-history.module`).then(m => m.AccountsModule) },
          { path: 'history', loadChildren: () => import('../pcm-history/pcm-history.module').then(m => m.PcmHistoryModule) },
        ]
      },
  //   ]
  // },
  // { path: "CpQuestions/:id", component: CcmQuestionListComponent },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
