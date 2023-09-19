import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientCommunicationRoutingModule } from './patient-communication-routing.module';
import { CommunicationsListComponent } from './communications-list/communications-list.component';
import { CommunicationDetailComponent } from './communication-detail/communication-detail.component';
import { CommunicationLayoutComponent } from './communication-layout/communication-layout.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { PublicSharedModule } from '../public-shared/public-shared.module';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';
import { NgxSkltnModule } from 'ngx-skltn';
import { SharedDirectivesModule } from '../shared/shared-directives/shared-directives.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UtilityModule } from '../utility/utility.module';
import { NewBulkCommunicationComponent } from './new-bulk-communication/new-bulk-communication.component';
import { DndModule } from 'ngx-drag-drop';
import { CommunicationTemplatesComponent } from './communication-templates/communication-templates.component';
import { PopoverModule } from 'ng-uikit-pro-standard'

@NgModule({
  declarations: [CommunicationsListComponent, CommunicationDetailComponent, CommunicationLayoutComponent, NewBulkCommunicationComponent, CommunicationTemplatesComponent],
  imports: [
    CommonModule,
    FormsModule,
    PublicSharedModule,
    MdbSharedModule,
    NgxDatatableModule,
    NgSelectModule,
    SharedPipesModule,
    CommonModule,
    NgxSkltnModule,
    ScrollingModule,
    UtilityModule,
    DndModule,
    PatientCommunicationRoutingModule,
    PopoverModule,
    SharedDirectivesModule
  ],
  exports: [CommunicationsListComponent, CommunicationDetailComponent, CommunicationLayoutComponent]
})
export class PatientCommunicationModule { }
