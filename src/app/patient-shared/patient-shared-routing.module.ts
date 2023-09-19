import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiagnoseComponent } from '../admin/patient/diagnose/diagnose.component';
import { CarePlanViewComponent } from '../admin/patient/care-plan-view/care-plan-view.component';
import { MasterCarePlanComponent } from '../admin/patient/master-care-plan/master-care-plan.component';
import { MedicationComponent } from '../admin/patient/medication/medication.component';
import { ImunizationComponent } from './imunization/imunization.component';
import { AllergiesComponent } from './allergies/allergies.component';
import { ProvidersComponent } from '../admin/patient/providers/providers.component';
import { FamilyHistoryComponent } from '../pcm-history/family-history/family-history.component';
import { SurgicalHistoryComponent } from '../pcm-history/surgical-history/surgical-history.component';
import { PatientRpmModalitiesComponent } from './patient-rpm-modalities/patient-rpm-modalities.component';
import { CcmQualityCheckComponent } from './ccm-quality-check/ccm-quality-check.component';
import { RpmQualityCheckComponent } from './rpm-quality-check/rpm-quality-check.component';

const routes: Routes = [
  // { path: '', redirectTo: 'pDiagnoses', pathMatch: 'full' },
  { path: 'pDiagnoses', component: DiagnoseComponent },
  { path: 'pCarePlan', component: CarePlanViewComponent },
  { path: 'providers', component: ProvidersComponent },
  { path: 'pMasterCarePLan', component: MasterCarePlanComponent },
  { path: 'pMedications', component: MedicationComponent },
  { path: 'pImmunization', component: ImunizationComponent },
  { path: 'pAllergies', component: AllergiesComponent },
  { path: 'pfamily', component: FamilyHistoryComponent },
  { path: 'psurgical', component:  SurgicalHistoryComponent},
  { path: 'pModalities', component:  PatientRpmModalitiesComponent},
  { path: 'ccmQualityCheck', component:  CcmQualityCheckComponent},
  { path: 'rpmQualityCheck', component:  RpmQualityCheckComponent},
  // { path: 'pfamily', component: AllergiesComponent },
  // { path: 'psurgical', component: AllergiesComponent },
  // { path: 'pQuestionnaire', component: QuestionnaireComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientSharedRoutingModule { }
