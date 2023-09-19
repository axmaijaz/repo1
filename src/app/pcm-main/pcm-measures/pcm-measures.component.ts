import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PcmMeasureDataObj, MeasureDto, Status, DocDataDto, EditMeasureDataParams } from 'src/app/model/pcm/pcm.model';
import { SubSink } from 'src/app/SubSink';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { PcmService } from 'src/app/core/pcm/pcm.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { AwsService } from 'src/app/core/aws/aws.service';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { PatientGapDetailComponent } from 'src/app/admin/patient/patient-details/patient-detail/patient-gap-detail/patient-gap-detail.component';


@Component({
  selector: 'app-pcm-measures',
  templateUrl: './pcm-measures.component.html',
  styleUrls: ['./pcm-measures.component.scss']
})
export class PcmMeasuresComponent implements OnInit, OnDestroy {
  pcmMeasuresList = new Array<MeasureDto>();
  selectedMeasure = new MeasureDto();
  pcmMOdelData = new PcmMeasureDataObj();
  PatientId: number;
  private subs = new SubSink();
  currentCode: string;
  pcmModelLoading: boolean;
  tempStatusList: Status[];
  selectedGapStatus: Status;
  whoIsCovered: any;
  uploadImg: boolean;
  docData: DocDataDto;
  popupQustion: any;

  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    appendTo: 'body'

  };
  public scrollbarOptionsTimeline = {
    axis: 'y',
    theme: 'light-3',
    scrollInertia: 2,
    scrollButtons: { enable: true },
    autoHideScrollbar: true,
    scrollbarPosition: 'inside'
  };
  editingPcmData: boolean;
  @ViewChild(PatientGapDetailComponent) child;

  constructor (private location: Location, private toaster: ToastService, private pcmService: PcmService,
    private sanatizer: DomSanitizer, private awsService: AwsService,private eventBusService: EventBusService,
    private route: ActivatedRoute, private router: Router) { }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.PatientId = +this.route.snapshot.paramMap.get("id");
    this.GetPatientsMeasuresSummary();
    this.eventBusService.on(EventTypes.GapsDataChanged).subscribe((res) => {
      this.GetPatientsMeasuresSummary();
      });
  }
  DeleteDoc(doc: any) {
    // this.pcmService.deletePCDocument(id).subscribe(res => {});
    this.pcmService.deletePCDocument(doc.id).subscribe(res => {
      // this.getMeasureDataByCode(this.currentCode ,null);
      this.pcmMOdelData.pcmDocuments = this.pcmMOdelData.pcmDocuments.filter(myfile => myfile.id !== doc.id);
      this.toaster.success('Deleted successfully');
    },
    (err: HttpResError) => {
      this.editingPcmData = false;
      this.toaster.error(err.error, err.message);
    });
  }
  AddEditMeasureData(model: ModalDirective) {
    const data = new EditMeasureDataParams();
    data.id = this.pcmMOdelData.id;
    data.patientId = this.PatientId;
    data.code = this.selectedMeasure.code;
    data.lastDone = this.pcmMOdelData.lastDone;
    data.nextDue = this.pcmMOdelData.nextDue;
    data.result = this.pcmMOdelData.result;
    data.note = this.pcmMOdelData.note;
    data.controlled = this.pcmMOdelData.controlled;
    if (!this.pcmMOdelData.currentStatus) {
      this.pcmMOdelData.currentStatus = 0;
    }
    data.currentStatus = this.pcmMOdelData.currentStatus;
    this.editingPcmData = true;
    this.subs.sink = this.pcmService.AddEditMeasureData(data).subscribe(
      (res: any) => {
        this.editingPcmData = false;
        this.GetPatientsMeasuresSummary();
        this.toaster.success('Data updated successfully');
          model.hide();
      },
      (err: HttpResError) => {
        this.editingPcmData = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  GetPatientsMeasuresSummary() {
    this.subs.sink = this.pcmService
      .GetPatientsMeasuresSummary(this.PatientId)
      .subscribe(
        (res: any) => {
          this.pcmMeasuresList = res;
          this.pcmMeasuresList.forEach(element => {
            if (!element.statusList) {
              return;
            }
            const find = element.statusList.find(x => x.value === element.status);
            if (find) {
              element['cStatus'] = find.name;
            }
          });
        },
        (err: HttpResError) => {
          this.toaster.error(err.error, err.message);
        }
      );
  }
  goBack() {
    this.location.back();
  }

  gapModelOpenFromOtherComponent(code) {
    this.child.getMeasureDataByCode(code, this.child.pcmMOdel);
  }
  getMeasureDataByCode(code: string, model: ModalDirective) {
    this.currentCode = code;
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
            this.pcmMOdelData = res;
            this.tempStatusList = this.pcmMOdelData.statusList;
            this.selectedGapStatus = this.tempStatusList.find(status => status.value === this.pcmMOdelData.currentStatus);
            console.log(this.selectedGapStatus);
            this.whoIsCovered = this.sanatizer.bypassSecurityTrustHtml(
              this.pcmMOdelData.whoIsCovered
            );
          } else {
            this.pcmMOdelData = new PcmMeasureDataObj();
          }
          this.GetPatientsMeasuresSummary();
          this.pcmModelLoading = false;
        },
        (err: HttpResError) => {
          if (model) {model.hide();}
          this.pcmModelLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
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
  addPcDocument(file: any) {
    this.uploadImg = true;
    const data = {
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
}
