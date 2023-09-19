import { SharedDirectivesModule } from './../shared/shared-directives/shared-directives.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplaintDashboardCenterComponent } from './complaint-dashboard-center/complaint-dashboard-center.component';
import { ComplaintDashboardRoutingModule } from './complaint-dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DpDatePickerModule } from 'ng2-date-picker';
import { ComplaintDetailModalComponent } from './complaint-detail-modal/complaint-detail-modal.component';
import { PopoverModule } from 'ng-uikit-pro-standard';
import { CollapseModule, AccordionModule, WavesModule } from 'ng-uikit-pro-standard'
import { Daterangepicker } from 'ng2-daterangepicker';



@NgModule({
  declarations: [ComplaintDashboardCenterComponent, ComplaintDetailModalComponent],
  imports: [
    SharedDirectivesModule,
    CommonModule,
    ComplaintDashboardRoutingModule,
    SharedModule,
    NgxDatatableModule,
    DpDatePickerModule,
    PopoverModule,
    CollapseModule,
    AccordionModule,
    Daterangepicker,
  ]
})
export class ComplaintDashboardModule { }
