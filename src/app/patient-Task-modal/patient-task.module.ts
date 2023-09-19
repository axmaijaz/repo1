import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientTaskModalComponent } from './patient-task-modal.component';
import { MdbSharedModule } from 'src/app/mdb-shared/mdb-shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DpDatePickerModule } from 'ng2-date-picker';
import { AddTaskComponent } from './add-task/add-task.component';

@NgModule({
  declarations: [PatientTaskModalComponent, AddTaskComponent],
  imports: [
    CommonModule,
    MdbSharedModule,
    NgxDatatableModule,
    NgSelectModule,
    FormsModule,
    DpDatePickerModule,
    // SharedModule
  ],
  entryComponents: [PatientTaskModalComponent],
  exports: [AddTaskComponent]
})
export class PatientTaskModule {
  static entry = PatientTaskModalComponent;
}
