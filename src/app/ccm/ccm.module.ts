import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CcmRoutingModule } from './ccm-routing.module';
import { CcmApprovalComponent } from './ccm-approval/ccm-approval.component';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [CcmApprovalComponent],
  imports: [
    CommonModule,
    CcmRoutingModule,
    MdbSharedModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule
    // SharedModule
  ]
})
export class CcmModule { }
