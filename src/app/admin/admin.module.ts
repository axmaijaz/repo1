import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { PatientSharedModule } from '../patient-shared/patient-shared.module';
// import { MasterCarePlanComponent } from './patient/master-care-plan/master-care-plan.component';
// import { PatientSharedModule } from '../patient-shared/patient-shared.module';
import { AlertManagerComponent } from '../rpm/alert-manager/alert-manager.component';
import { SharedModule } from '../shared/shared.module';
// import { AdminDashboardComponent } from '../dashboard/admin-dashboard/admin-dashboard.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
// import { CcmPatientListComponent } from './ccm-patient-list/ccm-patient-list.component';
// import { FacilityComponent } from './facility/facility.component';
// import { BlueButtonComponent } from './blue-button/blue-button.component';
import { CcmQuestionListComponent } from './ccm-question-list/ccm-question-list.component';
import { COllapseButtonComponent } from './collapse-button/collapse-button.component';
import { DailyReportingComponent } from './daily-reporting/daily-reporting.component';
// import { ClinicalSummaryComponent } from './clinical-summary/clinical-summary.component';
// import { EmergencyPlanComponent } from './emergency-plan/emergency-plan.component';
// import { ConsentDocComponent } from './consent-doc/consent-doc.component';
import { FacilityUserSettingComponent } from './facility-user-setting/facility-user-setting.component';
import { LogsHistoryComponent } from './logs-history/logs-history.component';
import { PatientConsentComponent } from './patient-consent/patient-consent.component';
import { PatientSummaryComponent } from './patient-summary/patient-summary.component';
import { CarePlanComponent } from './patient/care-plan/care-plan.component';
import { CcmComponent } from './patient/ccm/ccm.component';
import { EditCarePlanComponent } from './patient/edit-care-plan/edit-care-plan.component';
import { EncounterComponent } from './patient/encounter/encounter.component';
// import { PatientsListComponent } from './patients-list/patients-list.component';
import { PatientComponent } from './patient/patient.component';
// import { AddDiagnoseComponent } from './patient/add-diagnose/add-diagnose.component';
// import { AddProviderComponent } from './providers/add-provider/add-provider.component';
// import { FacilitUsersComponent } from './facility-users/facility-users.component';
// import { ProvidersComponent } from './patient/providers/providers.component';
// import { DiagnoseComponent } from './patient/diagnose/diagnose.component';
// import { MedicationComponent } from './patient/medication/medication.component';
// import { DiseasesComponent } from './diseases/diseases.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { ReOrderQuestionsComponent } from './re-order-questions/re-order-questions.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { BhiLogHistoryComponent } from './bhi-log-history/bhi-log-history.component';
import { UtilityModule } from '../utility/utility.module';
import { InvoiceReconciliationComponent } from './invoice-reconciliation/invoice-reconciliation.component';
// import { PatientDetailsComponent } from './patient/patient-details/patient-details.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { Daterangepicker } from 'ng2-daterangepicker';



@NgModule({
  declarations: [
  // AdminDashboardComponent,
  // PatientsListComponent,
  PatientComponent,
  AlertManagerComponent,
  EncounterComponent,
  // DiagnoseComponent,
  // MedicationComponent,
  // DiseasesComponent,
  QuestionnaireComponent,
  CcmComponent,
  CarePlanComponent,
  EditCarePlanComponent,
  // AddDiagnoseComponent,
  // FacilitUsersComponent,
  // ProvidersComponent,
  // AddProviderComponent,
  UserManagerComponent,
  // CcmPatientListComponent,
  // FacilityComponent,
  // BlueButtonComponent,
  PatientConsentComponent,
  CcmQuestionListComponent,
  PatientSummaryComponent,
  AdminSettingsComponent,
  LogsHistoryComponent,
  COllapseButtonComponent,
  ReOrderQuestionsComponent,
  // ClinicalSummaryComponent,
  // EmergencyPlanComponent,
  // ConsentDocComponent,
  // OrganizationsComponent,
  FacilityUserSettingComponent,
  DailyReportingComponent,
  BhiLogHistoryComponent,
  InvoiceReconciliationComponent,
  // MasterCarePlanComponent
],
  imports: [
    SharedModule,
    AdminRoutingModule,
    PatientSharedModule,
    UtilityModule,
    NgSelectModule,
    Daterangepicker,
    // PatientSharedModule
  ],
  schemas:      [ NO_ERRORS_SCHEMA ]
})
export class AdminModule { }
