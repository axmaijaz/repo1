import { Key } from 'protractor';
import { AwDataService } from './../../core/annualWellness/aw-data.service';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { Router, ActivatedRoute } from '@angular/router';
import { AwService } from 'src/app/core/annualWellness/aw.service';
import { AWPhysiciantabEncounterDto, AWSectionDto, AWQuestionDto, SignAwEncounterDto, SendAWToPatientDto } from 'src/app/model/AnnualWellness/aw.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { Location } from '@angular/common';
import { AppUiService } from 'src/app/core/app-ui.service';
import { LazyModalDto, VerifyModalDto } from 'src/app/model/AppModels/app.model';
import { SecurityService } from 'src/app/core/security/security.service';
import * as moment from 'moment';
import FileSaver from 'file-saver';
import { environment } from 'src/environments/environment';
import { EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { AppDataService } from 'src/app/core/app-data.service';
import { CreateFacilityUserDto, FacilityFormsDto } from 'src/app/model/Facility/facility.model';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';

@Component({
  selector: 'app-aw-physician-tab',
  templateUrl: './aw-physician-tab.component.html',
  styleUrls: ['./aw-physician-tab.component.scss']
})
export class AwPhysicianTabComponent implements OnInit, AfterViewInit {
  tobacoHtml = `<ul>
  <li>99406 – Smoking and tobacco\n use cessation \n counseling visit intermediate, greater than 3 minutes up to 10 minutes</li>
  <li>99407 – Smoking and tobacco use cessation \n counseling visit intensive, greater than 10 minutes</li>
  </ul>
  `;
  alcoholHtml = `<ul>
  <li>G0442 – Annual alcohol misuse screening, 15 minutes</li>
  <li>G0443 – Brief face-to-face behavioral counseling for alcohol misuse, 15 minutes</li>
  </ul>
  `;
  BehavioralHTML = `<ul>
  <li>G0447 – Face-to-face behavioral counseling for obesity, 15 minutes</li>
  <li>G0473 – Face-to-face behavioral counseling for obesity, group (2–10), 30 minutes</li>
  </ul>
  `;
  awHtml = `<ul>
  <li>	G0438 – Annual wellness visit; includes a personalized prevention plan of service (pps), initial visit</li>
  <li>	G0439 – Annual wellness visit, includes a personalized prevention plan of service (pps), subsequent visit</li>
  <li>	G0468 – Federally qualified health center (fqhc) visit, ippe
   or awv; a fqhc visit that includes an initial preventive physical examination (ippe) or annual
   wellness visit (awv) and includes a typical bundle of medicare-covered services that would be
   furnished per diem to a patient receiving an ippe or awv</li>
  </ul>`;
  PatientId: number;
  abc = '2020-10-15T00:00:00';
  annualWellnessID: number;
  isLoadingPTABData: boolean;
  awEncounterPTabDto = new AWPhysiciantabEncounterDto();
  sendToPatienTDto = new SendAWToPatientDto();
  pTabDataObj: any;
  SaveEncounterTabData: boolean;
  facilityUserList: CreateFacilityUserDto[];
  isBillingProvider: boolean;
  billingProviderId: number;
  signingAWEncounter: boolean;
  signature: string;
  sendingToPatient: boolean;
  cessationNotApplicable: boolean;
  ldctNotApplicable: boolean;
  providerName: string;
  isLoadingZip: boolean;
  disableBmiFields = false;
  @ViewChild('textarea') textarea: ElementRef;
  gapsData: string;
  currentUserName: string;
  facilityId: number;
  signAwDto = new SignAwEncounterDto();
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD hh:mm a',
    disableKeypress: true,
    appendTo: 'body'
  };
  public datePickerConfig1: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    disableKeypress: true,
    appendTo: 'body'
  };
  facilityFormsDto = new FacilityFormsDto();
  patientFormsDto = new FacilityFormsDto();
  encounterDate: string;
  cordinatorId: number;
  isMatchDates: boolean;

  constructor(private location: Location, private securityService: SecurityService, private eventBus: EventBusService,
    private appUi: AppUiService, private toaster: ToastService, private router: Router, private route: ActivatedRoute, private awService: AwService,
    private appDataService: AppDataService, private facilityService: FacilityService, public awDataService: AwDataService) {

    }
  public scrollbarOptionsTimeline = {
    axis: 'y',
    theme: 'light-3',
    scrollInertia: 2,
    scrollButtons: { enable: true },
    autoHideScrollbar: true,
    scrollbarPosition: 'inside'
  };
  ngOnInit() {
    // this.cordinatorId = this.awDataService.careCordinatorId;
    this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get('id');
    this.annualWellnessID = +this.route.pathFromRoot[3].snapshot.paramMap.get('awId');
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    // this.providerName = this.securityService.securityObject.fullName;
    this.currentUserName = this.securityService.securityObject.fullName;
    if (this.securityService.hasClaim('IsBillingProvider')) {
      this.isBillingProvider = true;
      this.billingProviderId = this.securityService.securityObject.id;
      this.providerName = this.securityService.securityObject.fullName;
    }
    this.GetFacilityForms();
    this.GetPatientCustomForms();
    this.GetAWEncounterPatientTabById();
    this.eventBus.on(EventTypes.GapsDataChanged).subscribe((res) => {
      this.GetAWEncounterPatientTabById();
    });
    this.eventBus.on(EventTypes.AwSyncingCheckbox).subscribe((res) => {
      // this.GetIsSyncFromAnnualWellness(this.annualWellnessID);
      // this.awEncounterPTabDto.isSyncDisabled = res;
      if (res) {
       this.awEncounterPTabDto.gapsData = res;
      }

    });
    this.getFacilityUsersList();
  }
  changeEncounterdate(event) {
      if (event.date) {
        const day = moment(event.date).format('YYYY-MM-DD');
        this.encounterDate = day;
        this.UpdateEncounterDate();

      }

  }
  UpdateEncounterDate() {
    this.awService.UpdateEncounterDate(this.annualWellnessID, this.encounterDate).subscribe(
      (res) => {
        this.toaster.success('Updated Successfully')
        this.GetAWEncounterPatientTabById();
      },
      (error: HttpResError) => {
        // this.IsLoading = true;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetPatientCustomForms() {
    // this.selectedFacilityId = row.id;
    this.facilityService.GetPatientCustomForms(this.PatientId, this.annualWellnessID).subscribe(
      (res: FacilityFormsDto) => {

        this.patientFormsDto = res;
        // this.awService.patientFormsDto = res;
      },
      (error: HttpResError) => {
        // this.IsLoading = true;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetFacilityForms() {
    // this.selectedFacilityId = row.id;
    this.facilityService.GetFacilityForms(this.facilityId).subscribe(
      (res: FacilityFormsDto) => {

        this.facilityFormsDto = res;
      },
      (error: HttpResError) => {
        // this.IsLoading = true;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  ngAfterViewInit() {
    this.textarea.nativeElement.focus();

  }
  saveTempGapsData() {
    if (this.awEncounterPTabDto.isSyncDisabled) {
      this.appDataService.awGapsData = this.awEncounterPTabDto.gapsData;
    }
  }
  getFacilityUsersList() {
    this.facilityService.getFacilityUserList(this.facilityId).subscribe(
      (res: any) => {
        this.facilityUserList = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  copyData(data: string) {
    const textArea = document.createElement('textarea');
    // textArea.style.display = 'none';
    textArea.value = data;
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999);
    document.execCommand('copy');
    textArea.remove();
    this.toaster.success('Content Copied');
  }
  GetIsSyncFromAnnualWellness(annualWellnessID) {
    this.awService.GetIsSyncFromAnnualWellness(annualWellnessID).subscribe(
      (res: boolean) => {
        this.awEncounterPTabDto.isSyncDisabled = res;
        // this.toaster.success("");
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  checkDate() {
    if (moment(this.signAwDto.signatureDate).local().format('YYYY-MM-DD') == moment(this.signAwDto.encounterDate).local().format('YYYY-MM-DD')) {
      this.isMatchDates = true;
    } else {
      this.isMatchDates = false;
    }
  }
  GetAWEncounterPatientTabById() {
    this.isLoadingPTABData = true;
    this.awService.GetAWEncounterPhysicianTabById(this.annualWellnessID).subscribe((res: AWPhysiciantabEncounterDto) => {
      this.awEncounterPTabDto = res;
      this.gapsData = res.gapsData;
      if (this.awEncounterPTabDto.socialHistoryData.currentlyUsingTobacco && this.awEncounterPTabDto.socialHistoryData.currentlyUsingTobacco === 'No') {
        this.cessationNotApplicable = true;
        if (this.awEncounterPTabDto.tobaccoCessationCounseling) {
          this.awEncounterPTabDto.tobaccoCessationCounseling = false;
          setTimeout(() => {
            this.EditAWEncounterNotes();
          }, 1000);
        }
      }
      if (this.awEncounterPTabDto.socialHistoryData.currentlyUsingTobacco && this.awEncounterPTabDto.socialHistoryData.currentlyUsingTobacco === 'Yes') {
        if (!this.awEncounterPTabDto.tobaccoCessationCounseling) {
          this.awEncounterPTabDto.tobaccoCessationCounseling = true;
          setTimeout(() => {
            this.EditAWEncounterNotes();
          }, 1000);
        }
      }
      this.checkIfTobaccoCptIsEmpty();
      this.checkIfObasityCptIsEmpty();
      this.checkIfLDCTApplicable();
      this.awEncounterPTabDto.awv = true;
      if (!this.awEncounterPTabDto.awvCode && !this.awEncounterPTabDto.medicadeCPTCode) {
        this.awEncounterPTabDto.awvCode = 'G0439';
        // this.awEncounterPTabDto.awvCode = 'G0438';
      }
      if (this.awEncounterPTabDto.phqScore) {
        this.awEncounterPTabDto.annuallDepressionScreening = true;
      } else {
        this.awEncounterPTabDto.annuallDepressionScreening = false;
      }
      if (this.awEncounterPTabDto.alcoholScreenResult) {
        this.awEncounterPTabDto.alcoholMisuseScreening = true;
      } else {
        this.awEncounterPTabDto.alcoholMisuseScreening = false;
      }
      if (this.awEncounterPTabDto.bmi) {
        const bmiVal = +this.awEncounterPTabDto.bmi;
        if (bmiVal && bmiVal > 0 && bmiVal < 30) {
          this.disableBmiFields = true;
          this.awEncounterPTabDto.faceToFaceObesity = false;
          this.awEncounterPTabDto.faceToFaceObesityCode = '';
        }
      }
      setTimeout(() => {
        this.EditAWEncounterNotes();
      }, 1000);
      if (!this.awEncounterPTabDto.amScreeningCompleted) {
        this.awEncounterPTabDto.alcoholScreenResult = '';
        this.awEncounterPTabDto.alcoholMisuseScreening = false;
      }
      if (!this.awEncounterPTabDto.depressionScreeningCompleted) {
        this.awEncounterPTabDto.phqScore = '';
        this.awEncounterPTabDto.annuallDepressionScreening = false;
      }
      if (this.appDataService.awGapsData && this.awEncounterPTabDto.isSyncDisabled) {
        this.awEncounterPTabDto.gapsData = this.appDataService.awGapsData;
      }
      this.isLoadingPTABData = false;
    },
      (err: HttpResError) => {
        // this.isLoadingPTABData = false;
        // this.isCreatingEncounter = false;
        this.toaster.error(err.error, err.message);
      });
  }
  nullCPTCodeValue(prop: string, value: string) {
    let data = {
      property: prop,
      value: value
    }
    if (value) {
      this.openConfirmModalforCpt(data);
    }
  }
  openConfirmModalforCpt(data: any) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Uncheck Value";
    modalDto.Text = `${data.value} is checked do you want to uncheck it?`;
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.awEncounterPTabDto[data.property] = '';
    this.EditAWEncounterNotes();
  }
  checkIfTobaccoCptIsEmpty(code?: number) {
    if (!this.cessationNotApplicable && this.awEncounterPTabDto.tobaccoCessationCounseling && !this.awEncounterPTabDto.tobaccoCessationCounselingCode) {
      this.awEncounterPTabDto.tobaccoCessationCounselingCode = '99406';
    }
    if (this.awEncounterPTabDto.tobaccoCessationCounselingCode && code === 1) {
      this.awEncounterPTabDto.tobaccoCessationCounseling = true;
    }
    if (!this.awEncounterPTabDto.tobaccoCessationCounseling && code === 2) {
      this.awEncounterPTabDto.tobaccoCessationCounselingCode = '';
    }
    if (!this.awEncounterPTabDto.tobaccoCessationCounseling) {
      this.awEncounterPTabDto.tobaccoCessationCounselingCode = '';
    }
  }
  checkIfObasityCptIsEmpty(code?: number) {
    if (!this.disableBmiFields && this.awEncounterPTabDto.faceToFaceObesity && !this.awEncounterPTabDto.faceToFaceObesityCode) {
      this.awEncounterPTabDto.faceToFaceObesityCode = 'G0447';
    }
    if (this.awEncounterPTabDto.faceToFaceObesityCode && code === 1) {
      this.awEncounterPTabDto.faceToFaceObesity = true;
    }
    if (!this.awEncounterPTabDto.faceToFaceObesity && code === 2) {
      this.awEncounterPTabDto.faceToFaceObesityCode = '';
    }
  }
  checkIfLDCTApplicable() {
    const obj = this.awEncounterPTabDto.socialHistoryData;
    if (obj ) {
      if (obj.everUsedTobacco === 'No' || (+obj.noOfYears * +obj.packsPerDay < 30) || obj.lungCancer !== 'No' || obj.currentSmokerOrQuitIn15Years !== 'Yes') {
        this.ldctNotApplicable = true;
        if (this.awEncounterPTabDto.ldctCounseling) {
          this.awEncounterPTabDto.ldctCounseling = false;
          this.EditAWEncounterNotes();
        }
      }
      if (obj.everUsedTobacco === 'Yes' && (+obj.noOfYears * +obj.packsPerDay > 30) && obj.lungCancer === 'No' && obj.currentSmokerOrQuitIn15Years === 'Yes') {
        if (!this.awEncounterPTabDto.ldctCounseling) {
          this.awEncounterPTabDto.ldctCounseling = true;
          this.EditAWEncounterNotes();
        }
      }
    }
  }
  uncheckFTFRadioProp() {
    this.awEncounterPTabDto.faceToFaceObesityCode = '';
    this.awEncounterPTabDto.faceToFaceObesity = false;
    this.EditAWEncounterNotes();
  }
  uncheckTobaccoRadioProp() {
    this.awEncounterPTabDto.tobaccoCessationCounselingCode = '';
    this.awEncounterPTabDto.tobaccoCessationCounseling = false;
    this.EditAWEncounterNotes();
  }
  EditAWEncounterNotes() {
    this.SaveEncounterTabData = true;
    if (!this.awEncounterPTabDto.assignedBillingProviderId) {
      this.awEncounterPTabDto.assignedBillingProviderId = null;
    }
    this.awService.EditAWEncounterNotes(this.awEncounterPTabDto).subscribe((res: AWPhysiciantabEncounterDto) => {
      // this.awEncounterPTabDto = res;
      this.SaveEncounterTabData = false;
    },
      (err: HttpResError) => {
        this.SaveEncounterTabData = false;
        // this.isCreatingEncounter = false;
        this.toaster.error(err.error, err.message);
      });
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
      this.billingProviderId = data;
      this.isBillingProvider = true;
      this.providerName = name ? name : '';
      this.toaster.success('Provider changed');
    } else {
      this.isBillingProvider = false;
      this.toaster.error('Password is incorrect');
    }

  }
  initializeSignModal() {
    this.signAwDto = new SignAwEncounterDto();
    this.signAwDto.awEncounterId = this.annualWellnessID;
    this.signAwDto.billingProviderId = this.billingProviderId;
    this.signAwDto.signature = this.providerName;
    this.signAwDto.humanaMemberId = this.awEncounterPTabDto.humanaMemberId;
    this.signAwDto.signatureDate = moment().local().format('YYYY-MM-DD hh:mm a');
    this.signAwDto.encounterDate = moment(this.awEncounterPTabDto.encounterDate).local().format('YYYY-MM-DD');
    if (this.facilityFormsDto.hasHumana && this.patientFormsDto.hasHumana) {
      this.signAwDto.signHumana = true;
    }
    if (this.facilityFormsDto.hasSuperBill && this.patientFormsDto.hasSuperBill) {
      this.signAwDto.signSuperBill = true;
    }
    this.checkDate();
  }
  SignAWEncounter(modal: ModalDirective) {
    this.signingAWEncounter = true;
    this.awService.SignAWEncounter(this.signAwDto).subscribe((res: AWPhysiciantabEncounterDto) => {
      // this.awEncounterPTabDto = res;
      modal.hide();
      this.signingAWEncounter = false;
      setTimeout(() => {
        this.router.navigateByUrl(`/pcm/encounters/${this.PatientId}`);
      }, 500);
    },
      (err: HttpResError) => {
        this.signingAWEncounter = false;
        // this.isCreatingEncounter = false;
        this.toaster.error(err.error, err.message);
      });
  }
  OPenPatientTab() {
    let url = '';
    //  url = "http://localhost:4200/teleCare/vCall";
    if (environment.production === true) {
      url = `https://app.2chealthsolutions.com/awForm/awPatient/${this.PatientId}/${this.annualWellnessID}`;
    } else {
      url = `${environment.appUrl}awForm/awPatient/${this.PatientId}/${this.annualWellnessID}`;
    }
    window.open(url, '_blank');
  }
  openConfirmModal() {
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Refresh Gaps Data';
    modalDto.Text = 'Changes you made in Gaps Data may be lost, Do you want to refresh ?';
    modalDto.callBack = this.RefreshGapsData;
    // modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  RefreshGapsData = () => {
    this.awService.RefreshGapsData(this.annualWellnessID).subscribe(
      (res: any) => {
        if (res) {
          this.awEncounterPTabDto.gapsData = res.gapsData;
         }
         this.toaster.success('Gaps data refreshed');
        // this.isSyncDisabled = res;
        // this.EmitEventForGapDataChange();
        // this.toaster.success("");
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  DownLoadPdf() {
    this.isLoadingZip = true;
    let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
    nUrl =  environment.appUrl;
    nUrl = nUrl + 'success/loading';
    const importantStuff = window.open(nUrl);
    this.awService
      .GetAnnualWellnessPdf(this.annualWellnessID)
      .subscribe(
        (res: any) => {
          this.isLoadingZip = false;
          const file = new Blob([res], { type: 'application/pdf' });
          const fileURL = window.URL.createObjectURL(file);
          importantStuff.location.href = fileURL;
          // FileSaver.saveAs(
          //   new Blob([res], { type: 'application/pdf' }),
          //   `${this.appDataService.summeryViewPatient.firstName.charAt(0)}${this.appDataService.summeryViewPatient.lastName.charAt(0)}-(${this.appDataService.summeryViewPatient.patientEmrId})-Annual-wellness.pdf`
          // );
        },
        (err: any) => {
          this.isLoadingZip = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  SendToPatient(modal: ModalDirective) {
    this.sendingToPatient = true;
    this.sendToPatienTDto.awEncounterId = this.annualWellnessID;
    let url = '';
    //  url = "http://localhost:4200/teleCare/vCall";
    if (environment.production === true) {
      url = `https://app.2chealthsolutions.com/awForm/awPatient/${this.PatientId}/${this.annualWellnessID}`;
    } else {
      url = `${environment.appUrl}awForm/awPatient/${this.PatientId}/${this.annualWellnessID}`;
    }
    this.sendToPatienTDto.urlLink = url;
    this.awService.SendToPatient(this.sendToPatienTDto).subscribe((res: AWPhysiciantabEncounterDto) => {
      // this.awEncounterPTabDto = res;
      modal.hide();
      this.sendingToPatient = false;
    },
      (err: HttpResError) => {
        this.sendingToPatient = false;
        // this.isCreatingEncounter = false;
        this.toaster.error(err.error, err.message);
      });
  }
}
