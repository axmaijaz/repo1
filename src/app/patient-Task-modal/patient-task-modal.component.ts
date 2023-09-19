import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import { ModalDirective } from 'ng-uikit-pro-standard';
import { PatientDto } from 'src/app/model/Patient/patient.model';
import { PatientTackService } from 'src/app/core/Patient/patient-tack.service';
import { SubSink } from 'src/app/SubSink';
import { PatientTaskDto } from 'src/app/model/Patient/patient-Task.model';

@Component({
  selector: 'app-patient-task',
  templateUrl: './patient-task-modal.component.html',
  styleUrls: ['./patient-task-modal.component.scss']
})
export class PatientTaskModalComponent implements OnInit {
  private subs = new SubSink();
  patientTaskData = new PatientTaskDto();
  @ViewChild("patientTaskViewModal") patientTaskViewModal: ModalDirective;
  constructor(private appUi: AppUiService,
    private patientTaskService: PatientTackService,) {
    appUi.showPatientTaskSubject.subscribe((res: boolean) => {
      // this.modalObj = res;
      this.patientTaskViewModal.show();
    });
  }

  ngOnInit() {}
  
}
