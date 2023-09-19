import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { TwocRingCentralRoutingModule } from './twoc-ring-central-routing.module';
import { RcCallsMsgComponent } from './rc-calls-msg/rc-calls-msg.component';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CollapseModule, AccordionModule } from 'ng-uikit-pro-standard'
import { DataTablesModule } from 'angular-datatables';
import { ModalModule, InputsModule, ButtonsModule } from 'ng-uikit-pro-standard';
import { DpDatePickerModule } from 'ng2-date-picker';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';
import { SharedDirectivesModule } from '../shared/shared-directives/shared-directives.module';

@NgModule({
  declarations: [RcCallsMsgComponent],
  imports: [
    CommonModule,
    MdbSharedModule,
    NgxDatatableModule,
    TwocRingCentralRoutingModule,
    DpDatePickerModule,
    FormsModule,
    NgSelectModule,
    CollapseModule,
    AccordionModule,
    DataTablesModule,
    SharedPipesModule,
    SharedDirectivesModule,
    ModalModule,
    InputsModule,
    ButtonsModule
  ]
})
export class TwocRingCentralModule { }
