import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomPatientListingRoutingModule } from './custom-patient-listing-routing.module';
import { CustomListConfigurationComponent } from './custom-list-configuration/custom-list-configuration.component';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedDirectivesModule } from '../shared/shared-directives/shared-directives.module';
import { CustomPatientsListComponent } from './custom-patients-list/custom-patients-list.component';
import { PatientTaskModule } from '../patient-Task-modal/patient-task.module';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';
import { CustomListForPatientListsComponent } from './custom-list-for-patient-lists/custom-list-for-patient-lists.component';
// import { CustomListModalComponent } from './custom-list-modal/custom-list-modal.component';


@NgModule({
  declarations: [CustomListConfigurationComponent, CustomPatientsListComponent, CustomListForPatientListsComponent],
  imports: [
    CommonModule,
    CustomPatientListingRoutingModule,
    MdbSharedModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    PatientTaskModule,
    SharedDirectivesModule,
    SharedPipesModule,
    MalihuScrollbarModule.forRoot(),
  ],
  exports: [CustomListForPatientListsComponent]
})
export class CustomPatientListingModule { }
