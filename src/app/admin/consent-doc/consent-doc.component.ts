import { AppDataService } from 'src/app/core/app-data.service';
import { data } from 'jquery';
import { find } from 'cfb/types';
import { PatientConsentService } from './../../core/Patient/patient-consent.service';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { CcmDataService } from 'src/app/core/ccm-data.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import * as moment from 'moment';

import {
  ConsentType,
  DocumentType,
  ConsentNature,
} from 'src/app/Enums/filterPatient.enum';
import {
  UploadFile,
  ToastService,
  IMyOptions,
  ModalDirective,
} from 'ng-uikit-pro-standard';

import { Router, ActivatedRoute } from '@angular/router';
import {
  PatientDto,
  ChronicIcd10CodeDto,
  PatientConsents,
  consentDto,
} from 'src/app/model/Patient/patient.model';
import { SecurityService } from 'src/app/core/security/security.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UserType } from 'src/app/Enums/UserType.enum';
import { Location, DatePipe } from '@angular/common';
import * as FileSaver from 'file-saver';
import { AwsService } from 'src/app/core/aws/aws.service';
import { SubSink } from 'src/app/SubSink';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { environment } from 'src/environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-consent-doc',
  templateUrl: './consent-doc.component.html',
  styleUrls: ['./consent-doc.component.scss'],
})
export class ConsentDocComponent implements OnInit, OnDestroy {
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    appendTo: 'body',
    closeOnSelect: true,
    drops:'down'
  };
  @ViewChild('onlineConsentModal') onlineConsentModal: ModalDirective;
  @ViewChild('ccmConsentModal') ccmConsentModal: ModalDirective;
  @ViewChild('rpmConsentModal') rpmConsentModal: ModalDirective;
  @ViewChild('bhiConsentModal') bhiConsentModal: ModalDirective;
  @ViewChild('revokeConsentModal') revokeConsentModal: ModalDirective;
  @ViewChild('viewPdfModal') viewPdfModal: ModalDirective;
  @ViewChild('select') inputEl: ElementRef;
  @ViewChild('select2') inputE2: ElementRef;
  private subs = new SubSink();
  isLoading = false;
  ccmInputLoading = false;
  rpmInputLoading = false;
  patientId = 0;
  patientTempData = new PatientDto();
  tempPatientCcmConsentType: ConsentType;
  tempPatientRpmConsentType: ConsentType;
  tempPatientBhiConsentType: ConsentType;
  patientCcmConsentType: ConsentType;
  patientConsentType: ConsentType;
  patientConsentNature: ConsentNature;
  patientRpmConsentType: ConsentType;
  patientBhiConsentType: ConsentType;
  consentNature: ConsentNature;
  patientCcmConsent = new PatientConsents();
  selectedConsent = new PatientConsents();
  listOfConsents = new consentDto();
  // patientConsentsList: any;
  consentTypeEnum = ConsentType;
  patientRpmConcent = new PatientConsents();
  patientBhiConcent = new PatientConsents();
  // patientRpmConcentsList: any;
  files = new Array<UploadFile>();
  files2 = new Array<UploadFile>();
  files3 = new Array<UploadFile>();
  signatureText = '';
  consentDocument: any;
  physicianName: string;
  patientName: string;
  modalObj = new LazyModalDto();
  // uploadFileName: string;
  // uploadFileName2: string;
  // uploadFileUrl: string;
  // uploadFileUrl2: string;
  // uploadFileName3: string;
  // uploadFileUrl3: string;
  UserFullName: string;
  IsPatientLoginId: number;
  Signature: '';
  @ViewChild('signature') signature: ElementRef;
  facilityId: number;
  tempRpmConsent: any;
  inputLoading: boolean;
  tempConsentType: any;
  tempRpmConsentType: any;
  isUpdateFromList = false;
  ccmConsentDate = '';
  ccmConsentNote = '';

  bhiConsentDate = '';
  bhiConsentNote = '';

  rpmConsentDate = '';
  rpmConsentNote = '';
  objectURLStrAW = '';
  currentDate: Date | string = new Date();
  isDownloadingConsentPdf: boolean;
  hideActionButtons: boolean;
  natureFilter: string;
  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private awsService: AwsService,
    private toaster: ToastService,
    private patientService: PatientsService,
    private patientConsentService: PatientConsentService,
    private ccmDataService: CcmDataService,
    private securityService: SecurityService,
    private sanatizer: DomSanitizer,
    private appUi: AppUiService,
    private appData: AppDataService,
    private datePipe: DatePipe,
    private clipboard: Clipboard
  ) {
    this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
  }

  ngOnInit() {
    if (this.securityService.securityObject.userType === UserType.Patient) {
      this.IsPatientLoginId = this.securityService.securityObject.id;
    }
    this.UserFullName = this.securityService.securityObject.fullName;
    if (!this.IsPatientLoginId) {

      this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    }
    this.patientId = +this.route.snapshot.paramMap.get('id');
    this.getPatientConsentsByPId();
    this.getPatientById();
    this.appUi.loadPatientConsents.subscribe(
      (res: any) => {
        this.getPatientConsentsByPId();
        this.getPatientById();
      }
    )
    this.hideActionButtons = this.route.snapshot.queryParamMap.get('hideActionButtons') ? true : false;
    this.natureFilter = this.route.snapshot.queryParamMap.get('nature');
  }
  getPatientById() {
    this.patientService.getPatientDetail(this.patientId).subscribe(
      (res: any) => {
        this.appData.summeryViewPatient = res;
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  openLazyConsentModal(row) {
      const currentDate = moment().format('YYYY-MM-DD')
      const modalDto = new LazyModalDto();
      modalDto.Title = '';
      modalDto.Text = '';
      modalDto.data = row;
      if(modalDto.data.isRevoked){
        modalDto.data.consentType = -1;
        modalDto.data.consentDate = currentDate;
      }
      modalDto.hideProceed = true;
      modalDto.rejectCallBack = this.rejectCall
      modalDto.callBack = this.openLazyConsentModalcallBack2;
      this.appUi.openLazyConsentModal(modalDto);
  }
  rejectCall(doc) {
    this.patientCcmConsent = doc.data;
  }
  openLazyConsentModalcallBack2 = (data: any) => {
    this.addPatientConsent(data);
    this.uploadDocToS3(data);
  };
  addPatientConsent(consentData: PatientConsents) {
    this.isLoading = true;
    let data = {
      patientId: consentData.patientId,
      consentType: consentData.consentType,
      signature: consentData.Signature,
      consentNature: consentData.consentNature1,
      consentDate: consentData.consentDate,
      note: consentData.note,
      isSaveAndConsentTaken: consentData.isSaveAndConsentTaken,
    }
    this.subs.sink = this.patientConsentService
      .AddPatientConsent(data)
      .subscribe(
        (res: PatientConsents[]) => {
          this.getPatientConsentsByPId();
          this.isLoading = false;
          this.toaster.success('Patient Consent Taken.');
          this.getPatientById();
        },
        (err) => {
          this.Signature = '';
          this.isLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  async uploadDocToS3(cons: PatientConsents) {
    if (cons.consentType === 1) {
      this.ccmInputLoading = true;
      let myDate = new Date();
      const path = `FacilityID-${this.facilityId}/PatientConsents/CcmConsents/${cons.files.name}`;
      this.awsService.uploadUsingSdk(cons.files, path).then(
        (data) => {
          this.uploadWrittenDoc1(path, cons);
        },
        (error) => {
          this.ccmInputLoading = false;
          this.toaster.error(error.message, error.error || error.error);
        }
      );
    }
  }
  uploadWrittenDoc1(path: string, data: PatientConsents): void {
    if (data.consentType === 1) {
      this.ccmInputLoading = true;
      this.subs.sink = this.patientService
        .UploadCcmConsent(
          path,
          this.patientId,
          data.consentType,
          data.consentNature1,
          data.files.name
        )
        .subscribe(
          (res) => {
            this.ccmInputLoading = false;
            this.files = new Array<UploadFile>();
            // this.getPatientById();
            this.getPatientConsentsByPId();
            // this.uploadFileUrl = res.fileURL;
            // this.uploadFileName = this.files[0].name;
            this.ccmInputLoading = false;
            this.toaster.success('Patient Consent Taken.');
            this.getPatientById();
            // this.router.navigate(["/admin/patient/", this.patientId]);
          },
          (err) => {
            // this.preLoader = 0;
            this.ccmInputLoading = false;
            // this.uploadFileName = "";
            // this.uploadFileName = "";
            this.toaster.error(err.error, err.message);
          }
        );
    }
  }
  openConsentConfirmModal(row) {
    if (row && row.isConsentTaken && !row.isRevoked) {
      const modalDto1 = new LazyModalDto();
      modalDto1.Title = 'Warning';
      modalDto1.Text =
        'Consent has already been taken, would you like to change it?';
      modalDto1.data = row;
      modalDto1.callBack = this.callBackBhi;
      modalDto1.rejectCallBack = this.rejectCallBackBhi;
      // modalDto.data = data;
      this.appUi.openLazyConfrimModal(modalDto1);
    } else {
      this.openLazyConsentModal(row);
    }
  }
  rejectCallBackBhi = () => {
  }
  callBackBhi = (row) => {
  //  this.bhiConsentModal.show();
  this.openLazyConsentModal(row);
  }






  getPatientConsentsByPId() {
    this.isLoading = true;
    this.subs.sink = this.patientConsentService
      .getPatientConsentsByPatientId(this.patientId)
      .subscribe(
        (res: consentDto) => {
                this.isLoading = false;
                if (this.natureFilter && res.patientConsentsDto) {
                  res.patientConsentsDto = res.patientConsentsDto.filter(x => x.consentNature.toUpperCase() == this.natureFilter)
                }
                res.patientConsentsDto.forEach(cons => {
                  if (!cons.consentDate) {
                    cons.consentDate = this.currentDate.toString();
                  }
                });
                this.listOfConsents = res;
                this.resetValues();
                  this.physicianName = res.billingProviderName;
                  this.patientName = res.patientName;
                  // if(res.patientConsentsDto) {
                  //   res.patientConsentsDto.forEach((consent) => {
                  //     if (consent.consentNature === "CCM") {
                  //       this.patientCcmConsent = consent;
                  //       this.tempPatientCcmConsentType = this.patientCcmConsent.consentType;
                  //       this.patientCcmConsentType = this.patientCcmConsent.consentType;
                  //       this.ccmConsentDate = this.patientCcmConsent.consentDate;
                  //       this.ccmConsentNote = this.patientCcmConsent.note;
                  //     } else if (consent.consentNature === "RPM") {
                  //       this.patientRpmConcent = consent;
                  //       this.tempPatientRpmConsentType = this.patientRpmConcent.consentType;
                  //       this.patientRpmConsentType = this.patientRpmConcent.consentType;
                  //       this.rpmConsentDate = this.patientRpmConcent.consentDate;
                  //       this.rpmConsentNote = this.patientRpmConcent.note;
                  //     } else if (consent.consentNature === "BHI") {
                  //       this.patientBhiConcent = consent;
                  //       this.tempPatientBhiConsentType = this.patientBhiConcent.consentType;
                  //       this.patientBhiConsentType = this.patientBhiConcent.consentType;
                  //       this.bhiConsentDate = this.patientBhiConcent.consentDate;
                  //       this.bhiConsentNote = this.patientBhiConcent.note;

                  //     }
                  //   });

                  // }
                  // if (!this.rpmConsentDate) {
                  //   this.rpmConsentDate = this.currentDate.toString();
                  // }
                  // if (!this.ccmConsentDate) {
                  //   this.ccmConsentDate = this.currentDate.toString();
                  // }
                  // if (!this.bhiConsentDate) {
                  //   this.bhiConsentDate = this.currentDate.toString();
                  // }
        },
        (err) => {
          this.isLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  resetValues() {
    this.patientRpmConcent = new PatientConsents();
    this.tempPatientRpmConsentType = this.patientRpmConcent.consentType;
    this.patientRpmConsentType = this.patientRpmConcent.consentType;
    this.patientCcmConsent = new PatientConsents();
    this.tempPatientCcmConsentType = this.patientCcmConsent.consentType;
    this.patientCcmConsentType = this.patientCcmConsent.consentType;
    this.patientBhiConcent = new PatientConsents();
    this.tempPatientBhiConsentType = this.patientBhiConcent.consentType;
    this.patientBhiConsentType = this.patientBhiConcent.consentType;
  }
  // editPatientCcmConsentById() {

  //   this.subs.sink = this.patientConsentService
  //     .EditPatientConsentById(this.patientCcmConsent)
  //     .subscribe(
  //       (res: PatientConsents[]) => {
  //         this.getPatientConsentsByPId();
  //         this.ccmConsentModal.hide();
  //         this.toaster.success("Patient Consent Taken.");
  //       },
  //       (err) => {
  //         this.patientCcmConsent.consentType = this.tempPatientCcmConsentType;
  //         this.toaster.error(err.error, err.message);
  //       }
  //     );
  // }
  addPatientCcmConsent() {
    this.isLoading = true;
    let data = {
      patientId: this.patientId,
      consentType: this.patientCcmConsentType,
      signature: this.Signature,
      consentNature: 0,
      consentDate: this.ccmConsentDate,
      note: this.ccmConsentNote,
    }
    this.subs.sink = this.patientConsentService
      .AddPatientConsent(data)
      .subscribe(
        (res: PatientConsents[]) => {
          this.Signature = '';
          this.ccmConsentDate = '';
          this.ccmConsentNote = '';
          this.getPatientConsentsByPId();
          this.isLoading = false;
          this.ccmConsentModal.hide();
          this.toaster.success('Patient Consent Taken.');
          // this.rpmConsentModal.hide();
          // this.bhiConsentModal.hide();
          this.getPatientById();
        },
        (err) => {
          this.Signature = '';
          this.isLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  // editPatientRpmConsentById() {
  //   this.patientRpmConcent.consentType = this.patientRpmConsentType;
  //   this.subs.sink = this.patientConsentService
  //   .EditPatientConsentById(this.patientRpmConcent)
  //   .subscribe(
  //     (res: PatientConsents[]) => {
  //       this.getPatientConsentsByPId();
  //       this.rpmConsentModal.hide();
  //       this.toaster.success("Patient Consent Taken.");
  //     },
  //     (err) => {
  //       this.patientRpmConsentType = this.tempPatientRpmConsentType;
  //       this.toaster.error(err.error, err.message);
  //     }
  //   );
  // }
  addPatientRpmConsent() {
    this.isLoading = true;
    let data = {
      patientId: this.patientId,
      consentType: this.patientRpmConsentType,
      signature: this.Signature,
      consentNature: 1,
      consentDate: this.rpmConsentDate,
      note: this.rpmConsentNote,
    }
    this.subs.sink = this.patientConsentService
      .AddPatientConsent(data)
      .subscribe(
        (res: PatientConsents[]) => {
          this.isLoading = false;
          this.rpmConsentDate = '';
          this.rpmConsentNote = '';
          this.getPatientConsentsByPId();
          this.rpmConsentModal.hide();
          this.toaster.success('Patient Consent Taken.');

          this.getPatientById();
        },
        (err) => {
          this.isLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  // editPatientBhiConsentById() {
  //   this.patientBhiConcent.consentType = this.patientBhiConsentType;
  //   this.subs.sink = this.patientConsentService
  //   .EditPatientConsentById(this.patientBhiConcent)
  //   .subscribe(
  //     (res: PatientConsents[]) => {
  //       this.getPatientConsentsByPId();
  //       this.bhiConsentModal.hide();
  //       this.toaster.success("Patient Consent Taken.");
  //     },
  //     (err) => {
  //       this.patientBhiConsentType = this.tempPatientBhiConsentType;
  //       this.toaster.error(err.error, err.message);
  //     });
  // }
  addPatientBhiConsent() {
    this.isLoading = true;
    let data = {
      patientId: this.patientId,
      consentType: this.patientBhiConsentType,
      signature: this.Signature,
      consentNature: 3,
      consentDate: this.bhiConsentDate,
      note: this.bhiConsentNote,

    }
    this.subs.sink = this.patientConsentService
      .AddPatientConsent(data)
      .subscribe(
        (res: PatientConsents[]) => {
          this.isLoading = false;
          this.bhiConsentDate = '';
          this.bhiConsentNote = '';
          this.getPatientConsentsByPId();
          this.bhiConsentModal.hide();
          this.toaster.success('Patient Consent Taken.');
          this.getPatientById();
        },
        (err) => {
          this.isLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  revokePatientConsentById(): void {
    this.isLoading = true;
    let revoke = {
      consentId: this.selectedConsent.id,
      revokeReason: this.selectedConsent.revokedReason
    };
    this.subs.sink = this.patientConsentService
      .DeletePatientConsentById(revoke)
      .subscribe(
        (res) => {
          this.isLoading = false;
          // this.getPatientConsentsByPId();
          this.toaster.success("Revoke Consent.");
          this.appUi.loadPatientConsents.next();
          this.patientService.refreshPatient.next();
          // this.getPatientById();
        },
        (err) => {
          this.isLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  openConfirmModalForRevokeConsent() {
    if (this.patientCcmConsent && this.patientCcmConsent.isConsentTaken) {
      const modalDto = new LazyModalDto();
      modalDto.Title = 'Warning';
      modalDto.Text =
        'Consent has already been taken, are you sure you want to revoke the consent?';
      modalDto.callBack = this.callBackForRevoke;
      // modalDto.rejectCallBack = this.rejectCallBack;
      // modalDto.data = data;
      this.appUi.openLazyConfrimModal(modalDto);
    } else {
      this.toaster.warning('No consent taken');
    }
  }
  // rejectCallBack = () => {
  // }
  callBackForRevoke = () => {
    this.revokePatientConsentById();
  }


  getPublicUrl(url: string) {
    // const importantStuff = window.open("", "_blank");
    let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
    nUrl =  environment.appUrl;
    nUrl = nUrl + 'success/loading';
    const importantStuff = window.open(nUrl);
    this.subs.sink = this.ccmDataService.getPublicPath(url).subscribe(
      (res: any) => {
        this.isLoading = false;
        // importantStuff.location.href = res;
        if (url.toLocaleLowerCase().includes('.pdf')) {
          fetch(res).then(async (fdata: any) => {
            const slknasl = await fdata.blob();
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
        // FileSaver.saveAs(
        //   new Blob([res], { type: 'application/pdf' }),
        //   'Consent-Document'
        // );
      },
      (err) => {
        this.isLoading = false;
        // this.preLoader = 0;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  // CCstartUpload(): void {
  //   if (this.patientCcmConsent.consentType !== 1) {
  //     this.subs.sink = this.patientService
  //       .AddCCMConsent(
  //         "",
  //         this.patientId,
  //         this.patientCcmConsent.consentType,
  //         this.Signature,
  //         (this.consentNature = 0)
  //       )
  //       .subscribe(
  //         (res) => {
  //           this.ccmInputLoading = false;
  //           // this.getPatientById();
  //           this.getPatientConsentsByPId();
  //           this.toaster.success("Patient Consent Taken.");
  //           this.ccmInputLoading = false;
  //           // this.router.navigate(["/admin/patient/", this.patientId]);
  //         },
  //         (err) => {
  //           // this.preLoader = 0;
  //           this.toaster.error(err.error, err.message);
  //         }
  //       );
  //     // else {
  //     //   this.router.navigate(["/admin/patient/", this.patientId]);
  //     // }
  //   }
  // }
  openConfirmModalForCcm() {
    if (this.patientCcmConsent && this.patientCcmConsent.isConsentTaken) {
      const modalDto = new LazyModalDto();
      modalDto.Title = 'Warning';
      modalDto.Text =
        'Consent has already been taken, would you like to change it?';
      modalDto.callBack = this.callBack;
      modalDto.rejectCallBack = this.rejectCallBack;
      // modalDto.data = data;
      this.appUi.openLazyConfrimModal(modalDto);
    } else {
      this.ccmConsentModal.show();
    }
  }
  rejectCallBack = () => {
    // if (this.patientCcmConsent && this.patientCcmConsent.isConsentTaken) {
    //   this.patientCcmConsentType = this.tempConsentType;
    // }
  }
  callBack = () => {
    // this.tempConsentType = this.patientCcmConsentType;
    // if (this.patientCcmConsentType === 0) {
    //   this.getonlineCCMConsentDoc();
    //   this.onlineConsentModal.show();
    //   this.DeleteWrittenDoc();
    // }
    // if (this.patientCcmConsentType === 2) {
    //   this.DeleteWrittenDoc();
    // }
    // if (this.patientCcmConsentType === 1) {
    //   this.DeleteWrittenDoc();
    //   this.inputEl.nativeElement.click();
    // }
    this.ccmConsentModal.show();
    // this.startUpload();
  }
  aRpmConsentStartUpload(): void {
    if (this.patientRpmConcent.consentType !== 1) {
      this.subs.sink = this.patientService
        .AddCCMConsent(
          this.files2[0],
          this.patientId,
          this.patientRpmConcent.consentType,
          this.Signature,
          (this.consentNature = 1)
        )
        .subscribe(
          (res) => {
            // this.getPatientById();
            this.getPatientConsentsByPId();
            this.toaster.success('Patient Consent Taken.');
            this.getPatientById();
            // this.router.navigate(["/admin/patient/", this.patientId]);
          },
          (err) => {
            // this.preLoader = 0;
            this.toaster.error(err.error, err.message);
          }
        );
    }
    // else {
    //   this.router.navigate(["/admin/patient/", this.patientId]);
    // }
  }
  openConfirmModalForRpm() {
    if (this.patientRpmConcent && this.patientRpmConcent.isConsentTaken) {
      const modalDto1 = new LazyModalDto();
      modalDto1.Title = 'Warning';
      modalDto1.Text =
        'Consent has already been taken, would you like to change it?';
      modalDto1.callBack = this.callBack2;
      modalDto1.rejectCallBack = this.rejectCallBack2;
      // modalDto.data = data;
      this.appUi.openLazyConfrimModal(modalDto1);
    } else {
      // if (this.patientRpmConsentType === 1) {
      //   this.inputE2.nativeElement.click();
      // }
      this.rpmConsentModal.show();
    }
  }
  rejectCallBack2 = () => {
  }
  callBack2 = () => {
    this.rpmConsentModal.show();
  }


  async uploadCCMDocToS3() {
    if (this.patientCcmConsent.consentType === 1) {
      this.ccmInputLoading = true;
      let myDate = new Date();
      const path = `FacilityID-${this.facilityId}/PatientConsents/CcmConsents/${this.files[0].name}`;
      this.awsService.uploadUsingSdk(this.files[0], path).then(
        (data) => {
          this.uploadWrittenDoc(path);
        },
        (error) => {
          this.ccmInputLoading = false;
          this.toaster.error(error.message, error.error || error.error);
        }
      );
    }
  }
  uploadWrittenDoc(path: string): void {
    if (this.patientCcmConsent.consentType === 1) {
      this.ccmInputLoading = true;
      this.subs.sink = this.patientService
        .UploadCcmConsent(
          path,
          this.patientId,
          this.patientCcmConsent.consentType,
          (this.consentNature = 0),
          this.files[0].name
        )
        .subscribe(
          (res) => {
            this.ccmInputLoading = false;
            this.files = new Array<UploadFile>();
            // this.getPatientById();
            this.getPatientConsentsByPId();
            // this.uploadFileUrl = res.fileURL;
            // this.uploadFileName = this.files[0].name;
            this.ccmInputLoading = false;
            this.toaster.success('Patient Consent Taken.');
            this.getPatientById();
            // this.router.navigate(["/admin/patient/", this.patientId]);
          },
          (err) => {
            // this.preLoader = 0;
            this.ccmInputLoading = false;
            // this.uploadFileName = "";
            // this.uploadFileName = "";
            this.toaster.error(err.error, err.message);
          }
        );
    }
  }
  async uploadRPMDocToS3() {
    if (this.patientRpmConcent.consentType === 1) {
      this.rpmInputLoading = true;
      let myDate = new Date();
      const path = `FacilityID-${this.facilityId}/PatientConsents/RpmConsents/${this.files2[0].name}`;
      this.awsService.uploadUsingSdk(this.files2[0], path).then(
        (data) => {
          this.RPMuploadWrittenDoc(path);
        },
        (error) => {
          this.rpmInputLoading = false;
          this.toaster.error(error.message, error.error || error.error);
        }
      );
    }
  }

  RPMuploadWrittenDoc(path: string): void {
    // this.patientCcmConsentType = 1;
    if (this.patientRpmConcent.consentType === 1) {
      this.rpmInputLoading = true;
      this.subs.sink = this.patientService
        .UploadCcmConsent(
          path,
          this.patientId,
          this.patientRpmConcent.consentType,
          (this.consentNature = 1),
          this.files2[0].name
        )
        .subscribe(
          (res) => {
            this.rpmInputLoading = false;
            this.files2 = new Array<UploadFile>();
            // this.getPatientById();
            this.getPatientConsentsByPId();
            // this.uploadFileUrl2 = res.fileURL;
            // this.uploadFileName2 = this.files2[0].name;
            this.rpmInputLoading = false;
            this.toaster.success('Patient Consent Taken.');
            this.getPatientById();
            // this.router.navigate(["/admin/patient/", this.patientId]);
          },
          (err) => {
            // this.preLoader = 0;
            this.rpmInputLoading = false;
            // this.uploadFileName2 = "";
            // this.uploadFileName = "";
            this.toaster.error(err.error, err.message);
          }
        );
    }
  }

  async uploadBhiDocToS3() {
    if (this.patientBhiConcent.consentType === 1) {
      this.rpmInputLoading = true;
      let myDate = new Date();
      const path = `FacilityID-${this.facilityId}/PatientConsents/BhiConsents/${this.files3[0].name}`;
      this.awsService.uploadUsingSdk(this.files3[0], path).then(
        (data) => {
          this.bhiUploadWrittenDoc(path);
        },
        (error) => {
          this.rpmInputLoading = false;
          this.toaster.error(error.message, error.error || error.error);
        }
      );
    }
  }

  bhiUploadWrittenDoc(path: string): void {
    // this.patientCcmConsentType = 1;
    if (this.patientBhiConcent.consentType === 1) {
      this.rpmInputLoading = true;
      this.subs.sink = this.patientService
        .UploadCcmConsent(
          path,
          this.patientId,
          this.patientBhiConcent.consentType,
          (this.consentNature = 3),
          this.files3[0].name
        )
        .subscribe(
          (res) => {
            this.rpmInputLoading = false;
            this.files3 = new Array<UploadFile>();
            // this.getPatientById();
            this.getPatientConsentsByPId();
            // this.uploadFileUrl3 = res.fileURL;
            // this.uploadFileName3 = this.files3[0].name;
            this.rpmInputLoading = false;
            this.toaster.success('Patient Consent Taken.');
            this.getPatientById();
            // this.router.navigate(["/admin/patient/", this.patientId]);
          },
          (err) => {
            // this.preLoader = 0;
            this.rpmInputLoading = false;
            // this.uploadFileName3 = "";
            // this.uploadFileName = "";
            this.toaster.error(err.error, err.message);
          }
        );
    }
  }
  onUploadOutput3(output: any): void {
    this.consentNature = 3;
    this.patientBhiConsentType = 1;
    this.patientBhiConcent.consentType = 1;
    if (output.target.files[0]) {
      this.files3[0] = output.target.files[0];

    }
  }

  DeleteCcmWrittenDoc(myFileUrl: string) {
    if (myFileUrl) {
      this.subs.sink = this.patientService
        .DeleteWrittenDocument(myFileUrl)
        .subscribe(
          (res) => {
            // this.uploadFileName = "";
            this.patientCcmConsent.consentDocName = '';
            this.patientCcmConsent.consentDocUrl = '';
                this.files = new Array<UploadFile>();
                // this.files2 = new Array<UploadFile>();
                // this.files3 = new Array<UploadFile>();
            this.toaster.success('Delete Consent Taken.');
          },
          (err) => {
            this.toaster.error(err.error, err.message);
          }
        );
    }
  }
  DeleteRpmWrittenDoc(myFileUrl: string) {
    if (myFileUrl) {
      this.subs.sink = this.patientService
        .DeleteWrittenDocument(myFileUrl)
        .subscribe(
          (res) => {
            // this.uploadFileName = "";
            this.patientRpmConcent.consentDocName = '';
            this.patientRpmConcent.consentDocUrl = '';
                this.files2 = new Array<UploadFile>();
                // this.files2 = new Array<UploadFile>();
                // this.files3 = new Array<UploadFile>();
            this.toaster.success('Delete Consent Taken.');
          },
          (err) => {
            this.toaster.error(err.error, err.message);
          }
        );
    }
  }
  DeleteBhiWrittenDoc(myFileUrl: string) {
    if (myFileUrl) {
      this.subs.sink = this.patientService
        .DeleteWrittenDocument(myFileUrl)
        .subscribe(
          (res) => {
            // this.uploadFileName = "";
            this.patientBhiConcent.consentDocName = '';
            this.patientBhiConcent.consentDocUrl = '';
                this.files = new Array<UploadFile>();
                // this.files2 = new Array<UploadFile>();
                // this.files3 = new Array<UploadFile>();
            this.toaster.success('Delete Consent Taken.');
          },
          (err) => {
            this.toaster.error(err.error, err.message);
          }
        );
    }
  }
  onUploadOutput(output: any): void {
    this.consentNature = 0;
    this.patientCcmConsentType = 1;
    this.patientCcmConsent.consentType = 1;
    if (output.target.files[0]) {
      this.files[0] = output.target.files[0];
    }

    // if (output.type === 'allAddedToQueue') {
    // } else if (output.type === 'addedToQueue') {
    //   this.files.push(output.file); // add file to array when added
    // } else if (output.type === 'uploading') {
    //   // update current data in files array for uploading file
    //   const index = this.files.findIndex(file => file.id === output.file.id);
    //   this.files[index] = output.file;
    // } else if (output.type === 'removed') {
    //   // remove file from array when removed
    //   this.files = this.files.filter((file: UploadFile) => file !== output.file);
    // } else if (output.type === 'dragOver') {
    //   this.dragOver = true;
    // } else if (output.type === 'dragOut') {
    // } else if (output.type === 'drop') {
    //   this.dragOver = false;
    // }
  }
  onUploadOutput2(output: any): void {
    this.consentNature = 1;
    this.patientRpmConsentType = 1;
    this.patientRpmConcent.consentType = 1;
    if (output.target.files[0]) {
      this.files2[0] = output.target.files[0];
    }
  }
  navigateBack() {
    this.location.back();
  }
  getonlineCCMConsentDoc() {
    this.isLoading = true;
    this.subs.sink = this.patientService
      .getDocumentContent(
        DocumentType.CcmConsentDoc,
        this.patientName,
        this.physicianName
      )
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          this.consentDocument = this.sanatizer.bypassSecurityTrustHtml(res);
          // this.consentDocument = res;
          // console.log(this.consentDocument);
        },
        (err) => {
          this.isLoading = false;
          // this.preLoader = 0;
          this.toaster.error(err.error, err.message);
        }
      );
  }

  MakePDF() {
    let popupWinindow;
    let innerContents = document.getElementById('onlineConset').innerHTML;
    popupWinindow = window.open(
      '',
      '_blank',
      'width=865,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no,resizable=yes, screenX=200, screenY=200, personalbar=no, scrollbars=yes'
    );
    popupWinindow.document.open();
    popupWinindow.document.write(
      '<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' +
        innerContents +
        '</html>'
    );
    popupWinindow.document.close();
    // const signature = "My Signature";
    // const docHead = document.head.outerHTML;
    // const printContents = document.getElementById("onlineConset").outerHTML;
    // const winAttr =
    //   "location=yes, statusbar=no, menubar=no, titlebar=no, toolbar=no,dependent=no, width=865, height=600, resizable=yes, screenX=200, screenY=200, personalbar=no, scrollbars=yes";

    // const newWin = window.open("", "_blank", winAttr);
    // const writeDoc = newWin.document;
    // writeDoc.open();
    // writeDoc.write(
    //   "<!doctype html><html>" +
    //     docHead +
    //     '<body onLoad="window.print()" style="background:none">' +
    //     printContents +
    //     "</body></html>"
    // );
    // writeDoc.close();
    // // newWin.focus();
    // newWin.print();
  }
  appenDsignature() {
    const sjd = document.getElementsByClassName('signature');
    sjd[0].innerHTML = '<span>' + this.Signature + '</span>';
    sjd[1].innerHTML = '<span>' + this.Signature + '</span>';
  }
  copyConsentData(consent: PatientConsents){
    const date = moment(consent.consentDate).format('MMM DD yyyy')
    let text = '';
    if(consent.consentType == ConsentType.Verbal){
       text = `Consent Date: ${date} <br> Consent Type: ${this.consentTypeEnum[consent.consentType]} <br> Note: ${consent.note} <br> I, ${consent.createdBy} certify that patient verbally gave the consent for ${consent.consentNature}`;
      // this.clipboard.copy(text.toString());
    } else {
       text = `Consent Date: ${date} <br> Consent Type: ${this.consentTypeEnum[consent.consentType]} <br> I, ${consent.createdBy} certify that patient verbally gave the consent for ${consent.consentNature}`;
      // this.clipboard.copy(text.toString());
    }
    let mydoc = document;
    const div = mydoc.createElement('div');
    // div.style.display = 'none';
    // const data: string = text;
    div.innerHTML = text;
    mydoc.body.appendChild(div);
    const newData = div.innerText;
    div.remove();
    this.clipboard.copy(newData);
    this.toaster.success('Consent Copied');
  }
  DownloadConsentPdf(consent: PatientConsents) {
    consent['isDownloadingConsentPdf'] = true;
    this.isDownloadingConsentPdf = true;
    consent['pdfProcess'] = true;
    this.patientConsentService.DownloadConsentPdfByConsentId(consent.id).subscribe((res: any) => {
      consent['pdfProcess'] = false;
      FileSaver.saveAs(
              new Blob([res], { type: 'application/pdf' }),
              `${consent.patientName}-${consent.consentNature} Consent.pdf`
            );
    consent['isDownloadingConsentPdf'] = false;
    }, (err) => {
      consent['pdfProcess'] = false;
      consent['isDownloadingConsentPdf'] = false;
      this.toaster.error(err.error, err.message);
    })
  }
}
