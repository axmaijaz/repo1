import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastService } from 'ng-uikit-pro-standard';
import { SecurityService } from 'src/app/core/security/security.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { TcmDataService } from 'src/app/tcm-data.service';
import { TcmStoreService } from 'src/app/core/tcm/tcm-store.service';
import { TcmStatusEnum, tcmStatus2Enum } from 'src/app/model/Tcm/tcm.enum';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { TcmEncounterDto, FaceToFaceDto, SignTcmEncounterDto, PatientDischargeDto, NonFaceToFaceDto, TcmDocumentDto } from 'src/app/model/Tcm/tcm.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import moment from 'moment';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VerifyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';

@Component({
  selector: 'app-face-to-face',
  templateUrl: './face-to-face.component.html',
  styleUrls: ['./face-to-face.component.scss']
})
export class FaceToFaceComponent implements OnInit {
  @ViewChild("f") form: NgForm;
  tcmStatusEnum = tcmStatus2Enum;
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    disableKeypress: true,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD hh:mm A'
  };
  typeOfService: number;
  isSavingFTF: boolean;
  signTcmEncounterDto = new SignTcmEncounterDto();
  isLoading: boolean;
  facilityUserList: CreateFacilityUserDto[];
  billingProvidersList: CreateFacilityUserDto[];
  facilityId: number;
  isLoadingBillingP: boolean;
  // TcmId: number;
  billingProviderId: number;
  isBillingProvider: boolean;
  providerName: string;
  faceToFace = new FaceToFaceDto();
  gettingTcmData: boolean;

  constructor(private toaster: ToastService, private route: ActivatedRoute,
    private appUi: AppUiService, private securityService: SecurityService, private facilityService: FacilityService, private tcmData: TcmDataService, public tcmStore: TcmStoreService) { }

  ngOnInit() {
    if (!this.tcmStore.tcmData.faceToFace) {
      this.tcmStore.tcmData.faceToFace = new FaceToFaceDto();
    }
    // this.TcmId = +this.route.snapshot.paramMap.get('tcmId');
    this.GetTcmById();
    if (this.securityService.hasClaim('IsBillingProvider')) {
      this.isBillingProvider = true;
      this.billingProviderId = this.securityService.securityObject.id;
      this.providerName = this.securityService.securityObject.fullName;
    }
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    this.getFacilityUsersList();
    // this.getBillingProvidersList();
  }

  GetTcmById() {
    this.gettingTcmData = true;
    this.tcmData.GetTcmEncounterById(this.tcmStore.tcmId).subscribe((res: TcmEncounterDto) => {
      this.gettingTcmData = false;
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
      this.faceToFace = res.faceToFace;
      if (this.billingProviderId && !this.faceToFace.billingProviderId) {
        this.faceToFace.billingProviderId = this.billingProviderId;
        this.faceToFace.billingProviderName = this.providerName;
      }
    this.assignFacilityUser();
      if (!this.faceToFace.cptCode) {
        this.datecheck();
      }
      // if (this.faceToFace.serviceDate) {
      //   this.faceToFace.serviceDate = moment(this.faceToFace.serviceDate).format("YYYY-MM-DD hh:mm A");
      // }
      // if (this.faceToFace.dateVisited) {
      //   this.faceToFace.dateVisited = moment(this.faceToFace.dateVisited).format("YYYY-MM-DD hh:mm A");
      // }
      // if (!this.faceToFace.serviceDate || this.faceToFace.serviceDate == '0001-01-01T00:00:00') {
      //   let todayDate = new Date().toLocaleDateString();
      //   this.faceToFace.serviceDate = moment(todayDate).format('YYYY-MM-DD hh:mm A');
      // }


      // if (this.tcmStore.tcmData.patientDischarge.dischargeDate) {
      //   this.tcmStore.tcmData.patientDischarge.dischargeDate = moment(this.tcmStore.tcmData.patientDischarge.dischargeDate).format("YYYY-MM-DD hh:mm A");
      //   // this.tcmStore.viewDischargeDate = moment(this.tcmStore.tcmData.patientDischarge.dischargeDate, "YYYY-MM-DD hh:mm A" ).format("MMM DD YYYY");
      // }
      // // else {
      // //   this.tcmStore.viewDischargeDate = this.tcmStore.tcmData.patientDischarge.dischargeDate;
      // // }
      // if (this.tcmStore.tcmData.patientDischarge.followUpAppointment) {
      //   this.tcmStore.tcmData.patientDischarge.followUpAppointment = moment(this.tcmStore.tcmData.patientDischarge.followUpAppointment).format("YYYY-MM-DD hh:mm A");
      // }
      // if (this.tcmStore.tcmData.tcmInitialComms) {
      //   this.tcmStore.checkIsSuccessfull = this.tcmStore.tcmData.tcmInitialComms.find(e => e.isSuccessfull == true);
      //  }
      //  this.resetVitalsValues();
      this.tcmStore.tcmDataLoaded.next(true);
      // this.datecheck();
    }, (error: HttpResError) => {
      this.gettingTcmData = false;
    });
  }
  datecheck() {
    let todayDate = new Date().toLocaleDateString();
    // this.firstDate = moment('2019/03/31');
    if (this.tcmStore.tcmData.patientDischarge.dischargeDate) {
      let dischargeDate = moment(this.tcmStore.tcmData.patientDischarge.dischargeDate, "YYYY-MM-DD");
      this.tcmStore.calculateDate = Math.abs(dischargeDate.diff(todayDate, 'days'));
      if (this.tcmStore.calculateDate <= 7 ) {
        this.faceToFace.cptCode = '99496';
      }
      if (this.tcmStore.calculateDate >= 8) {
        this.faceToFace.cptCode = '99495';
      }
    }
  }
  SBPValidation() {
    if (this.faceToFace.sbp >= 50 && this.faceToFace.sbp <= 250 ) {
      this.AddEditFaceToFace();
    } else {
      this.faceToFace.sbp = null;
      this.AddEditFaceToFace();
    }
  }
  DBPValidation() {
    if (this.faceToFace.dbp >= 20 && this.faceToFace.dbp <= 150 ) {
      this.AddEditFaceToFace();
    } else {
      this.faceToFace.dbp = null;
      this.AddEditFaceToFace();
    }
  }
  tempValidation() {
    if (this.faceToFace.temp >= 90 && this.faceToFace.temp <= 108 ) {
      this.AddEditFaceToFace();
    } else {
      this.faceToFace.temp = null;
      this.AddEditFaceToFace();
    }
  }
  oxygenationValidation() {
    if (this.faceToFace.oxygenation >= 80 && this.faceToFace.oxygenation <= 100 ) {

      this.AddEditFaceToFace();
    } else {
      this.faceToFace.oxygenation = null;
      this.AddEditFaceToFace();
    }
  }
  pulsePerMinuteValidation() {
    if (this.faceToFace.pulsePerMinute >= 20 && this.faceToFace.pulsePerMinute <= 200 ) {
      this.AddEditFaceToFace();
    } else {
      this.faceToFace.pulsePerMinute = null;
      this.AddEditFaceToFace();
    }
  }
  respRateValidation() {
    if (this.faceToFace.respRate >= 4 && this.faceToFace.respRate <= 60 ) {
      this.AddEditFaceToFace();
    } else {
      this.faceToFace.respRate = null;
      this.AddEditFaceToFace();
    }
  }
  AddEditFaceToFace() {
    if (this.tcmStore.tcmData.tcmStatus <= 2) {
    this.isSavingFTF = true;
    this.faceToFace.tcmEncounterId = this.tcmStore.tcmId;
    // this.adjestVitalsValues();
    this.tcmData.AddEditFaceToFace(this.faceToFace).subscribe(
        (res: TcmEncounterDto) => {
          // this.toaster.success("Added Succesfully");
          this.tcmStore.tcmData = res;
          if (res.faceToFace.id) {
            this.faceToFace.id = res.faceToFace.id;
          }
          // this.resetVitalsValues();
          if (this.tcmStore.tcmData.faceToFace.serviceDate) {
            this.tcmStore.tcmData.faceToFace.serviceDate = moment(this.tcmStore.tcmData.faceToFace.serviceDate).format("YYYY-MM-DD hh:mm A");
          }
          if (this.tcmStore.tcmData.faceToFace.dateVisited) {
            this.tcmStore.tcmData.faceToFace.dateVisited = moment(this.tcmStore.tcmData.faceToFace.dateVisited).format("YYYY-MM-DD hh:mm A");
          }
          // if (this.tcmStore.tcmData.patientDischarge.dischargeDate) {
          //   this.tcmStore.tcmData.patientDischarge.dischargeDate = moment(this.tcmStore.tcmData.patientDischarge.dischargeDate).format("YYYY-MM-DD hh:mm A");
          //   this.tcmStore.viewDischargeDate = moment(this.tcmStore.tcmData.patientDischarge.dischargeDate, "YYYY-MM-DD hh:mm A" ).format("MMM DD YYYY");
          // } else {
          //   this.tcmStore.viewDischargeDate = this.tcmStore.tcmData.patientDischarge.dischargeDate;
          // }
          // if (this.tcmStore.tcmData.patientDischarge.followUpAppointment) {
          //   this.tcmStore.tcmData.patientDischarge.followUpAppointment = moment(this.tcmStore.tcmData.patientDischarge.followUpAppointment).format("YYYY-MM-DD hh:mm A");
          // }
          // if (this.tcmStore.tcmData.tcmInitialComms) {
          //   this.tcmStore.checkIsSuccessfull = this.tcmStore.tcmData.tcmInitialComms.find(e => e.isSuccessfull == true);
          //  }
          //  this.resetVitalsValues();
           this.tcmStore.tcmDataLoaded.next(true);
          this.isSavingFTF = false;
        },
        (err: HttpResError) => {
          this.isSavingFTF = false;
          this.toaster.error(err.error);
        }
      );
    }
  }

  getFacilityUsersList() {
    this.isLoading = true;
    if ( this.tcmStore.facilityUserList && this.tcmStore.facilityUserList.length > 0) {
      this.facilityUserList = this.tcmStore.facilityUserList;
      this.isLoading = false;
      return;
    }
    this.facilityService.getCareProvidersByFacilityId(this.facilityId).subscribe(
        (res: any) => {
          this.facilityUserList = res;
          this.tcmStore.facilityUserList = res;
          this.isLoading = false;
        },
        err => {
          this.isLoading = false;
        }
      );
  }
  assignFacilityUser() {
    if (this.securityService.securityObject.userType == 5) {
      if (!this.faceToFace) {
        this.faceToFace = new FaceToFaceDto();
      }
      if (!this.faceToFace.facilityUserId) {
        this.faceToFace.facilityUserId = this.securityService.securityObject.id;
      }
    }
  }
  getBillingProvidersList() {
    this.isLoadingBillingP = true;
    this.facilityService.getBillingProvidersByFacilityId(this.facilityId).subscribe(
        (res: any) => {
          this.billingProvidersList = res;
          this.isLoadingBillingP = false;
        },
        err => {
          this.isLoadingBillingP = false;
        }
      );
  }
  signTcmEncounter() {
    this.isLoadingBillingP = true;
    this.signTcmEncounterDto.tcmEncounterId = this.faceToFace.tcmEncounterId;
    this.signTcmEncounterDto.cptCode = this.faceToFace.cptCode;
    this.tcmData.SignTcmEncounter(this.signTcmEncounterDto).subscribe(
        (res: any) => {
          this.tcmStore.tcmData = res;
          // if (this.tcmStore.tcmData.faceToFace.serviceDate) {
          //   this.tcmStore.tcmData.faceToFace.serviceDate = moment(this.tcmStore.tcmData.faceToFace.serviceDate).format("YYYY-MM-DD hh:mm A");
          // }
          // if (this.tcmStore.tcmData.faceToFace.dateVisited) {
          //   this.tcmStore.tcmData.faceToFace.dateVisited = moment(this.tcmStore.tcmData.faceToFace.dateVisited).format("YYYY-MM-DD hh:mm A");
          // }
          // if (this.tcmStore.tcmData.patientDischarge.dischargeDate) {
          //   this.tcmStore.tcmData.patientDischarge.dischargeDate = moment(this.tcmStore.tcmData.patientDischarge.dischargeDate).format("YYYY-MM-DD hh:mm A");
          //   this.tcmStore.viewDischargeDate = moment(this.tcmStore.tcmData.patientDischarge.dischargeDate, "YYYY-MM-DD hh:mm A" ).format("MMM DD YYYY");
          // } else {
          //   this.tcmStore.viewDischargeDate = this.tcmStore.tcmData.patientDischarge.dischargeDate;
          // }
          // if (this.tcmStore.tcmData.patientDischarge.followUpAppointment) {
          //   this.tcmStore.tcmData.patientDischarge.followUpAppointment = moment(this.tcmStore.tcmData.patientDischarge.followUpAppointment).format("YYYY-MM-DD hh:mm A");
          // }
          // if (this.tcmStore.tcmData.tcmInitialComms) {
          //   this.tcmStore.checkIsSuccessfull = this.tcmStore.tcmData.tcmInitialComms.find(e => e.isSuccessfull == true);
          //  }
          //  this.resetVitalsValues();
           this.tcmStore.tcmDataLoaded.next(true);
          this.toaster.success("Claim generated successfully.");
          this.isLoadingBillingP = false;
        },
        err => {
          this.isLoadingBillingP = false;
          this.tcmStore.gettingTcmData = false;
        }
      );
  }
  servTypeChanged() {
    if (this.typeOfService) {
      if (this.typeOfService === 1 && this.tcmStore.tcmData.faceToFaceScheduledDate) {
          this.tcmStore.tcmData.faceToFace.serviceDate = moment(this.tcmStore.tcmData.faceToFaceScheduledDate).format("YYYY-MM-DD hh:mm A");
          // this.tcmStore.tcmData.faceToFace.serviceDate = this.tcmStore.tcmData.faceToFaceScheduledDate;
      } else {
        this.tcmStore.tcmData.faceToFace.serviceDate = '';
      }
    } else {
      this.tcmStore.tcmData.faceToFace.serviceDate = '';
    }
  }
  OpenVerifyProviderModal() {
    const modalData = new VerifyModalDto();
    modalData.Title = 'Change Provider';
    modalData.callBack = this.callback;
    modalData.data = {};
    this.appUi.openVerifyProviderMOdal(modalData);
    // this.appUi.showVerifyProviderModalSubject.next(modalData);
  }
  callback = (data: number, name: string) => {
    if (data) {
      this.faceToFace.billingProviderId = data;
      this.isBillingProvider = true;
      this.faceToFace.billingProviderName = name;
      this.AddEditFaceToFace();
      this.toaster.success('Provider changed');
    } else {
      this.isBillingProvider = false;
      this.toaster.error('Password is incorrect');
    }

  }
}
