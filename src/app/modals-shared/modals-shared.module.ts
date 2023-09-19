import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { VerifyAsBillingProviderComponent } from './verify-as-billing-provider/verify-as-billing-provider.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ComplaintsModalComponent } from './complaints-modal/complaints-modal.component';
import { DocumentViewerModule } from '../document-viewer/document-viewer.module';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { PopoverModule } from 'ng-uikit-pro-standard';
import { SharedDirectivesModule } from '../shared/shared-directives/shared-directives.module';
import { SpeechTextComponent } from './speech-text/speech-text.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FacilityDeviceRequestComponent } from './facility-device-request/facility-device-request.component';

@NgModule({
  declarations: [VerifyAsBillingProviderComponent, ComplaintsModalComponent, SpeechTextComponent, FacilityDeviceRequestComponent],
  imports: [
    DocumentViewerModule,
    CommonModule,
    NgSelectModule,
    FormsModule,
    MdbSharedModule,
    MalihuScrollbarModule.forRoot(),
    PopoverModule,
    EditorModule,
    SharedDirectivesModule,

  ],
  exports: [
    VerifyAsBillingProviderComponent,
    ComplaintsModalComponent,
    SpeechTextComponent,
    FacilityDeviceRequestComponent
  ]
})
export class ModalsSharedModule { }
