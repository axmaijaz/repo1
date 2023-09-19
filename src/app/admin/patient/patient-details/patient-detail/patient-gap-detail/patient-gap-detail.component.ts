import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';
import { AwService } from 'src/app/core/annualWellness/aw.service';
import { PcmService } from 'src/app/core/pcm/pcm.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { AMScreeningDto } from 'src/app/model/pcm/pcm-alcohol.model';
import { MeasureDto, PcmMeasureDataObj, Status, DocDataDto, EditMeasureDataParams } from 'src/app/model/pcm/pcm.model';
import { SubSink } from 'src/app/SubSink';
import { AwsService } from 'src/app/core/aws/aws.service';
import { EmitEvent, EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { environment } from 'src/environments/environment';
import { ScheduleFlag } from 'src/app/Enums/pcm.enum';

@Component({
  selector: 'app-patient-gap-detail',
  templateUrl: './patient-gap-detail.component.html',
  styleUrls: ['./patient-gap-detail.component.scss']
})
export class PatientGapDetailComponent implements OnInit, OnDestroy {
  gettingGetPatientsMeasuresSummary: boolean;
  pcmMeasuresList = new Array<MeasureDto>();
  pcmMeasuresListGap = new Array<MeasureDto>();
  pcmMeasuresListNotGap = new Array<MeasureDto>();
  ListGApWidth: number;
  ListGApNotWidth: number;
  currentCode: string;
  pcmModelLoading: boolean;
  pcmMOdelData = new PcmMeasureDataObj();
  tempStatusList = new Array<Status>();
  selectedPcmStatus: { name: string; value: number };
  whoIsCovered: any;
  selectedMeasure = new MeasureDto();
  editingPcmData: boolean;
  isCreatingAWEncounter: boolean;
  isCreatingScreening: boolean;
  isCreatingCounselling: boolean;
  uploadImg: boolean;
  docData = new DocDataDto();
  popupQustion: any;
  hasPayerGap: boolean;
  hasFacilityGap: boolean;
  currentDate = moment().format('YYYY-MM-DD');
  // currentDate2 = moment().format('DD-MM-YYYY');
  public scrollbarOptionsTimeline = {
    axis: 'y',
    theme: 'minimal-dark',
    scrollInertia: 0
  };
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    appendTo: 'body',
    // min: this.currentDate
  };
  public disableDatePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    appendTo: 'body',
    min: this.currentDate
  };
  private subs = new SubSink();
  PatientId: number;
  @ViewChild('pcmMOdel') pcmMOdel: ModalDirective;
  objectURLStrAW: string;
  @ViewChild('viewPdfModal') viewPdfModal: ModalDirective;
  ScheduleFlagEnumList: { number: string; word: string; }[];
  constructor(
    private toaster: ToastService,
    private route: ActivatedRoute,
    private sanatizer: DomSanitizer,
    private pcmService: PcmService,
    private awService: AwService,
    private awsService: AwsService,
    private eventBus: EventBusService,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  ngOnInit() {
    this.PatientId = +this.route.snapshot.paramMap.get('id');
    if (!this.PatientId) {
      this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get("id");
    }
    this.getScheduleFlagArray();
    this.subscripeOpenCareGapReq();
    if (this.PatientId) {
      this.GetPatientsMeasuresSummary();
    }
  }
  subscripeOpenCareGapReq() {
    this.eventBus.on(EventTypes.OpenGapDetail).subscribe((code) => {
      const sGap = this.pcmMeasuresList.find(x => x.code.toLocaleLowerCase() === code.toLocaleLowerCase());
      if (sGap) {
        this.selectedMeasure = sGap;
        this.getMeasureDataByCode( sGap.code , this.pcmMOdel);
      } else {
        this.toaster.info('Gap not found');
      }
    });
  }
  hideModal() {
    setTimeout(() => {
      var element = document.getElementsByTagName('mdb-modal-backdrop');
    if (element && element[0]) {
      element[0].remove();
    }
    }, 1000);

    // getElementsByClassName("modal-backdrop");
  // element.namedItem("modal-backdrop").remove();
    this.pcmMOdel.hide();
  }
  GetPatientsMeasuresSummary() {
    this.gettingGetPatientsMeasuresSummary = true;
    this.subs.sink = this.pcmService
      .GetPatientsMeasuresSummary(this.PatientId)
      .subscribe(
        (res: any) => {
          this.pcmMeasuresList = res;
          this.pcmMeasuresListGap = this.pcmMeasuresList.filter(x => x.isPayerGap);
          if (this.pcmMeasuresListGap.length > 0) {
            const arrLenth = this.pcmMeasuresListGap.length;
            this.ListGApWidth = (arrLenth % 2) === 0 ? arrLenth / 2 : ((arrLenth + 1) / 2);
          }
          this.pcmMeasuresListNotGap = this.pcmMeasuresList.filter(x => !x.isPayerGap);
          if (this.pcmMeasuresListNotGap.length > 0) {
            const arrLenth = this.pcmMeasuresListNotGap.length;
            this.ListGApNotWidth = (arrLenth % 2) === 0 ? arrLenth / 2 : ((arrLenth + 1) / 2);
          }
          const findPayerGap = this.pcmMeasuresList.find(x => x.isPayerGap === true) ;
          if (findPayerGap){
             this.hasPayerGap = true;
          }
          const findfacilityGap = this.pcmMeasuresList.find(x => x.isPayerGap !== true) ;
          if (findfacilityGap){
             this.hasFacilityGap = true;
          }
          this.gettingGetPatientsMeasuresSummary = false;
        },
        (err: HttpResError) => {
          this.gettingGetPatientsMeasuresSummary = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }

  getMeasureDataByCode(code: string, model: ModalDirective) {
    const sGap = this.pcmMeasuresList.find(x => x.code.toLocaleLowerCase() === code.toLocaleLowerCase());
    if (sGap && (!this.selectedMeasure || !this.selectedMeasure.code)) {
      this.selectedMeasure = sGap;
    }
    this.pcmMOdelData = new PcmMeasureDataObj();
    this.currentCode = code
    this.pcmModelLoading = true;
    if (model) {
      model.show();
    }
    this.subs.sink = this.pcmService
      .GetPCMeasureData(this.PatientId, code)
      .subscribe(
        (res: PcmMeasureDataObj) => {
          if (res) {
            if (res.lastDone) {
              res.lastDone = moment.utc(res.lastDone).local().format('YYYY-MM-DD');
            }
            if (res.nextDue) {res.nextDue = moment.utc(res.nextDue).local().format('YYYY-MM-DD');}
            if (!res.eventDate || res.eventDate == '0001-01-01T00:00:00') {res.eventDate = moment.utc(this.currentDate).local().format('YYYY-MM-DD');
          } else {
            res.eventDate = moment.utc(res.eventDate).local().format('YYYY-MM-DD')
          }
            res.code = code;
            this.pcmMOdelData = res;
            if (!this.pcmMOdelData.scheduleFlag) {
              this.pcmMOdelData.scheduleFlag = null;
            }
            this.tempStatusList = this.pcmMOdelData.statusList;
            this.selectedPcmStatus = this.tempStatusList.find(status => status.value === this.pcmMOdelData.currentStatus);
            console.log(this.selectedPcmStatus);
            this.whoIsCovered = this.sanatizer.bypassSecurityTrustHtml(
              this.pcmMOdelData.whoIsCovered
            );

          } else {
            this.pcmMOdelData = new PcmMeasureDataObj();
          }
          this.pcmModelLoading = false;
        },
        (err: HttpResError) => {
          if (model) {model.hide();}
          this.pcmModelLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  addPcDocument(file: any) {
    this.uploadImg = true;
    let data = {
      title: file.name,
      code: this.selectedMeasure.code,
      patientId: this.PatientId
    };
    this.pcmService.addPcDocument(data).subscribe(
      (res: DocDataDto) => {
        this.docData = res;
        this.uploadPcmDocToS3(file);
      },
      (err: HttpResError) => {
        // this.editingPcmData = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  async uploadPcmDocToS3(file) {
    // if (this.patientRpmConsentType === 1) {
    // this.rpmInputLoading = true;
    const path = `pcmDocs/preventiveCare-${this.PatientId}/${file.name}`;
    this.awsService.uploadUsingSdk(file, path).then(
      data => {
        this.uploadImg = false;
        const newFile = {
          id: this.docData.id,
          title: file.name
         };
          this.pcmMOdelData.pcmDocuments.push(newFile);
        // this.getMeasureDataByCode(this.currentCode ,null);
      },
      err => {
        this.uploadImg = false;
        this.pcmService.addPCDocumentOnError(this.docData).subscribe(res => {
          if (res) {
            this.toaster.error(err.message, err.error || err.error);
          }
        });
      }
    );
    // }
  }
  getScheduleFlagArray() {
    const keys = Object.keys(ScheduleFlag).filter(
      (k) => typeof ScheduleFlag[k as any] === 'number'
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      number: ScheduleFlag[key as any],
      word: key,
    })); // [0, 1]
    this.ScheduleFlagEnumList = values;
    return values;
  }
  AddEditMeasureData(model: ModalDirective) {
    const data = new EditMeasureDataParams();
    data.id = this.pcmMOdelData.id;
    data.patientId = this.PatientId;
    data.code = this.pcmMOdelData.code;
    data.lastDone = this.pcmMOdelData.lastDone;
    data.nextDue = this.pcmMOdelData.nextDue;
    data.result = this.pcmMOdelData.result;
    data.controlled = this.pcmMOdelData.controlled;
    data.note = this.pcmMOdelData.note;
    data.careGapSchedule.scheduleFlag = this.pcmMOdelData.scheduleFlag;
    data.careGapSchedule.eventDate = this.pcmMOdelData.eventDate;
    data.careGapSchedule.scheduleNote = this.pcmMOdelData.scheduleNote;
    // data.scheduleFlag
    if (!this.pcmMOdelData.currentStatus) {
      this.pcmMOdelData.currentStatus = 0;
    }
    data.insuranceGapFlags = this.pcmMOdelData.insuranceGapFlags;
    data.currentStatus = this.pcmMOdelData.currentStatus;
    this.editingPcmData = true;
    this.subs.sink = this.pcmService.AddEditMeasureData(data).subscribe(
      (res: any) => {
        this.editingPcmData = false;
        this.GetPatientsMeasuresSummary();
        this.toaster.success('Data updated successfully');
          model.hide();
          this.hideModal();
          this.EmitEventForGapDataChange();
      },
      (err: HttpResError) => {
        this.editingPcmData = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  EmitEventForGapDataChange() {
    // tslint:disable-next-line: prefer-const
    const event = new EmitEvent();
    event.name = EventTypes.GapsDataChanged;
    event.value = '';
    this.eventBus.emit(event);
  }
  AddScreening() {
    if (this.selectedMeasure.code === 'AM') {
      this.AddAMScreening();
    } else if (this.selectedMeasure.code === 'DP') {
      this.AddDepressionScreening();
    }
  }
  AddCounselling() {
    if (this.selectedMeasure.code === 'AM') {
      this.AddAlcoholCounselling();
    } else if (this.selectedMeasure.code === 'DP') {
      this.AddDepressionCounselling();
    }
  }
  AddAWEncounter() {
    this.isCreatingAWEncounter = true;
    this.awService.AddAWEncounter(this.PatientId).subscribe((res: number) => {
      this.isCreatingAWEncounter = false;
      this.router.navigateByUrl(`/annualWellness/AWMain/${this.PatientId}/${res}/awPatient`);
    },
    (err: HttpResError) => {
      this.isCreatingAWEncounter = false;
      this.toaster.error(err.error, err.message);
    });
  }
  AddDepressionCounselling() {
    this.isCreatingCounselling = true;
    this.pcmService.AddDepressionCounseling(this.PatientId).subscribe((res: any) => {
      this.isCreatingCounselling = false;
      this.router.navigateByUrl(`/pcm/pcmDepression/${this.PatientId}/depressionCounselling/${res.id}`);
    },
    (err: HttpResError) => {
      this.isCreatingCounselling = false;
      this.toaster.error(err.error, err.message);
    });
  }
  AddAlcoholCounselling() {
    this.isCreatingCounselling = true;
    this.pcmService.AddAMCounseling(this.PatientId).subscribe((res: any) => {
      this.isCreatingCounselling = false;
      this.router.navigateByUrl(`/pcm/pcmAlcohol/${this.PatientId}/alcoholCounselling/${res.id}`);
    },
    (err: HttpResError) => {
      this.isCreatingCounselling = false;
      this.toaster.error(err.error, err.message);
    });
  }
  AddDepressionScreening() {
    this.isCreatingScreening = true;
    this.pcmService.AddDPScreening(this.PatientId).subscribe((res: AMScreeningDto) => {
      this.isCreatingScreening = false;
      this.router.navigateByUrl(`/pcm/pcmDepression/${this.PatientId}/depressionScreening/${res.id}`);
    },
    (err: HttpResError) => {
      this.isCreatingScreening = false;
      this.toaster.error(err.error, err.message);
    });
  }
  AddAMScreening() {
    this.isCreatingScreening = true;
    this.pcmService.AddAMScreening(this.PatientId).subscribe((res: AMScreeningDto) => {
      this.isCreatingScreening = false;
      this.router.navigateByUrl(`/pcm/pcmAlcohol/${this.PatientId}/alcoholScreening/${res.id}`);
    },
    (err: HttpResError) => {
      this.isCreatingScreening = false;
      this.toaster.error(err.error, err.message);
    });
  }
  onUploadOutput(output: any): void {
    if (output.target.files[0].size > 26214400) {
      this.toaster.warning('file size is more than 25 MB');
      return;
    }
    this.uploadImg = true;
    this.addPcDocument(output.target.files[0]);
    // if (output.target.files.length >= 1) {
    //   if (this.files.length > 0) {
    //     this.files.forEach(file => {
    //       if (file.name === output.target.files[0].name) return;
    //     });
    //   }
    //   this.files = [...this.files, ...output.target.files[0]];

    //   // this.imageFileExtension = false;
    // }
  }
  DeleteDoc(doc: any) {
    this.pcmService.deletePCDocument(doc.id).subscribe(res => {
      this.pcmMOdelData.pcmDocuments = this.pcmMOdelData.pcmDocuments.filter(myfile => myfile.id !== doc.id);
      this.toaster.success('Deleted successfully');
    },
    (err: HttpResError) => {
      this.editingPcmData = false;
      this.toaster.error(err.error, err.message);
    });
  }
  viewDoc(doc: any) {
// doc.path
  // const importantStuff = window.open("", "_blank");
  let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  nUrl =  environment.appUrl;
  nUrl = nUrl + 'success/loading';
  const importantStuff = window.open(nUrl);
  this.subs.sink = this.pcmService.getPublicPath(doc.path).subscribe(
    (res: any) => {
      // this.isLoading = false;
      // // importantStuff.location.href = res;
      // var win = window.open(res, '_blank');
      // // win.opener = null;
      // win.focus();
      if (doc.path && doc.path.toLocaleLowerCase().includes('.pdf')) {
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
    },
    err => {
      // this.isLoading = false;
      // this.preLoader = 0;
      this.toaster.error(err.error, err.message);
    }
  );
  }

}
