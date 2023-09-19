import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedDirectivesModule } from '../shared/shared-directives/shared-directives.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';
import { DatepickerModule } from 'ng-uikit-pro-standard';
import { SharedModule } from '../shared/shared.module';
import { DpDatePickerModule } from 'ng2-date-picker';
import { HealthScoreRoutingModule } from './health-score-routing.module';
import { HealthScoreListComponent } from './health-score-list/health-score-list.component';
import { HealthScoreFormComponent } from './health-score-form/health-score-form.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [HealthScoreListComponent, HealthScoreFormComponent],
  imports: [
    CommonModule,
    HealthScoreRoutingModule,
    NgSelectModule,
    SharedDirectivesModule,
    FormsModule,
    MdbSharedModule,
    NgxDatatableModule,
    SharedPipesModule,
    DatepickerModule,
    SharedModule,
    DpDatePickerModule,
    RouterModule
  ]
})
export class HealthScoreModule { }
