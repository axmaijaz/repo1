import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientInsightsRoutingModule } from './patient-insights-routing.module';
import { InsightsLayoutComponent } from './insights-layout/insights-layout.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditorModule } from '@tinymce/tinymce-angular';
import { DpDatePickerModule } from 'ng2-date-picker';
import { PatientDetailModule } from '../admin/patient/patient-details/patient-detail/patient-detail.module';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { PatientSharedModule } from '../patient-shared/patient-shared.module';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';
import { SharedDirectivesModule } from '../shared/shared-directives/shared-directives.module';
import { RpmInsightsComponent } from './rpm-insights/rpm-insights.component';
import { InsightsSummaryComponent } from './insights-summary/insights-summary.component';
import { InsightsSettingComponent } from './insights-setting/insights-setting.component';
import { InsightsEmrLayoutComponent } from './insights-emr-layout/insights-emr-layout.component';
import { EMRConnectModule } from '../emr-connect/emr-connect.module';
import { UtilityModule } from '../utility/utility.module';
import { SyncPatientWithEmrComponent } from './sync-patient-with-emr/sync-patient-with-emr.component';
import { SharedModule } from '../shared/shared.module';
import { AdminModule } from '../admin/admin.module';


@NgModule({
  declarations: [InsightsEmrLayoutComponent , InsightsLayoutComponent, RpmInsightsComponent, InsightsSummaryComponent, InsightsSettingComponent, SyncPatientWithEmrComponent],
  imports: [
    CommonModule,
    MdbSharedModule,
    PatientSharedModule,
    PatientDetailModule,
    SharedDirectivesModule,
    SharedPipesModule,
    FormsModule,
    DpDatePickerModule,
    NgSelectModule,
    EditorModule,
    UtilityModule,
    PatientInsightsRoutingModule,
    EMRConnectModule,
    SharedModule,
    AdminModule
    
  ]
})
export class PatientInsightsModule { }
