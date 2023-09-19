import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TcmInitialCommDto, PatientDischargeDto, TcmEncounterDto, TcmDocumentDto, TcmEncounterCloseDto, FaceToFaceDto, AddEditTcmInitialCommDto, NonFaceToFaceDto } from 'src/app/model/Tcm/tcm.model';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { TcmStoreService } from 'src/app/core/tcm/tcm-store.service';
import { TcmDataService } from 'src/app/tcm-data.service';
import { ToastService, UploadFile, ModalDirective } from 'ng-uikit-pro-standard';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { TcmStatusEnum, tcmStatus2Enum, ContactMethodEnum } from 'src/app/model/Tcm/tcm.enum';
import moment from 'moment';
import {  Location } from "@angular/common";
import { AwsService } from 'src/app/core/aws/aws.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-discharge-information',
  templateUrl: './discharge-information.component.html',
  styleUrls: ['./discharge-information.component.scss']
})
export class DischargeInformationComponent implements OnInit, AfterViewInit {
  @ViewChild ('ClosedStatusModal') ClosedStatusModal: ModalDirective;
  tcmEncounterCloseDto = new TcmEncounterCloseDto();
  initialCommObj = new AddEditTcmInitialCommDto();
  facilityUserList = new Array<CreateFacilityUserDto>();
  file: UploadFile;
  initialContactList = new Array<TcmInitialCommDto>();
  // dischargeInfoObj = new  PatientDischargeDto();
  tcmStatusEnum = tcmStatus2Enum;
  contactMethodEnum = ContactMethodEnum;
  tcmDocListDto = new Array<TcmDocumentDto>();
  patientDischarge = new PatientDischargeDto();
  // public datePickerConfig: IDatePickerConfig = {
  //   allowMultiSelect: false,
  //   returnedValueType: ECalendarValue.StringArr,
  //   format: 'YYYY-MM-DD hh:mm A'
  // };
  public datePickerConfig12: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    appendTo: 'body',
    closeOnSelect: true
  };
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD hh:mm A',
    appendTo: 'body',
    closeOnSelect: true
  };
  facilityId: number;
  isLoading: boolean;
  isSavingDischarge: boolean;
  isSavinginitialContact: boolean;
  upLoadingDoc: boolean;
  isNotEligible = false;
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };

  public scrollbarOptionsx = { axis: 'xy', theme: 'minimal-dark' };
  checkIsSuccessfull: TcmInitialCommDto;
  uploadFileName: string;
  tempTcmDocListDto = new TcmDocumentDto();
  gettingTcmData: boolean;
  useForExceptionHandling = false;
  objectURLStrAW: string;
  @ViewChild('viewPdfModal') viewPdfModal: ModalDirective;

  constructor(private facilityService: FacilityService, private toaster: ToastService, private awsService: AwsService,
    private securityService: SecurityService,public location: Location, private tcmData: TcmDataService,private appUi: AppUiService, public tcmStore: TcmStoreService) { }

  ngOnInit() {
    if (this.securityService.securityObject.userType == 5) {
      this.initialCommObj.initialCommunication.careProviderId = this.securityService.securityObject.id;
    }
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    this.GetTcmById();
    this.getFacilityUsersList();
    this.getTcmDocuments();
    // if (!this.tcmStore.tcmData.patientDischarge) {
    //   this.tcmStore.tcmData.patientDischarge = new PatientDischargeDto();
    //   this.tcmStore.viewDischargeDate = '';
    // }
  }
  ngAfterViewInit() {
// on view calls handling
setTimeout(() => {
  this.useForExceptionHandling = true;
}, 3000);

  }
  GetTcmById() {
    this.gettingTcmData = true;
    this.tcmData.GetTcmEncounterById(this.tcmStore.tcmId).subscribe((res: TcmEncounterDto) => {
      this.gettingTcmData = false;
      if (!res.patientDischarge) {
        res.patientDischarge = new PatientDischargeDto();
        this.tcmStore.viewDischargeDate = '';
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
      this.patientDischarge = res.patientDischarge;
      this.patientDischarge.isTcmEligible = res.isTcmEligible;

      // if (this.patientDischarge.dischargeDate) {
      //   this.patientDischarge.dischargeDate = moment(this.patientDischarge.dischargeDate).format("YYYY-MM-DD hh:mm A");
      //   // this.tcmStore.viewDischargeDate = moment(this.patientDischarge.dischargeDate, "YYYY-MM-DD hh:mm A" ).format("MMM DD YYYY");
      // }
      // // else {
      // //   this.tcmStore.viewDischargeDate = this.patientDischarge.dischargeDate;
      // // }
      // if (this.patientDischarge.followUpAppointment) {
      //   this.patientDischarge.followUpAppointment = moment(this.patientDischarge.followUpAppointment).format("YYYY-MM-DD hh:mm A");
      // }
      if (this.tcmStore.tcmData.tcmInitialComms) {
        this.tcmStore.checkIsSuccessfull = this.tcmStore.tcmData.tcmInitialComms.find(e => e.isSuccessfull == true);
       }
      //  this.resetVitalsValues();
      this.tcmStore.tcmDataLoaded.next(true);
      // this.datecheck();
    }, (error: HttpResError) => {
      this.gettingTcmData = false;
    });
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
  getInterActiveContactList() {

  }

  AddPatientDischargeData() {
    if (this.useForExceptionHandling) {
      if (this.tcmStore.tcmData.tcmStatus <= 2) {
        this.isSavingDischarge = true;
        this.patientDischarge.tcmEncounterId = this.tcmStore.tcmId;
        this.patientDischarge.patientId = this.tcmStore.patientId;
        this.tcmData.AddEditPatientDischarge(this.patientDischarge).subscribe(
            (res: TcmEncounterDto) => {
              // this.toaster.success("Added Succesfully");
              this.tcmStore.tcmData = res;
              if (res.patientDischarge.id) {
                this.patientDischarge.id = res.patientDischarge.id;
              }
              // if (this.tcmStore.tcmData.patientDischarge.dischargeDate) {
              //   this.tcmStore.tcmData.patientDischarge.dischargeDate = moment(this.tcmStore.tcmData.patientDischarge.dischargeDate).format("YYYY-MM-DD hh:mm A");
              //   this.tcmStore.viewDischargeDate = moment(this.tcmStore.tcmData.patientDischarge.dischargeDate).format("MMM DD YYYY");
              // } else {
              //   this.tcmStore.viewDischargeDate = this.tcmStore.tcmData.patientDischarge.dischargeDate;
              // }
              // if (this.tcmStore.tcmData.patientDischarge.followUpAppointment) {
              //   this.tcmStore.tcmData.patientDischarge.followUpAppointment = moment(this.tcmStore.tcmData.patientDischarge.followUpAppointment).format("YYYY-MM-DD hh:mm A");
              // }
              this.isSavingDischarge = false;
            },
            (err: HttpResError) => {
              this.isSavingDischarge = false;
              this.toaster.error(err.error);
            }
          );
      }
    }

  }

  AddEditInitComm() {
    this.isSavinginitialContact = true;
    this.initialCommObj.initialCommunication.tcmEncounterId = this.tcmStore.tcmId;
    this.initialCommObj.patientId = this.tcmStore.patientId;
    this.initialCommObj.initialCommunication.followUpDate = this.initialCommObj.followUpDate;
    this.tcmData.AddEditInitComm(this.initialCommObj).subscribe(
        (res: TcmEncounterDto) => {
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
          this.patientDischarge = res.patientDischarge;
        // res.tcmInitialComms.forEach(el => {
        //   if (el.isSuccessfull == true) {
        //     this.tcmStore.tcmData.initialCommStatus = 2;
        //   }
        // });
          this.tcmStore.tcmData.tcmInitialComms = res.tcmInitialComms;
          this.tcmStore.tcmData.commAttempts = res.tcmInitialComms.length;
          this.isSavinginitialContact = false;
          if (this.tcmStore.tcmData.tcmInitialComms) {
            this.tcmStore.checkIsSuccessfull = this.tcmStore.tcmData.tcmInitialComms.find(e => e.isSuccessfull == true);
           }
          this.resetInitialContact();
        },
        (err: HttpResError) => {
          this.isSavinginitialContact = false;
          this.toaster.error(err.error);
        }
      );
  }
  setTcmEncounterClosedStatus() {
    this.ClosedStatusModal.hide();
    this.tcmEncounterCloseDto.TcmEncounterId = this.tcmStore.tcmId;
    this.tcmData.SetTcmEncounterClosedStatus(this.tcmEncounterCloseDto).subscribe(
      (res: any) => {
        this.tcmStore.tcmData.tcmStatus = this.tcmEncounterCloseDto.ClosedStatus;
        this.location.back();
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  openConfirmModal(data: any) {
    this.ClosedStatusModal.hide();
    const modalDto = new LazyModalDto();
    modalDto.Title = "Close TCM Status";
    modalDto.Text = `Do you want to Close this tcm ?`;
    modalDto.callBack = this.callBack;
    modalDto.rejectCallBack = this.rejectCallBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.AddPatientDischargeData();
    this.setTcmEncounterClosedStatus();
  }
  rejectCallBack = () => {
    this.patientDischarge.isTcmEligible = false;
  }
  openModel() {
    if (this.patientDischarge.isTcmEligible) {
      this.ClosedStatusModal.show();
    }
  }
  resetInitialContact() {
    this.initialCommObj.initialCommunication = new TcmInitialCommDto();
  }
  assignFacilityUser() {
    if (this.securityService.securityObject.userType == 5) {
      this.initialCommObj.initialCommunication.careProviderId = this.securityService.securityObject.id;
    }
  }
  onUploadOutput(output: any): void {
    if (output.target.files[0]) {
      this.file = output.target.files[0];
    }
  }
  uploadDocument() {
    this.upLoadingDoc = true;
    this.tcmData.UploadDoc(this.tcmStore.tcmId, this.file.name).subscribe((res: TcmDocumentDto[]) => {
      this.tcmDocListDto = res;
      // this.tempTcmDocListDto = res;
if (this.tcmDocListDto) {
  let max = Math.max.apply(Math, this.tcmDocListDto.map(function(o) { return o.id; }));
  this.tempTcmDocListDto = this.tcmDocListDto.find(element => {
  return max == element.id;
});
}
      this.uploadTCMDocToS3(this.tempTcmDocListDto.path)
      // this.uploadFileName = res.title
      this.upLoadingDoc = false;
      this.file = undefined;
      // if (!this.tcmStore.tcmData.tcmDocuments) {
      //   this.tcmStore.tcmData.tcmDocuments = new Array<TcmDocumentDto>();
      // }
      // this.tcmStore.tcmData.tcmDocuments.push(res);
    }, (err: any) => {
      this.toaster.error(err.message, err.error || err.error);
      this.upLoadingDoc = false;
    });
  }
  async uploadTCMDocToS3(filePath) {

      // this.ccmInputLoading = true;
      // const path = `FacilityID-${this.facilityId}/PatientConsents/CcmConsents/${this.file.name}`;
      this.awsService.uploadUsingSdk(this.file, filePath).then(
        data => {
          this.tempTcmDocListDto.path = '';
          this.getTcmDocuments();
          this.toaster.success('Document uploaded');
          // this.uploadWrittenDoc(path);
        },
        error => {

          this.toaster.error(error.message, error.error || error.error);
        }
      );

  }
  getTcmDocuments() {
    this.tcmData.GetTcmDocumentsByTcmEncounterId(this.tcmStore.tcmId).subscribe((res: TcmDocumentDto[]) => {
      this.tcmDocListDto = res;
    }, (err: any) => {
      this.toaster.error(err.error);
    });
  }
  deleteTcmDocument(docId: number) {
    this.tcmData.DeleteTcmDocument(docId).subscribe((res: any) => {
      this.tcmDocListDto = this.tcmDocListDto.filter(doc => {return doc.id != docId});
      // this.tcmDocListDto = res;
    }, (err: any) => {
      this.toaster.error(err.error);
    });
  }
  getpublicUrl(path: string) {
    // const importantStuff = window.open("", "_blank");
    let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
    nUrl =  environment.appUrl;
    nUrl = nUrl + 'success/loading';
    const importantStuff = window.open(nUrl);
    this.tcmData.getPublicPath(path).subscribe( async(res: any) => {
      if (path.toLocaleLowerCase().includes('.pdf')) {
        fetch(res).then(async (data: any) => {
          const slknasl = await data.blob();
          const blob = new Blob([slknasl], { type: 'application/pdf' });
          const objectURL = URL.createObjectURL(blob);
          importantStuff.close();
          this.objectURLStrAW = objectURL;
          this.viewPdfModal.show();
          // importantStuff.location.href = objectURL;
          // window.open(objectURL, '_blank');
        });
      } else {
        // window.open(res, "_blank");
        importantStuff.location.href = res;
        // setTimeout(() => {
        //   importantStuff.close();
        // }, 2000);
      }
      // const extName =  path.split(/[#?]/)[0].split('.').pop().trim();
      // mBlob = new Blob([slknasl], {type: `application/${extName}`});
    }, (err: any) => {
      this.toaster.error(err.error);
    });
  }
}
