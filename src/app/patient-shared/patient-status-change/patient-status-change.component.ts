import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CcmStatusChangeDto } from 'src/app/model/Patient/patient.model';
import { SecurityService } from 'src/app/core/security/security.service';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { CcmMonthlyStatus, CcmStatus, RpmMonthlyStatus, RpmStatus } from 'src/app/Enums/filterPatient.enum';
import { ChangeMonthlyCcmStatus } from 'src/app/model/admin/ccm.model';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { RpmMonthlyStatusChangeDto } from 'src/app/model/rpm.model';
import { RpmService } from 'src/app/core/rpm.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { BhiStatusDto } from 'src/app/model/Bhi/bhi.model';
import { BhiStatusEnum } from 'src/app/Enums/bhi.enum';
import { PcmStatusDto } from 'src/app/model/pcm/pcm.model';
import { PcmService } from 'src/app/core/pcm/pcm.service';
import { PcmStatus } from 'src/app/Enums/pcm.enum';

@Component({
  selector: 'app-patient-status-change',
  templateUrl: './patient-status-change.component.html',
  styleUrls: ['./patient-status-change.component.scss']
})
export class PatientStatusChangeComponent implements OnInit {
  @Output() statusValueChanged = new EventEmitter<number>();
  patientId: number;
  statusValue: number;
  selectedType = "";
  @ViewChild("ChangeStatusModal") ChangeStatusModal: ModalDirective;
  ccmStatusChangeDto = new CcmStatusChangeDto();
  rpmStatusChangeDto = new CcmStatusChangeDto();
  rpmMonthlyStatusChangeDto = new RpmMonthlyStatusChangeDto();
  ccmMonthlyStatusChangeDto = new ChangeMonthlyCcmStatus();
  pcmStatusChangeDto = new PcmStatusDto();
  isChangingCCMStatus: boolean;

  ccmStatusEnumList = new Array<any>();
  rpmStatusEnumList = new Array<any>();
  prcmStatusEnumList = new Array<any>();
  bhiStatusEnumList = new Array<any>();
  tcmStatusEnumList = new Array<any>();
  pcmStatusEnumList = new Array<any>();
  bhiStatusChangeDto = new BhiStatusDto();
  ccmMonthlyStatusEnumList: { number: string; word: string; }[] = [];
  rpmMonthlyStatusList = this.filterDataService.getEnumAsList(RpmMonthlyStatus);

  constructor(private securityService: SecurityService,
    private filterDataService: DataFilterService,
    private rpmService: RpmService,
    private patientsService: PatientsService, private toaster: ToastService, private pcmService: PcmService,) { }

  ngOnInit(): void {
    this.getCcmStatusArray();
    this.getBhiStatusArray();
    this.getRpmStatusArray();
    this.getCcmMonthlyStatusArray();
    this.getPcmStatusArray();
  }
  OpenModel(patientId: number, selectedType: string, statusValue: number) {
    this.patientId = patientId;
    this.selectedType = selectedType;
    this.statusValue = statusValue;
    this.ChangeStatusModal.show();
  }
  clearStatusChangeDtoValues(){
    this.ccmStatusChangeDto = new CcmStatusChangeDto();
    this.rpmStatusChangeDto = new CcmStatusChangeDto();
  }
  AssignCcmStatus() {
    this.isChangingCCMStatus = true;
    this.ccmStatusChangeDto.appUserId =
      this.securityService.securityObject.appUserId;
    this.ccmStatusChangeDto.patientId = this.patientId;
    // this.ccmStatusChangeDto.newStatusValue = this.tempCcmStatusVal;
    this.patientsService
      .changePatientCcmStatus(this.ccmStatusChangeDto)
      .subscribe(
        (res) => {
          // this.patientId.ccmStatus = this.tempCcmStatusVal;
          this.toaster.success("Ccm Status Changed Successfully");
          // this.addNote();
          this.isChangingCCMStatus = false;
          this.statusValueChanged.emit(this.ccmStatusChangeDto.newStatusValue)
          this.ChangeStatusModal.hide();
        },
        (error) => {
          this.toaster.error(error.message, error.error || error.error);
          this.isChangingCCMStatus = false;
        }
      );
  }
  AssignCcmMonthlyStatus(id: number) {
    this.ccmMonthlyStatusChangeDto.ccmMonthlyStatus = id;
    this.ccmMonthlyStatusChangeDto.PatientId = this.patientId;
    this.patientsService
      .editPatientCcmMonthlyStatus(this.ccmMonthlyStatusChangeDto)
      .subscribe(
        (res) => {
          this.toaster.success("Ccm Monthly Status Changed Successfully");
          this.ChangeStatusModal.hide();
          this.statusValueChanged.emit(this.ccmMonthlyStatusChangeDto.ccmMonthlyStatus)
        },
        (error) => {
          this.toaster.error(error.message, error.error || error.error);
          // this.addUserModal.hide();
        }
      );
  }
  AssignRPMStatus() {
    this.rpmStatusChangeDto.appUserId =
      this.securityService.securityObject.appUserId;
    this.rpmStatusChangeDto.patientId = this.patientId;
    this.patientsService
      .changePatientRpmStatus(this.rpmStatusChangeDto)
      .subscribe(
        (res) => {
          this.toaster.success("Rpm Status Changed Successfully");
          this.statusValueChanged.emit(this.rpmStatusChangeDto.newStatusValue)
          this.ChangeStatusModal.hide();
        },
        (error) => {
          this.toaster.error(error.message, error.error || error.error);
          // this.addUserModal.hide();
        }
      );
  }
  assignRpmMonthlyStatus() {
    this.rpmMonthlyStatusChangeDto.patientId = this.patientId;
    this.rpmService
      .EditPatientRPMMonthlyStatus(this.rpmMonthlyStatusChangeDto)
      .subscribe(
        (res: any) => {
          // this.selectedPatient.rpmMonthlyStatus =
          //   this.rpmMonthlyStatusChangeDto.rpmMonthlyStatus;
          this.toaster.success("Rpm Monthly Status Changed Successfully");
          this.statusValueChanged.emit(this.rpmMonthlyStatusChangeDto.rpmMonthlyStatus)
          this.ChangeStatusModal.hide();
        },
        (error: HttpResError) => {
          this.toaster.error(error.message, error.error || error.error);
        }
      );
  }
  getCcmStatusArray() {
    const keys = Object.keys(CcmStatus).filter(
      (k) => typeof CcmStatus[k as any] === "number"
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      number: CcmStatus[key as any],
      word: key,
    })); // [0, 1]
    this.ccmStatusEnumList = values;
    return values;
  }
  getRpmStatusArray() {
    const keys = Object.keys(RpmStatus).filter(
      (k) => typeof RpmStatus[k as any] === "number"
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      number: RpmStatus[key as any],
      word: key,
    })); // [0, 1]
    this.rpmStatusEnumList = values;
    return values;
  }
  getCcmMonthlyStatusArray() {
    const keys = Object.keys(CcmMonthlyStatus).filter(
      (k) => typeof CcmMonthlyStatus[k as any] === "number"
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      number: CcmMonthlyStatus[key as any],
      word: key,
    })); // [0, 1]
    this.ccmMonthlyStatusEnumList = values;
    return values;
  }
  getBhiStatusArray() {
    const keys = Object.keys(BhiStatusEnum).filter(
      (k) => typeof BhiStatusEnum[k as any] === "number"
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      number: BhiStatusEnum[key as any],
      word: key,
    })); // [0, 1]
    this.bhiStatusEnumList = values;
    return values;
  }
  getPcmStatusArray() {
    const keys = Object.keys(PcmStatus).filter(
      (k) => typeof PcmStatus[k as any] === "number"
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      number: PcmStatus[key as any],
      word: key,
    })); // [0, 1]
    this.pcmStatusEnumList = values;
    return values;
  }
  AssignBHIStatus() {
    this.bhiStatusChangeDto.patientId = this.patientId;
      this.patientsService
      .UpdateBhiStatus(this.bhiStatusChangeDto)
      .subscribe(
        (res) => {
          this.toaster.success("Bhi Status Changed Successfully");
          this.statusValueChanged.emit(this.bhiStatusChangeDto.bhiStatus)
          this.ChangeStatusModal.hide();
        },
        (error) => {
          this.toaster.error(error.message, error.error || error.error);
        }
      );
  }
  AssignPCMStatus() {
    this.pcmStatusChangeDto.patientId = this.patientId;
   this.pcmService
      .UpdatePcmStatus(this.pcmStatusChangeDto)
      .subscribe(
        (res) => {
          this.toaster.success("Pcm Status Changed Successfully");
          this.statusValueChanged.emit(this.pcmStatusChangeDto.pcmStatus)
          this.ChangeStatusModal.hide();
        },
        (error) => {
          this.toaster.error(error.message, error.error || error.error);
          // this.addUserModal.hide();
        }
      );
  }
}
