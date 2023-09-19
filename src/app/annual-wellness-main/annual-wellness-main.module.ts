import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnnualWellnessMainRoutingModule } from './annual-wellness-main-routing.module';
import { AwPatientTabComponent } from './aw-patient-tab/aw-patient-tab.component';
import { AwLayoutComponent } from './aw-layout/aw-layout.component';
import { AwPhysicianTabComponent } from './aw-physician-tab/aw-physician-tab.component';
import { SharedModule } from '../shared/shared.module';
import { PcmAlcoholModule } from '../pcm-main/pcm-alcohol/pcm-alcohol.module';
import { PcmDepressionModule } from '../pcm-main/pcm-depression/pcm-depression.module';
import { PcmHistoryModule } from '../pcm-history/pcm-history.module';
import { AwEncountersListComponent } from './aw-encounters-list/aw-encounters-list.component';
import { AwSupplementComponent } from './aw-supplement/aw-supplement.component';
import { ModalsSharedModule } from '../modals-shared/modals-shared.module';
// import { ScrollSpyContentDirective } from './scroll-spy-content.directive';
// import { ScrollSpyMenuDirective } from './scroll-spy-menu.directive';
import { PublicSharedModule } from '../public-shared/public-shared.module';
import { SharedDirectivesModule } from '../shared/shared-directives/shared-directives.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { DocumentViewerModule } from '../document-viewer/document-viewer.module';
import { DownloadawDocConfComponent } from './downloadaw-doc-conf/downloadaw-doc-conf.component';
import { AnnualWellnessDashboardComponent } from './annual-wellness-dashboard/annual-wellness-dashboard.component';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';
import { PatientTaskModule } from '../patient-Task-modal/patient-task.module';

@NgModule({
  declarations: [AnnualWellnessDashboardComponent, AwPatientTabComponent, AwLayoutComponent, AwPhysicianTabComponent, AwEncountersListComponent, AwSupplementComponent, DownloadawDocConfComponent],
  imports: [
    CommonModule,
    AnnualWellnessMainRoutingModule,
    SharedDirectivesModule,
    SharedPipesModule,
    SharedModule,
    ModalsSharedModule,
    PcmAlcoholModule,
    PcmDepressionModule,
    PcmHistoryModule,
    PublicSharedModule,
    DocumentViewerModule,
    PatientTaskModule,
    ScrollToModule.forRoot()
  ]
})
export class AnnualWellnessMainModule { }
