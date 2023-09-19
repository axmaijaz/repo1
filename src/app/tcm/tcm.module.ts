import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TcmRoutingModule } from './tcm-routing.module';
import { DischargeOverviewComponent } from './discharge-overview/discharge-overview.component';
import { DischargeInformationComponent } from './discharge-information/discharge-information.component';
import { FaceToFaceComponent } from './face-to-face/face-to-face.component';
import { NonFaceToFaceComponent } from './non-face-to-face/non-face-to-face.component';
import { SharedModule } from '../shared/shared.module';
import { TcmListComponent } from './tcm-list/tcm-list.component';
import { PatientSharedModule } from '../patient-shared/patient-shared.module';
import { ModalsSharedModule } from '../modals-shared/modals-shared.module';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { DataTablesModule } from 'angular-datatables';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { TcmEncountersListComponent } from './tcm-encounters-list/tcm-encounters-list.component';
import { CustomPatientListingModule } from '../custom-patient-listing/custom-patient-listing.module';
// import { NgxMaskModule, IConfig } from 'ngx-mask';
// export let options: Partial<IConfig> | (() => Partial<IConfig>) = {};
@NgModule({
  declarations: [DischargeOverviewComponent, DischargeInformationComponent, FaceToFaceComponent, NonFaceToFaceComponent,TcmListComponent, TcmEncountersListComponent],
  imports: [
    // NgxMaskModule.forRoot(options),
    CommonModule,
    TcmRoutingModule,
    SharedModule,
    PatientSharedModule,
    ModalsSharedModule,
    MalihuScrollbarModule.forRoot(),
    DataTablesModule,
    CustomPatientListingModule,
    NgxPageScrollCoreModule.forRoot({duration: 500}),
  ]
})
export class TcmModule { }
