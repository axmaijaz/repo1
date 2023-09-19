import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriorAuthRoutingModule } from './prior-auth-routing.module';
import { AddPriorAuthComponent } from './add-prior-auth/add-prior-auth.component';
import { PriorAuthListComponent } from './prior-auth-list/prior-auth-list.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { NgSelectModule } from '@ng-select/ng-select';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedDirectivesModule } from '../shared/shared-directives/shared-directives.module';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';
import { FormsModule } from '@angular/forms';
import { ManageCasesComponent } from './manage-cases/manage-cases.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { DocumentViewerModule } from '../document-viewer/document-viewer.module';
@NgModule({
  declarations: [AddPriorAuthComponent, PriorAuthListComponent, ManageCasesComponent],
  imports: [
    CommonModule,
    PriorAuthRoutingModule,
    DpDatePickerModule,
    NgSelectModule,
    MdbSharedModule,
    NgxDatatableModule,
    Daterangepicker,
    DocumentViewerModule,
    SharedDirectivesModule,
    SharedPipesModule,
    FormsModule,
       MalihuScrollbarModule.forRoot(),
  ]
})
export class PriorAuthModule { }
