import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientSharedRoutingModule } from './patient-shared-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DiagnoseComponent } from '../admin/patient/diagnose/diagnose.component';
import { MasterCarePlanComponent } from '../admin/patient/master-care-plan/master-care-plan.component';
import { MedicationComponent } from '../admin/patient/medication/medication.component';
import { ImunizationComponent } from './imunization/imunization.component';
import { AllergiesComponent } from './allergies/allergies.component';
import { CarePlanViewComponent } from '../admin/patient/care-plan-view/care-plan-view.component';
import { ProvidersComponent } from '../admin/patient/providers/providers.component';
import { StickyNotesComponent } from '../patient/sticky-notes/sticky-notes/sticky-notes.component';
import { PatientRpmModalitiesComponent } from './patient-rpm-modalities/patient-rpm-modalities.component';
import { DexcomModule } from '../dexcom/dexcom.module';
import { CcmQualityCheckComponent } from './ccm-quality-check/ccm-quality-check.component';
import { RpmQualityCheckComponent } from './rpm-quality-check/rpm-quality-check.component';
import { CcmQuickEncounterComponent } from './ccm-quick-encounter/ccm-quick-encounter.component';
import { RpmQuickEncounterComponent } from './rpm-quick-encounter/rpm-quick-encounter.component';
import { UtilityModule } from '../utility/utility.module';
import { PatientStatusChangeComponent } from './patient-status-change/patient-status-change.component';
import { PatientRpmAlertsComponent } from './patient-rpm-alerts/patient-rpm-alerts.component';
import { TableModule } from 'ng-uikit-pro-standard';
import { PatientNotificationSettingComponent } from './patient-notification-setting/patient-notification-setting.component';
import { PatientSmsvoiceConsentComponent } from './patient-smsvoice-consent/patient-smsvoice-consent.component';
import { PatientSettingLayoutComponent } from './patient-setting/patient-setting-layout.component';
// import { CarePlanComponent } from '../admin/patient/care-plan/care-plan.component';
// import { EditCarePlanComponent } from '../admin/patient/edit-care-plan/edit-care-plan.component';
// import { QuestionnaireComponent } from '../admin/questionnaire/questionnaire.component';
// import { ReOrderQuestionsComponent } from '../admin/re-order-questions/re-order-questions.component';

@NgModule({
  declarations: [
    DiagnoseComponent,
    // EditCarePlanComponent,
    // CarePlanComponent,
    ProvidersComponent,
    MasterCarePlanComponent,
    CarePlanViewComponent,
    MedicationComponent,
    ImunizationComponent,
    AllergiesComponent,
    StickyNotesComponent,
    PatientRpmModalitiesComponent,
    CcmQualityCheckComponent,
    RpmQualityCheckComponent,
    CcmQuickEncounterComponent,
    RpmQuickEncounterComponent,
    PatientStatusChangeComponent,
    PatientRpmAlertsComponent,
    PatientNotificationSettingComponent,
    PatientSmsvoiceConsentComponent,
    PatientSettingLayoutComponent
    // ReOrderQuestionsComponent
  ],
  imports: [CommonModule, PatientSharedRoutingModule,UtilityModule,
    TableModule, SharedModule, DexcomModule],
  exports: [
    ProvidersComponent,
    DiagnoseComponent,
    // CarePlanViewComponent,
    MasterCarePlanComponent,
    MedicationComponent,
    ImunizationComponent,
    AllergiesComponent,
    StickyNotesComponent,
    PatientRpmModalitiesComponent,
    CcmQualityCheckComponent,
    RpmQualityCheckComponent,
    CcmQuickEncounterComponent,
    RpmQuickEncounterComponent,
    PatientStatusChangeComponent,
    PatientRpmAlertsComponent,
    PatientNotificationSettingComponent,
    PatientSmsvoiceConsentComponent,
    PatientSettingLayoutComponent
    // CarePlanComponent,
    // EditCarePlanComponent,
    // QuestionnaireComponent,
    // ReOrderQuestionsComponent
  ]
})
export class PatientSharedModule {}
