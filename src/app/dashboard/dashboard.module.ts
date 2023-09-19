import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'angular-calendar';
import { HttpClientModule } from '@angular/common/http';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { SharedDirectivesModule } from '../shared/shared-directives/shared-directives.module';
import { DRGraphsComponent } from './dr-graphs/dr-graphs.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { RpmAnalyticsComponent } from './rpm-analytics/rpm-analytics.component';
import { CcmEndOfDayReportComponent } from './ccm-end-of-day-report/ccm-end-of-day-report.component';
import { RpmEndOfDayReportComponent } from './rpm-end-of-day-report/rpm-end-of-day-report.component';
import { ChartSimpleModule, ChartsModule } from 'ng-uikit-pro-standard';
import { CcmRpmEndOfDayReportComponent } from './ccm-rpm-end-of-day-report/ccm-rpm-end-of-day-report.component';


@NgModule({
  declarations: [AdminDashboardComponent, DRGraphsComponent, RpmAnalyticsComponent, CcmEndOfDayReportComponent, RpmEndOfDayReportComponent, CcmRpmEndOfDayReportComponent,],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    DpDatePickerModule,
    NgSelectModule,
    FormsModule,
    CalendarModule,
    HttpClientModule,
    Daterangepicker,
    MdbSharedModule,
    SharedDirectivesModule,
    ChartSimpleModule,
    ChartsModule
  ]
})
export class DashboardModule { }
