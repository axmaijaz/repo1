import { SharedDirectivesModule } from 'src/app/shared/shared-directives/shared-directives.module';
import { FormsModule } from '@angular/forms';
import { MdbSharedModule } from 'src/app/mdb-shared/mdb-shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrDashboardComponent } from './pr-dashboard/pr-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DpDatePickerModule } from 'ng2-date-picker';
import { Daterangepicker } from 'ng2-daterangepicker';
import { ChartSimpleModule, ChartsModule } from 'ng-uikit-pro-standard';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';
import { PatientSharedModule } from '../patient-shared/patient-shared.module';

const routes: Routes = [
  { path: 'prDashboard', component: PrDashboardComponent },
];

@NgModule({
  declarations: [PrDashboardComponent],
  imports: [
    MdbSharedModule,
    NgSelectModule,
    DpDatePickerModule,
    Daterangepicker,
    FormsModule,
    SharedDirectivesModule,
    SharedPipesModule,
    RouterModule.forChild(routes),
    CommonModule,
    ChartsModule, ChartSimpleModule,
    PatientSharedModule
  ]
})
export class ProductivityReportingModule { }
