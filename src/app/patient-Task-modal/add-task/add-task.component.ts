import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { PatientTaskDto } from 'src/app/model/Patient/patient-Task.model';
import { SecurityService } from 'src/app/core/security/security.service';
import { PatientDto } from 'src/app/model/Patient/patient.model';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { PatientTackService } from 'src/app/core/Patient/patient-tack.service';
import { SubSink } from 'src/app/SubSink';
import * as moment from 'moment';
import { UserType } from 'src/app/Enums/UserType.enum';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit, OnDestroy {
  @ViewChild('addTask') addTask: ModalDirective;
  patientTaskData = new PatientTaskDto();
  CareProvidersList = new Array<CreateFacilityUserDto>();
  patientData = new PatientDto();
  private subs = new SubSink();
  otherType = '';
  facilityId: number;
  selectAssignTo = new CreateFacilityUserDto();
  addingTask: boolean;

  constructor(private securityService: SecurityService, private toaster: ToastService, private patientTaskService: PatientTackService) { }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    if (this.securityService.securityObject.userType === UserType.FacilityUser) {
      this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    } else {
      this.facilityId = 0;
    }
  }

  addEditPatientTask() {
    if (this.patientTaskData.patientTaskType === 'Other') {
      this.patientTaskData.patientTaskType = this.otherType;
    }
    this.patientTaskData.enteredByName = this.securityService.securityObject.fullName;
    this.patientTaskData.facilityId = this.facilityId;
    this.patientTaskData.patientId = this.patientData.id;
    this.patientTaskData.assignedToId = this.selectAssignTo.id;
    this.patientTaskData.assignedToName = this.selectAssignTo.firstName + ' ' + this.selectAssignTo.lastName;
    this.addingTask = true;
    this.subs.sink = this.patientTaskService
    .addEditPatientTask(this.patientTaskData)
    .subscribe(
      (res: any) => {
        this.patientTaskData = new PatientTaskDto();
        this.addTask.hide();
        this.toaster.success('Added Successfully');
        this.addingTask = false;
        // this.LoadingData = false;
      },
      (err: any) => {
        this.addingTask = false;
          // this.isLoadingZip = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  showDetailOnPatientTask(row: any) {
    if (row.dateOfBirth) {
      row.dateOfBirth = moment(row.dateOfBirth).format('DD-MMM-YYYY');
    }
    if (row.primaryPhoneNumber) {
      row.primaryPhoneNumber = row.primaryPhoneNumber.replace(
        /^(\d{0,3})(\d{0,3})(\d{0,4})/,
        '($1)$2-$3'
      );
    }
    this.patientData = row;
    this.otherType = '';
    this.patientData.enteredByName = this.securityService.securityObject.fullName;
    this.selectAssignTo = new CreateFacilityUserDto();
  }
  resetotherfield() {
    if (this.patientTaskData.patientTaskType !== 'Other') {
      this.otherType = '';
    }
  }
  OpenTaskViewModal(pData: PatientDto) {
    this.showDetailOnPatientTask(pData);
    this.addTask.show();
  }
}
