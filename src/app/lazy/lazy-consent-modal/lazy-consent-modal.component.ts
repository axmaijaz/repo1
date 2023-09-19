import { PatientConsentService } from './../../core/Patient/patient-consent.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, UploadFile, ToastService } from 'ng-uikit-pro-standard';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';
import { AppUiService } from 'src/app/core/app-ui.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import {
  ConsentNature,
  DocumentType,
} from "src/app/Enums/filterPatient.enum";
import { DomSanitizer } from '@angular/platform-browser';
import { SubSink } from 'src/app/SubSink';
import { PatientConsents } from 'src/app/model/Patient/patient.model';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { CcmDataService } from 'src/app/core/ccm-data.service';
import { HttpResError } from 'src/app/model/common/http-response-error';

@Component({
  selector: 'app-lazy-consent-modal',
  templateUrl: './lazy-consent-modal.component.html',
  styleUrls: ['./lazy-consent-modal.component.scss']
})
export class LazyConsentModalComponent implements OnInit {
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    appendTo: 'body',
    closeOnSelect: true,
    drops:'down'
  };
  @ViewChild('editor12') editor12: ElementRef;
  modalObj = new LazyModalDto();
  consentData = new PatientConsents();
  selectedConsent = new PatientConsents();

  @ViewChild("ccmConsentModal1") ccmConsentModal1: ModalDirective;
  @ViewChild('viewPdfModal') viewPdfModal: ModalDirective;
  IsPatientLoginId: number;
  isLoading: boolean;
  private subs = new SubSink();
  consentDocument: any;
  Signature: "";
  objectURLStrAW = '';
  @ViewChild("signature") signature: ElementRef;
  currentDate: Date | string = new Date();
  // patientConsentNature: ConsentNature;

  constructor(private appUi: AppUiService, private securityService: SecurityService, private patientConsentService: PatientConsentService,
    private patientService: PatientsService, private sanatizer: DomSanitizer, private toaster: ToastService,private datePipe: DatePipe, private ccmDataService: CcmDataService,) {
    appUi.showConsentConfirmationSubject.subscribe((res: LazyModalDto) => {
      this.consentData = new PatientConsents();
      this.Signature = "";
      this.modalObj = res;
      // this.consentData = res.data;
      Object.assign(this.consentData, res.data);
      this.GetConsentNoteByConsentNature(this.consentData);
    });
    this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
  }

  ngOnInit() {
    if (this.securityService.securityObject.userType === UserType.Patient) {
      this.IsPatientLoginId = this.securityService.securityObject.id;
    }
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  proceed() {
    this.ccmConsentModal1.hide();
    const self = this;
    // this.modalObj.callBack(this.consentData);
    const callFunc = this.modalObj.callBack.bind(this);
    const mydata = this.consentData;
    this.patientService.refreshPatient.next();
    callFunc(mydata);
  }
  reject() {
    this.ccmConsentModal1.hide();
    if (this.modalObj.rejectCallBack) {
      const self = this;
      // this.modalObj.callBack(this.consentData);
      const callFunc = this.modalObj.rejectCallBack.bind(this);
      const mydata = this.consentData;
      callFunc(mydata);
    }
  }
  onUploadOutput(output: any): void {
    // this.consentNature = 0;
    // this.patientCcmConsentType = 1;
    // this.patientCcmConsent.consentType = 1;
    if (output.target.files[0]) {
      this.consentData.files = output.target.files[0];
    }
  }
  GetConsentNoteByConsentNature(consent){
    let  data = {
      patientId: consent.patientId,
      consentNature: consent.consentNature1
      }
      this.patientConsentService.GetConsentNoteByConsentNature(data).subscribe((res: any) => {
        console.log(res);
        this.consentData.note = res.note;
        this.ccmConsentModal1.show();
      }, (err: HttpResError) => {
        this.toaster.error(err.error);
      })
    }
  DeleteWrittenDocument(myFileUrl: string) {
    if (myFileUrl) {
      this.patientService
        .DeleteWrittenDocument(myFileUrl)
        .subscribe(
          (res) => {
            // this.uploadFileName = "";
            this.consentData.consentDocName = '';
            this.consentData.consentDocUrl = '';
            // this.consentData.files = new UploadFile();
            this.toaster.success("Delete Consent Taken.");
          },
          (err) => {
            this.toaster.error(err.error, err.message);
          }
        );
    }
  }
  getonlineConsentDoc() {
    // this.ccmConsentModal1.hide();
    this.isLoading = true;
    this.subs.sink = this.patientService
      .getDocumentContent(
        DocumentType.CcmConsentDoc,
        this.consentData.patientName,
        this.consentData.patientBillingProviderName
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
  // addPatientCcmConsent() {
  //   this.isLoading = true;
  //   let data = {
  //     patientId: this.consentData.patientId,
  //     consentType: this.consentData.consentType,
  //     signature: this.Signature,
  //     consentNature: this.consentData.consentNature1,
  //     consentDate: this.consentData.consentDate,
  //     note: this.consentData.note,
  //   }
  //   this.subs.sink = this.patientConsentService
  //     .AddPatientConsent(data)
  //     .subscribe(
  //       (res: PatientConsents[]) => {
  //         this.Signature = '';
  //         this.getPatientConsentsByPId();
  //         this.isLoading = false;
  //         this.ccmConsentModal1.hide();
  //         // this.rpmConsentModal.hide();
  //         // this.bhiConsentModal.hide();
  //         this.toaster.success("Patient Consent Taken.");
  //       },
  //       (err) => {
  //         this.Signature = '';
  //         this.isLoading = false;
  //         this.toaster.error(err.error, err.message);
  //       }
  //     );
  // }
  MakePDF() {
    let popupWinindow;
    let innerContents = document.getElementById("onlineConset1").innerHTML;
    popupWinindow = window.open(
      "",
      "_blank",
      "width=865,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no,resizable=yes, screenX=200, screenY=200, personalbar=no, scrollbars=yes"
    );
    popupWinindow.document.open();
    popupWinindow.document.write(
      '<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' +
        innerContents +
        "</html>"
    );
    popupWinindow.document.close();
  }
  appenDsignature() {
    const sjd = document.getElementsByClassName("signature");
    sjd[0].innerHTML = "<span>" + this.consentData['Signature'] + "</span>";
    sjd[1].innerHTML = "<span>" + this.consentData['Signature'] + "</span>";
  }
  // consentNature1
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
}
