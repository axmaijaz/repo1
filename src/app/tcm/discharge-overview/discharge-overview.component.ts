import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TcmStoreService } from 'src/app/core/tcm/tcm-store.service';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { TcmDataService } from 'src/app/tcm-data.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { TcmEncounterDto, PatientDischargeDto, NonFaceToFaceDto, FaceToFaceDto, TcmDocumentDto } from 'src/app/model/Tcm/tcm.model';
import { DischargedToEnum, TcmRequirementsStatusEnum } from 'src/app/model/Tcm/tcm.enum';
import { ToastService } from 'ng-uikit-pro-standard';
import moment from 'moment';
import { Location } from '@angular/common';
import { SecurityService } from 'src/app/core/security/security.service';
@Component({
  selector: 'app-discharge-overview',
  templateUrl: './discharge-overview.component.html',
  styleUrls: ['./discharge-overview.component.scss']
})
export class DischargeOverviewComponent implements OnInit, OnDestroy {
  PatientId: number;
  TcmId: number;
  tcmRequirementsStatusEnum = TcmRequirementsStatusEnum;
  dischargeToEnum = DischargedToEnum;
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    disableKeypress: true,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD hh:mm A',
    closeOnSelect: true
  };
  gettingCopyData: boolean;

  constructor( private tcmSevice: TcmDataService, private route: ActivatedRoute,
    private securityService: SecurityService, public tcmStore: TcmStoreService, private location: Location, private toaster: ToastService) { }

  ngOnInit() {
    this.PatientId = +this.route.snapshot.paramMap.get('id');
    this.TcmId = +this.route.snapshot.paramMap.get('tcmId');
    this.tcmStore.patientId = this.PatientId;
    this.tcmStore.tcmId = this.TcmId;
    this.GetTcmById();
    this.datecheck();
  }
  ngOnDestroy(): void {
    this.tcmStore.clearData();
  }
  GetTcmById() {
    this.tcmStore.gettingTcmData = true;
    this.tcmSevice.GetTcmEncounterById(this.TcmId).subscribe((res: TcmEncounterDto) => {
      this.tcmStore.gettingTcmData = false;
      if (!res.patientDischarge) {
        res.patientDischarge = new PatientDischargeDto();
      }
      if (!res.nonFaceToFace) {
        res.nonFaceToFace = new NonFaceToFaceDto();
      }
      if (!res.faceToFace) {
        res.faceToFace = new FaceToFaceDto();
      }
      if (!res.tcmDocuments) {
        res.tcmDocuments = new Array<TcmDocumentDto>();
      }
      this.tcmStore.tcmData = res;
      if (this.tcmStore.tcmData.faceToFace.serviceDate) {
        this.tcmStore.tcmData.faceToFace.serviceDate = moment(this.tcmStore.tcmData.faceToFace.serviceDate).format("YYYY-MM-DD hh:mm A");
      }
      if (this.tcmStore.tcmData.faceToFace.dateVisited) {
        this.tcmStore.tcmData.faceToFace.dateVisited = moment(this.tcmStore.tcmData.faceToFace.dateVisited).format("YYYY-MM-DD hh:mm A");
      }
      if (this.tcmStore.tcmData.patientDischarge.dischargeDate) {
        this.tcmStore.tcmData.patientDischarge.dischargeDate = moment(this.tcmStore.tcmData.patientDischarge.dischargeDate).format("YYYY-MM-DD hh:mm A");
        this.tcmStore.viewDischargeDate = moment(this.tcmStore.tcmData.patientDischarge.dischargeDate, "YYYY-MM-DD hh:mm A" ).format("MMM DD YYYY");
      } else {
        this.tcmStore.viewDischargeDate = this.tcmStore.tcmData.patientDischarge.dischargeDate;
      }
      if (this.tcmStore.tcmData.patientDischarge.followUpAppointment) {
        this.tcmStore.tcmData.patientDischarge.followUpAppointment = moment(this.tcmStore.tcmData.patientDischarge.followUpAppointment).format("YYYY-MM-DD hh:mm A");
      }
      if (this.tcmStore.tcmData.tcmInitialComms) {
        this.tcmStore.checkIsSuccessfull = this.tcmStore.tcmData.tcmInitialComms.find(e => e.isSuccessfull == true);
       }
       if (!this.tcmStore.tcmData.faceToFace.cptCode) {
         this.datecheck();
       }
       if (!this.tcmStore.tcmData.faceToFace.serviceDate || this.tcmStore.tcmData.faceToFace.serviceDate == '0001-01-01T00:00:00') {
        let todayDate = new Date().toLocaleDateString();
        this.tcmStore.tcmData.faceToFace.serviceDate = moment(todayDate).format('YYYY-MM-DD hh:mm A');
      }
       this.assignFacilityUser();
       this.resetVitalsValues();

      this.tcmStore.tcmDataLoaded.next(true);
    }, (error: HttpResError) => {
      this.tcmStore.gettingTcmData = false;
    });
  }
  resetVitalsValues() {
    if (this.tcmStore.tcmData.faceToFace.sbp == 0) {
      this.tcmStore.tcmData.faceToFace.sbp = null;
    }
    if (this.tcmStore.tcmData.faceToFace.dbp == 0) {
      this.tcmStore.tcmData.faceToFace.dbp = null;
    }
    if (this.tcmStore.tcmData.faceToFace.pulsePerMinute == 0) {
      this.tcmStore.tcmData.faceToFace.pulsePerMinute = null;
    }
    if (this.tcmStore.tcmData.faceToFace.temp == 0) {
      this.tcmStore.tcmData.faceToFace.temp = null;
    }
    if (this.tcmStore.tcmData.faceToFace.respRate == 0) {
      this.tcmStore.tcmData.faceToFace.respRate = null;
    }
    if (this.tcmStore.tcmData.faceToFace.oxygenation == 0) {
      this.tcmStore.tcmData.faceToFace.oxygenation = null;
    }
  }
  assignFacilityUser() {
    if (this.securityService.securityObject.userType == 5) {
      if (!this.tcmStore.tcmData.faceToFace.facilityUserId) {
        this.tcmStore.tcmData.faceToFace.facilityUserId = this.securityService.securityObject.id;
      }
    }
  }
  datecheck() {
    let todayDate = new Date().toLocaleDateString();
    // this.firstDate = moment('2019/03/31');
    if (this.tcmStore.tcmData.patientDischarge.dischargeDate && !this.tcmStore.tcmData.faceToFace.cptCode) {
      let dischargeDate = moment(this.tcmStore.tcmData.patientDischarge.dischargeDate, "YYYY-MM-DD");
      this.tcmStore.calculateDate = Math.abs(dischargeDate.diff(todayDate, 'days'));

      if (this.tcmStore.calculateDate <= 7 ) {
        this.tcmStore.tcmData.faceToFace.cptCode = '99496';
      }
      if (this.tcmStore.calculateDate >= 8 && this.tcmStore.calculateDate <= 14 ) {
        this.tcmStore.tcmData.faceToFace.cptCode = '99495';
      }
    }
  }
  navigateBack() {
    this.location.back();
  }
  getCOpyData () {
    this.gettingCopyData = true;
    this.tcmSevice.GetTcmEncounterForCopy(this.TcmId).subscribe((res: any) => {
      const textArea = document.createElement('textarea');
      // textArea.style.display = 'none';
      textArea.value = res;
      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, 99999);
      document.execCommand('copy');
      textArea.remove();
      this.toaster.success('Content Copied');
      this.gettingCopyData = false;
    }, (error: HttpResError) => {
      this.gettingCopyData = false;
    });
  }
}
