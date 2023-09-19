import { PcmService } from './../../../core/pcm/pcm.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AwService } from 'src/app/core/annualWellness/aw.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { HumanaResDto, HumanaDto, BreastCancerScreening, DiabeticNephropathy, DiabeticEyeCare, Labs, RaManagement, OsteoporosisManagement, DiabeticFootExam, MedicalHistory, HumanaDiagnosis, CurrentMedication, HumanaCareGapParamsDto } from 'src/app/model/AnnualWellness/humana.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { ModalDirective, PopoverDirective, ToastService } from 'ng-uikit-pro-standard';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import FileSaver from 'file-saver';
import { ClonerService } from 'src/app/core/cloner.service';
import { AwsService } from 'src/app/core/aws/aws.service';
import { AppDataService } from 'src/app/core/app-data.service';
import { environment } from 'src/environments/environment';
import moment from 'moment';
import { GapStatus, PCMeasureDataListDto, PcmMeasureDataObj } from 'src/app/model/pcm/pcm.model';
import { Clipboard } from '@angular/cdk/clipboard';
import { EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { AwDataService } from 'src/app/core/annualWellness/aw-data.service';

@Component({
  selector: 'app-humana-form-detail',
  templateUrl: './humana-form-detail.component.html',
  styleUrls: ['./humana-form-detail.component.scss']
})
export class HumanaFormDetailComponent implements OnInit {
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    appendTo: 'body',
    disableKeypress: true,
    drops:'down'
  };
  public datePickerConfig1: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD hh:mm a',
    appendTo: 'body',
    disableKeypress: true,
    drops:'down'
  };
  loadingHumanaData: boolean;
  OtherRaceSelect: boolean;
  PatientId: number;
  annualWellnessID: number;
  billingProviderId: number;
  isBillingProvider: boolean;
  humanaResObj = new HumanaResDto();
  tempHumanaDiagnosis = new Array<HumanaDiagnosis>();
  editingHumanaData: boolean;
  raceOrEthnicity: string;
  activeTabId = 1;
  rememberThreeObj = {
    one: false,
    two: false,
    three: false
  };
  raceOrEhinicityList = [
    'HispanicLatine',
    'AmericanIndian',
    'Alaska',
    'Black',
    'African',
    'AsiaIndia',
    'NativeHawaiian',
    'OtherPacific',
    'White',
  ];
  isLoadingZip: boolean;
  footExamFindingList1 = new Array<{text: string, active: boolean}>();
  footExamFindingList2 = new Array<{text: string, active: boolean}>();
  footExamFindingList3 = new Array<{text: string, active: boolean}>();
  diagnoseTreatmentArr = [
    {text: 'Medication', active: false},
    {text: 'Monitor', active: false},
    {text: 'Diet', active: false},
    {text: 'Labs', active: false},
    {text: 'Referrals', active: false},
    {text: 'Other', active: false},
  ];
  isLoadingPublic: boolean;
  isLoadingZipHM: boolean;
  objectURLStr: string;
  objectURLStrAW: string;
  pcmModelLoading: boolean;
  gapData = new PcmMeasureDataObj();
  gapStatusEnum = GapStatus;
  pCMeasureDataListDto = new PCMeasureDataListDto();
  Codes = new Array<string>();
  refreshHumanaGapsDto = new HumanaCareGapParamsDto();
  isSign: boolean;
  healthCareProviderSignature: string;

  constructor(private route: ActivatedRoute, private awsService: AwsService, private appDataService: AppDataService, private pcmService: PcmService,private clipboard: Clipboard,
    private cloneService: ClonerService, private awService: AwService, public awDataService: AwDataService, private securityService: SecurityService,private eventBus: EventBusService, private toaster: ToastService) { }

    ngOnInit(): void {
      this.Codes = ['PV','IV','DE','SM','CC'];
    this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get('id');
    this.annualWellnessID = +this.route.pathFromRoot[3].snapshot.paramMap.get('awId');
    if (this.securityService.hasClaim('IsBillingProvider')) {
      this.isBillingProvider = true;
      this.billingProviderId = this.securityService.securityObject.id;
    }
    this.GetHumanaForm();
    this.getMeasureDataByCode();
    this.eventBus.on(EventTypes.GapsDataChanged).subscribe((res) => {
      this.getMeasureDataByCode();
      this.GetHumanaForm();
    });
  }
  getMeasureDataByCode() {
      this.pcmModelLoading = true;
      this.gapData = new PcmMeasureDataObj();
      this.pcmService
        .GetPCMeasureDataList(this.PatientId, this.Codes)
        .subscribe(
          (res: PCMeasureDataListDto) => {
            if (res.colorectalCancerScreening) {
              if (res.colorectalCancerScreening.lastDone) {
                res.colorectalCancerScreening.lastDone = moment.utc(res.colorectalCancerScreening.lastDone).local().format('YYYY-MM-DD');
              }
              if (res.colorectalCancerScreening.nextDue) {res.colorectalCancerScreening.nextDue = moment.utc(res.colorectalCancerScreening.nextDue).local().format('YYYY-MM-DD');}
              this.pCMeasureDataListDto = res;
            } else {
              res.colorectalCancerScreening = new PcmMeasureDataObj();
            }
            if (res.breastCancerScreening) {
              if (res.breastCancerScreening.lastDone) {
                res.breastCancerScreening.lastDone = moment.utc(res.breastCancerScreening.lastDone).local().format('YYYY-MM-DD');
              }
              if (res.breastCancerScreening.nextDue) {res.breastCancerScreening.nextDue = moment.utc(res.breastCancerScreening.nextDue).local().format('YYYY-MM-DD');}
              this.pCMeasureDataListDto = res;
            } else {
              res.breastCancerScreening = new PcmMeasureDataObj();
            }
            if (res.diabeticNephropathy) {
              if (res.diabeticNephropathy.lastDone) {
                res.diabeticNephropathy.lastDone = moment.utc(res.diabeticNephropathy.lastDone).local().format('YYYY-MM-DD');
              }
              if (res.diabeticNephropathy.nextDue) {res.diabeticNephropathy.nextDue = moment.utc(res.diabeticNephropathy.nextDue).local().format('YYYY-MM-DD');}
              this.pCMeasureDataListDto = res;
            } else {
              res.diabeticNephropathy = new PcmMeasureDataObj();
            }
            if (res.diabeticEyeCare) {
              if (res.diabeticEyeCare.lastDone) {
                res.diabeticEyeCare.lastDone = moment.utc(res.diabeticEyeCare.lastDone).local().format('YYYY-MM-DD');
              }
              if (res.diabeticEyeCare.nextDue) {res.diabeticEyeCare.nextDue = moment.utc(res.diabeticEyeCare.nextDue).local().format('YYYY-MM-DD');}
              this.pCMeasureDataListDto = res;
            } else {
              res.diabeticEyeCare = new PcmMeasureDataObj();
            }
            if (res.influenzaVaccine) {
              if (res.influenzaVaccine.lastDone) {
                res.influenzaVaccine.lastDone = moment.utc(res.influenzaVaccine.lastDone).local().format('YYYY-MM-DD');
              }
              if (res.influenzaVaccine.nextDue) {res.influenzaVaccine.nextDue = moment.utc(res.influenzaVaccine.nextDue).local().format('YYYY-MM-DD');}
              this.pCMeasureDataListDto = res;
            } else {
              res.influenzaVaccine = new PcmMeasureDataObj();
            }
            if (res.pneumococcalVaccine) {
              if (res.pneumococcalVaccine.lastDone) {
                res.pneumococcalVaccine.lastDone = moment.utc(res.pneumococcalVaccine.lastDone).local().format('YYYY-MM-DD');
              }
              if (res.pneumococcalVaccine.nextDue) {res.pneumococcalVaccine.nextDue = moment.utc(res.pneumococcalVaccine.nextDue).local().format('YYYY-MM-DD');}
              this.pCMeasureDataListDto = res;
            } else {
              res.pneumococcalVaccine = new PcmMeasureDataObj();
            }
            this.pcmModelLoading = false;
          },
          (err: HttpResError) => {
            this.pcmModelLoading = false;
            this.toaster.error(err.error, err.message);
          }
        );
  }
  copy(gapData: PcmMeasureDataObj) {
    const fPDto = new PcmMeasureDataObj();
    for (const Prop in gapData) {
      if (
        gapData[Prop] === null ||
        gapData[Prop] === undefined
      ) {
        gapData[Prop] = fPDto[Prop];
      }
    }
const div = document.createElement('div');
    const str = `<div class="p-2" #cctt>
    <p class="mb-2"><strong style="min-width:75px;display:inline-block;">Status: </strong>
        ${this.gapStatusEnum[gapData.currentStatus]}
    </p>
    <p class="mb-2"><strong style="min-width:75px;display:inline-block;">Last Done: </strong>
    <span>${gapData.lastDone}</span>
    </p>
    <p class="mb-2"><strong style="min-width:75px;display:inline-block;">Result: </strong>
    <span>${gapData.result}</span>
    </p>
    <p class="mb-2"><strong style="min-width:75px;display:inline-block;">Note: </strong>
    <span>${gapData.note}</span>
    </p>
    <p class="mb-2"><strong style="min-width:75px;display:inline-block;">Next Due: </strong>
    <span>${gapData.nextDue}</span>
    </p>
</div>`
      // textArea.style.display = 'none';
      div.innerHTML = str;
      document.body.appendChild(div);
      const text = div.innerText;
      // div.setSelectionRange(0, 99999);
      this.clipboard.copy(text);
      // document.execCommand('copy');

      div.remove();
      this.toaster.success('Content Copied');
  }
  GetHumanaForm() {
    this.loadingHumanaData = true;
    this.awService.GetHumanaForm(this.annualWellnessID).subscribe((res: HumanaResDto) => {
      if (!res.humanaDto) {
        res.humanaDto = new HumanaDto();
      }
      this.humanaResObj = res;
      this.footExamFindingList1 = [];
      this.footExamFindingList2 = [];
      this.footExamFindingList3 = [];
      if (this.humanaResObj.humanaDto.diabeticFootExam && this.humanaResObj.humanaDto.diabeticFootExam.length && this.humanaResObj.humanaDto.diabeticFootExam.length === 3) {
        this.humanaResObj.humanaDto.diabeticFootExam.forEach((x, iIndex) => {
          const fList = new Array<{text: string, active: boolean}>();
          if (!x.findingList) {
            return;
          }
          const fillFList = x.findingList.split(',');
          fillFList.forEach(y => {
            fList.push({text: y, active: false});
          });
          if (x.findings) {
            const fillF = x.findings.split(',');
            fillF.forEach(y => {
              fList.forEach(z => {
                if (z.text === y) {
                  z.active = true;
                }
              });
            });
          }

          this[`footExamFindingList${iIndex + 1}`] = fList;
        });
      }
      if (this.humanaResObj.humanaDto.humanaDiagnosis && this.humanaResObj.humanaDto.humanaDiagnosis.length) {
        this.tempHumanaDiagnosis = JSON.parse(JSON.stringify(this.humanaResObj.humanaDto.humanaDiagnosis));
        this.tempHumanaDiagnosis.forEach(item => {
          const optionsTemp = JSON.parse(JSON.stringify(this.diagnoseTreatmentArr));
          if (item.treatmentPlan) {
            const selectedArr = item.treatmentPlan.split(',');
            selectedArr.forEach(y => {
              const markOption = optionsTemp.find(f => f.text === y);
              if (markOption) {
                markOption.active = true;
              }
            });
          }
          item['OptionsList'] = optionsTemp;
        });
      }
      this.FillRememberCheckedManage();
      this.loadingHumanaData = false;
      if (this.humanaResObj.humanaDto.patientInfo.raceOrEthnicity) {
        const find = this.raceOrEhinicityList.find(x => x === this.humanaResObj.humanaDto.patientInfo.raceOrEthnicity);
        if (!find) {
          this.OtherRaceSelect = true;
          this.raceOrEthnicity = this.cloneService.deepClone(this.humanaResObj.humanaDto.patientInfo.raceOrEthnicity);
        }
      }
      if (this.humanaResObj.humanaDto.isDiabetic===false) {
        this.humanaResObj.humanaDto.diabeticNephropathy.applicable = true;
        this.humanaResObj.humanaDto.diabeticEyeCare.applicable = true;
        if (this.humanaResObj.humanaDto.diabeticFootExam && this.humanaResObj.humanaDto.diabeticFootExam.length) {
          this.humanaResObj.humanaDto.diabeticFootExam[0].applicable = true;
        }
        // this.resetdiabaticFootExam();
        // this.resetdiabaticEyeCare();
        // this.resetdiabeticNephropathy();
      }
      if (this.humanaResObj.humanaDto.healthCareProviderSignature) {
        this.isSign = true;
        this.healthCareProviderSignature = 'Electronically Signed By: ' + this.humanaResObj.humanaDto.healthCareProviderSignature;

      }
    }, (res: HttpResError) => {
      this.loadingHumanaData = false;
      this.toaster.error(res.error, res.message);
    });
  }

  FillRememberCheckedManage() {
    this.humanaResObj.humanaDto.cognitiveImpairement.repeatedWordOne === 'Banana' ? this.rememberThreeObj.one = true : this.rememberThreeObj.one = false;
    this.humanaResObj.humanaDto.cognitiveImpairement.repeatedWordTwo === 'Sunrise' ? this.rememberThreeObj.two = true : this.rememberThreeObj.two = false;
    this.humanaResObj.humanaDto.cognitiveImpairement.repeatedWordThree === 'Chair' ? this.rememberThreeObj.three = true : this.rememberThreeObj.three = false;

  }
  RememberCheckedManage() {
    this.rememberThreeObj.one ? this.humanaResObj.humanaDto.cognitiveImpairement.repeatedWordOne = 'Banana' : this.humanaResObj.humanaDto.cognitiveImpairement.repeatedWordOne = '';
    this.rememberThreeObj.two ? this.humanaResObj.humanaDto.cognitiveImpairement.repeatedWordTwo = 'Sunrise' : this.humanaResObj.humanaDto.cognitiveImpairement.repeatedWordTwo = '';
    this.rememberThreeObj.three ? this.humanaResObj.humanaDto.cognitiveImpairement.repeatedWordThree = 'Chair' : this.humanaResObj.humanaDto.cognitiveImpairement.repeatedWordThree = '';
    this.EditHumanaForm();
  }
  EditHumanaForm() {
    this.editingHumanaData = true;
    let raceOther = '';
    if (this.OtherRaceSelect) {
      raceOther = this.raceOrEthnicity;
    }
    // const data = {} as any;
    // Object.assign(data, this.humanaResObj);
    const result = this.cloneService.deepClone<HumanaResDto>(this.humanaResObj);
    this.awService.EditHumanaForm(result, raceOther).subscribe((res: any) => {
      this.editingHumanaData = false;
      // this.superBillDto = res;
    }, (res: HttpResError) => {
      this.editingHumanaData = false;
      this.toaster.error(res.error, res.message);
    });
  }
  RefreshHumanaCareGpasData(type: number) {
    this.refreshHumanaGapsDto.awEncounterId = this.annualWellnessID;
    this.refreshHumanaGapsDto.textboxType = type;

    this.awService.RefreshHumanaCareGpasData(this.refreshHumanaGapsDto).subscribe((res: any) => {
      if (type == 0) {
        this.humanaResObj.humanaDto.screeningPlan = res.result;
      }
      if (type == 1) {
        this.humanaResObj.humanaDto.followUp = res.result;
      }
      // this.EditHumanaForm();
    }, (res: HttpResError) => {
      this.toaster.error(res.error, res.message);
    });
  }
  resetMedicalRconsilitian() {
    this.humanaResObj.humanaDto.medicalReconsiliation.dateOfReview = null;
    this.humanaResObj.humanaDto.medicalReconsiliation.physician = '';
    this.EditHumanaForm();
  }
  resetstatinTherapy() {
    this.humanaResObj.humanaDto.statinTherapy.date = null;
    this.humanaResObj.humanaDto.statinTherapy.rxAdministrationMode = '';
    this.humanaResObj.humanaDto.statinTherapy.rxDose = '';
    this.humanaResObj.humanaDto.statinTherapy.statinRxName = '';
    this.humanaResObj.humanaDto.statinTherapy.statinTherapyIntensity = '';
    this.EditHumanaForm();
  }
  resetBreastcancerSection() {
    this.humanaResObj.humanaDto.breastCancerScreening = new BreastCancerScreening();
    this.humanaResObj.humanaDto.breastCancerScreening.applicable = true;
    this.EditHumanaForm();
  }
  resetdiabeticNephropathy() {
    this.humanaResObj.humanaDto.diabeticNephropathy = new DiabeticNephropathy();
    this.humanaResObj.humanaDto.diabeticNephropathy.applicable = true;
    this.EditHumanaForm();
  }
  resetdiabaticFootExam() {
    this.humanaResObj.humanaDto.diabeticFootExam.forEach((x, iIndex) => {
      x.normalLimit = null;
      x.abnormal = null;
      x.findings = '';
      x.comment = '';
      const fList = new Array<{text: string, active: boolean}>();
      if (!x.findingList) {
        return;
      }
      const fillFList = x.findingList.split(',');
      fillFList.forEach(y => {
        fList.push({text: y, active: false});
      });

      this[`footExamFindingList${iIndex + 1}`] = fList;
    });
    this.EditHumanaForm();
  }
  resetdiabaticEyeCare() {
    this.humanaResObj.humanaDto.diabeticEyeCare = new DiabeticEyeCare();
    this.humanaResObj.humanaDto.diabeticEyeCare.applicable = true;
    this.EditHumanaForm();
  }
  resetLabData() {
    this.humanaResObj.humanaDto.labs = new Labs();
    this.humanaResObj.humanaDto.labs.applicable = true;
    this.EditHumanaForm();
  }
  resetraManagement() {
    this.humanaResObj.humanaDto.raManagement = new RaManagement();
    this.humanaResObj.humanaDto.raManagement.applicable = true;
    this.EditHumanaForm();
  }

  resetosteoporosisManagement() {
    this.humanaResObj.humanaDto.osteoporosisManagement = new OsteoporosisManagement();
    this.humanaResObj.humanaDto.osteoporosisManagement.applicable = true;
    this.EditHumanaForm();
  }
  ClearPhyExam() {
    this.humanaResObj.humanaDto.physicalExamination.forEach(x => {
      x.findings = '';
    });
    this.EditHumanaForm();
  }
  DownLoadPdf(modal?: ModalDirective) {
    this.isLoadingZipHM = true;
    let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
    nUrl =  environment.appUrl;
    nUrl = nUrl + 'success/loading';
    // const importantStuff = window.open(nUrl);
    this.awService
      .GetHumanaPdf(this.annualWellnessID)
      .subscribe(
        (res: any) => {
          this.isLoadingZipHM = false;
          const file = new Blob([res], { type: 'application/pdf' });
          this.objectURLStr = '';
          const fileURL = window.URL.createObjectURL(file);
          this.objectURLStr = fileURL;
          if (!modal.isShown) {
            this.activeTabId = 1;
            modal.show();
          }
          // importantStuff.location.href = fileURL;
          // FileSaver.saveAs(
          //   new Blob([res], { type: 'application/pdf' }),
          //   `${this.appDataService.summeryViewPatient.firstName.charAt(0)}${this.appDataService.summeryViewPatient.lastName.charAt(0)}-(${this.appDataService.summeryViewPatient.patientEmrId})-Humana.pdf`
          // );
        },
        (err: any) => {
          this.isLoadingZipHM = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  DownLoadAwPdf(modal?: ModalDirective) {
    this.isLoadingZip = true;
    let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
    nUrl =  environment.appUrl;
    nUrl = nUrl + 'success/loading';
    // const importantStuff = window.open(nUrl);
    setTimeout(() => {
      const btn = document.getElementById('humanaFormButton');
      if (btn) {
        btn.click();
      }
    }, 100);
    this.awService
      .GetAnnualWellnessPdf(this.annualWellnessID)
      .subscribe(
        (res: any) => {
          const file = new Blob([res], { type: 'application/pdf' });
          const fileURL = window.URL.createObjectURL(file);
          this.objectURLStrAW = fileURL;
          if (!modal.isShown) {
            this.activeTabId = 2;
            modal.show();
          }
          // importantStuff.location.href = fileURL;
        // FileSaver.saveAs(
        //     new Blob([res], { type: 'application/pdf' }),
        //     `${this.appDataService.summeryViewPatient.firstName.charAt(0)}${this.appDataService.summeryViewPatient.lastName.charAt(0)}-(${this.appDataService.summeryViewPatient.patientEmrId})-Annual-wellness.pdf`
        //   );
          this.isLoadingZip = false;
        },
        (err: any) => {
          this.isLoadingZip = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  checkRaceEthnicity() {
    if (this.humanaResObj.humanaDto.patientInfo.raceOrEthnicity) {
      this.OtherRaceSelect = false;
      this.raceOrEthnicity = '';
    }
  }
  FootExamFIndingChanges(item: DiabeticFootExam, index: number) {
    let tempArr = [];
    if (index === 1) {
      tempArr = this.footExamFindingList1;
    } else if (index === 2) {
      tempArr = this.footExamFindingList2;
    } else if (index === 3) {
      tempArr = this.footExamFindingList3;
    } else {
      return;
    }
    let resultStr = ``;
    tempArr.forEach(element => {
      if (element.active === true) {
        resultStr += element.text + ',';
      }
    });
    this.humanaResObj.humanaDto.diabeticFootExam.forEach(x => {
      if (item.examinationName === x.examinationName) {
        x.findings = '';
        x.findings = resultStr;
      }
    });
    this.EditHumanaForm();
  }
  DiagnoseTreatmentPlanOptions(index: number) {
    const tempArr = this.tempHumanaDiagnosis[index]['OptionsList'];
    let resultStr = ``;
    tempArr.forEach(element => {
      if (element.active === true) {
        resultStr += element.text + ',';
      }
    });
    this.humanaResObj.humanaDto.humanaDiagnosis[index]['otherTreatmentPlan'] = this.tempHumanaDiagnosis[index]['otherTreatmentPlan'];
    this.humanaResObj.humanaDto.humanaDiagnosis[index].treatmentPlan = resultStr;
    this.EditHumanaForm();
  }
  getPublicUrl(url: string) {
    let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
    nUrl =  environment.appUrl;
    nUrl = nUrl + 'success/loading';
    const importantStuff = window.open(nUrl);
    this.awsService.getPublicPath(url).subscribe(
      (res: any) => {
        this.isLoadingPublic = false;
        // importantStuff.location.href = res;
        if (url.toLocaleLowerCase().includes('.pdf')) {
          fetch(res).then(async (fdata: any) => {
            const slknasl = await fdata.blob();
            const blob = new Blob([slknasl], { type: 'application/pdf' });
            const objectURL = URL.createObjectURL(blob);
            importantStuff.location.href = objectURL;
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
        this.isLoadingPublic = false;
        // this.preLoader = 0;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  CancerScreeningDates(event , data) {
    if (data === 'colonscopyPerformedDate') {
      if (event.date) {
        const day = moment(event.date).format('MM-DD-YYYY');
        if (!this.humanaResObj.humanaDto.colorectalCancerScreening.colonscopyPerformedDate) {
          this.humanaResObj.humanaDto.colorectalCancerScreening.colonscopyPerformedDate = '';
        }
        this.humanaResObj.humanaDto.colorectalCancerScreening.colonscopyPerformedDate = this.humanaResObj.humanaDto.colorectalCancerScreening.colonscopyPerformedDate + ' ' + day;
      }
    }
    else if (data === 'colonsgraphyPerformedDate') {
      if (event.date) {
        const day = moment(event.date).format('MM-DD-YYYY');
        if (!this.humanaResObj.humanaDto.colorectalCancerScreening.colonsgraphyPerformedDate) {
          this.humanaResObj.humanaDto.colorectalCancerScreening.colonsgraphyPerformedDate = '';
        }
        this.humanaResObj.humanaDto.colorectalCancerScreening.colonsgraphyPerformedDate = this.humanaResObj.humanaDto.colorectalCancerScreening.colonsgraphyPerformedDate + ' ' + day;
      }
    }
    else if (data === 'sigmoidoscopyPerformedDate') {
      if (event.date) {
        const day = moment(event.date).format('MM-DD-YYYY');
        if (!this.humanaResObj.humanaDto.colorectalCancerScreening.sigmoidoscopyPerformedDate) {
          this.humanaResObj.humanaDto.colorectalCancerScreening.sigmoidoscopyPerformedDate = '';
        }
        this.humanaResObj.humanaDto.colorectalCancerScreening.sigmoidoscopyPerformedDate = this.humanaResObj.humanaDto.colorectalCancerScreening.sigmoidoscopyPerformedDate + ' ' + day;
      }
    }
    else if (data === 'cologuardPerformedDate') {
      if (event.date) {
        const day = moment(event.date).format('MM-DD-YYYY');
        if (!this.humanaResObj.humanaDto.colorectalCancerScreening.cologuardPerformedDate) {
          this.humanaResObj.humanaDto.colorectalCancerScreening.cologuardPerformedDate = '';
        }
        this.humanaResObj.humanaDto.colorectalCancerScreening.cologuardPerformedDate = this.humanaResObj.humanaDto.colorectalCancerScreening.cologuardPerformedDate + ' ' + day;
      }
    }
    else if (data === 'fobtPerformedDate') {
      if (event.date) {
        const day = moment(event.date).format('MM-DD-YYYY');
        if (!this.humanaResObj.humanaDto.colorectalCancerScreening.fobtPerformedDate) {
          this.humanaResObj.humanaDto.colorectalCancerScreening.fobtPerformedDate = '';
        }
        this.humanaResObj.humanaDto.colorectalCancerScreening.fobtPerformedDate = this.humanaResObj.humanaDto.colorectalCancerScreening.fobtPerformedDate + ' ' + day;
      }
    }
    else if (data === 'excludedColectomyDate') {
      if (event.date) {
        const day = moment(event.date).format('MM-DD-YYYY');
        if (!this.humanaResObj.humanaDto.colorectalCancerScreening.excludedColectomyDate) {
          this.humanaResObj.humanaDto.colorectalCancerScreening.excludedColectomyDate = '';
        }
        this.humanaResObj.humanaDto.colorectalCancerScreening.excludedColectomyDate = this.humanaResObj.humanaDto.colorectalCancerScreening.excludedColectomyDate + ' ' + day;
      }
    }
    else if (data === 'excludedColorectalDate') {
      if (event.date) {
        const day = moment(event.date).format('MM-DD-YYYY');
        if (!this.humanaResObj.humanaDto.colorectalCancerScreening.excludedColorectalDate) {
          this.humanaResObj.humanaDto.colorectalCancerScreening.excludedColorectalDate = '';
        }
        this.humanaResObj.humanaDto.colorectalCancerScreening.excludedColorectalDate = this.humanaResObj.humanaDto.colorectalCancerScreening.excludedColorectalDate + ' ' + day;
      }
    }

  }
  breastCancerScreeningDate(event , data) {
    if (data === 'mammographyPerformedDate') {
      if (event.date) {
        const day = moment(event.date).format('MM-DD-YYYY');
        if (!this.humanaResObj.humanaDto.breastCancerScreening.mammographyPerformedDate) {
          this.humanaResObj.humanaDto.breastCancerScreening.mammographyPerformedDate = '';
        }
        this.humanaResObj.humanaDto.breastCancerScreening.mammographyPerformedDate = this.humanaResObj.humanaDto.breastCancerScreening.mammographyPerformedDate + ' ' + day;
      }
    }

    else if (data === 'excludedBilateralMastectomy') {
      if (event.date) {
        const day = moment(event.date).format('MM-DD-YYYY');
        if (!this.humanaResObj.humanaDto.breastCancerScreening.excludedBilateralMastectomy) {
          this.humanaResObj.humanaDto.breastCancerScreening.excludedBilateralMastectomy = '';
        }
        this.humanaResObj.humanaDto.breastCancerScreening.excludedBilateralMastectomy = this.humanaResObj.humanaDto.breastCancerScreening.excludedBilateralMastectomy + ' ' + day;
      }
    }
    else if (data === 'excludedUnilateralMastectomy') {
      if (event.date) {
        const day = moment(event.date).format('MM-DD-YYYY');
        if (!this.humanaResObj.humanaDto.breastCancerScreening.excludedUnilateralMastectomy) {
          this.humanaResObj.humanaDto.breastCancerScreening.excludedUnilateralMastectomy = '';
        }
        this.humanaResObj.humanaDto.breastCancerScreening.excludedUnilateralMastectomy = this.humanaResObj.humanaDto.breastCancerScreening.excludedUnilateralMastectomy + ' ' + day;
      }
    }
    else if (data === 'excludedUnilateralMastectomyTwo') {
      if (event.date) {
        const day = moment(event.date).format('MM-DD-YYYY');
        if (!this.humanaResObj.humanaDto.breastCancerScreening.excludedUnilateralMastectomyTwo) {
          this.humanaResObj.humanaDto.breastCancerScreening.excludedUnilateralMastectomyTwo = '';
        }
        this.humanaResObj.humanaDto.breastCancerScreening.excludedUnilateralMastectomyTwo = this.humanaResObj.humanaDto.breastCancerScreening.excludedUnilateralMastectomyTwo + ' ' + day;
      }
    }
    else if (data === 'excludedUnilateralMastectomyWithBilateralModifier') {
      if (event.date) {
        const day = moment(event.date).format('MM-DD-YYYY');
        if (!this.humanaResObj.humanaDto.breastCancerScreening.excludedUnilateralMastectomyWithBilateralModifier) {
          this.humanaResObj.humanaDto.breastCancerScreening.excludedUnilateralMastectomyWithBilateralModifier = '';
        }
        this.humanaResObj.humanaDto.breastCancerScreening.excludedUnilateralMastectomyWithBilateralModifier = this.humanaResObj.humanaDto.breastCancerScreening.excludedUnilateralMastectomyWithBilateralModifier + ' ' + day;
      }
    }
    else if (data === 'excludedUnilateralMastectomyWithRightSideModifier') {
      if (event.date) {
        const day = moment(event.date).format('MM-DD-YYYY');
        if (!this.humanaResObj.humanaDto.breastCancerScreening.excludedUnilateralMastectomyWithRightSideModifier) {
          this.humanaResObj.humanaDto.breastCancerScreening.excludedUnilateralMastectomyWithRightSideModifier = '';
        }
        this.humanaResObj.humanaDto.breastCancerScreening.excludedUnilateralMastectomyWithRightSideModifier = this.humanaResObj.humanaDto.breastCancerScreening.excludedUnilateralMastectomyWithRightSideModifier + ' ' + day;
      }
    }

  }
  DiseaseSpecificManagement (event , data) {
    if (data === 'microalbuminTestDate') {
      if (event.date) {
        const day = moment(event.date).format('MM-DD-YYYY');
        if (!this.humanaResObj.humanaDto.diabeticNephropathy.microalbuminTestDate) {
          this.humanaResObj.humanaDto.diabeticNephropathy.microalbuminTestDate = '';
        }
        this.humanaResObj.humanaDto.diabeticNephropathy.microalbuminTestDate = this.humanaResObj.humanaDto.diabeticNephropathy.microalbuminTestDate + ' ' + day;
      }
    }
    else if (data === 'macroalbuminTestDate') {
      if (event.date) {
        const day = moment(event.date).format('MM-DD-YYYY');
        if (!this.humanaResObj.humanaDto.diabeticNephropathy.macroalbuminTestDate) {
          this.humanaResObj.humanaDto.diabeticNephropathy.macroalbuminTestDate = '';
        }
        this.humanaResObj.humanaDto.diabeticNephropathy.macroalbuminTestDate = this.humanaResObj.humanaDto.diabeticNephropathy.macroalbuminTestDate + ' ' + day;
      }
    }
    else if (data === 'aceInhibitorDate') {
      if (event.date) {
        const day = moment(event.date).format('MM-DD-YYYY');
        if (!this.humanaResObj.humanaDto.diabeticNephropathy.aceInhibitorDate) {
          this.humanaResObj.humanaDto.diabeticNephropathy.aceInhibitorDate = '';
        }
        this.humanaResObj.humanaDto.diabeticNephropathy.aceInhibitorDate = this.humanaResObj.humanaDto.diabeticNephropathy.aceInhibitorDate + ' ' + day;
      }
    }
    else if (data === 'nephrologistVisitDate') {
      if (event.date) {
        const day = moment(event.date).format('MM-DD-YYYY');
        if (!this.humanaResObj.humanaDto.diabeticNephropathy.nephrologistVisitDate) {
          this.humanaResObj.humanaDto.diabeticNephropathy.nephrologistVisitDate = '';
        }
        this.humanaResObj.humanaDto.diabeticNephropathy.nephrologistVisitDate = this.humanaResObj.humanaDto.diabeticNephropathy.nephrologistVisitDate + ' ' + day;
      }
    }
    else if (data === 'renalTransplantDate') {
      if (event.date) {
        const day = moment(event.date).format('MM-DD-YYYY');
        if (!this.humanaResObj.humanaDto.diabeticNephropathy.renalTransplantDate) {
          this.humanaResObj.humanaDto.diabeticNephropathy.renalTransplantDate = '';
        }
        this.humanaResObj.humanaDto.diabeticNephropathy.renalTransplantDate = this.humanaResObj.humanaDto.diabeticNephropathy.renalTransplantDate + ' ' + day;
      }
    }

  }
  DiabeticEyeCare (event , data) {

    if (event.date) {
      const day = moment(event.date).format('MM-DD-YYYY');
      if (!this.humanaResObj.humanaDto.diabeticEyeCare[data]) {
        this.humanaResObj.humanaDto.diabeticEyeCare[data] = '';
      }
      this.humanaResObj.humanaDto.diabeticEyeCare[data] = this.humanaResObj.humanaDto.diabeticEyeCare[data] + ' ' + day;
    }
  //   if (data === 'retinalOrDilatedExamDate') {
  //     if (event.date) {
  //       const day = moment(event.date).format('MM-DD-YYYY');
  //       if (!this.humanaResObj.humanaDto.diabeticEyeCare.retinalOrDilatedExamDate) {
  //         this.humanaResObj.humanaDto.diabeticEyeCare.retinalOrDilatedExamDate = '';
  //       }
  //       this.humanaResObj.humanaDto.diabeticEyeCare.retinalOrDilatedExamDate = this.humanaResObj.humanaDto.diabeticEyeCare.retinalOrDilatedExamDate + ' ' + day;
  //     }
  //   }
  //   else if (data === 'negativeRetinalOrDilatedExamDate') {
  //     if (event.date) {
  //       const day = moment(event.date).format('MM-DD-YYYY');
  //       if (!this.humanaResObj.humanaDto.diabeticEyeCare.negativeRetinalOrDilatedExamDate) {
  //         this.humanaResObj.humanaDto.diabeticEyeCare.negativeRetinalOrDilatedExamDate = '';
  //       }
  //       this.humanaResObj.humanaDto.diabeticEyeCare.negativeRetinalOrDilatedExamDate = this.humanaResObj.humanaDto.diabeticEyeCare.negativeRetinalOrDilatedExamDate + ' ' + day;
  //     }
  //   }
  //   else if (data === 'gestationalDiabetesDate') {
  //     if (event.date) {
  //       const day = moment(event.date).format('MM-DD-YYYY');
  //       if (!this.humanaResObj.humanaDto.diabeticEyeCare.gestationalDiabetesDate) {
  //         this.humanaResObj.humanaDto.diabeticEyeCare.gestationalDiabetesDate = '';
  //       }
  //       this.humanaResObj.humanaDto.diabeticEyeCare.gestationalDiabetesDate = this.humanaResObj.humanaDto.diabeticEyeCare.gestationalDiabetesDate + ' ' + day;
  //     }
  //   }
  //   else if (data === 'steroidInducedDiabetesDate') {
  //     if (event.date) {
  //       const day = moment(event.date).format('MM-DD-YYYY');
  //       if (!this.humanaResObj.humanaDto.diabeticEyeCare.steroidInducedDiabetesDate) {
  //         this.humanaResObj.humanaDto.diabeticEyeCare.steroidInducedDiabetesDate = '';
  //       }
  //       this.humanaResObj.humanaDto.diabeticEyeCare.steroidInducedDiabetesDate = this.humanaResObj.humanaDto.diabeticEyeCare.steroidInducedDiabetesDate + ' ' + day;
  //     }
  //   }
  //   else if (data === 'polycysticOvarianSyndromeDate') {
  //     if (event.date) {
  //       const day = moment(event.date).format('MM-DD-YYYY');
  //       if (!this.humanaResObj.humanaDto.diabeticEyeCare.polycysticOvarianSyndromeDate) {
  //         this.humanaResObj.humanaDto.diabeticEyeCare.polycysticOvarianSyndromeDate = '';
  //       }
  //       this.humanaResObj.humanaDto.diabeticEyeCare.polycysticOvarianSyndromeDate = this.humanaResObj.humanaDto.diabeticEyeCare.polycysticOvarianSyndromeDate + ' ' + day;
  //     }
  //   }

  }

}
