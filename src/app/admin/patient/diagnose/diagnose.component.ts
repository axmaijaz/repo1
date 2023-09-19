import { Status } from './../../../model/pcm/pcm.model';
import { Component, OnInit, ViewChild, OnDestroy, Input, AfterViewInit, AfterContentChecked, EventEmitter, Output } from '@angular/core';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { ActivatedRoute } from '@angular/router';
import { IDatePickerConfig, ECalendarValue, SingleCalendarValue } from 'ng2-date-picker';
import {
  DiagnosisDto,
  SelectChronicDiseaseDto,
  DeleteDiagnoseDto,
  DiseaseOnServicesDto
} from 'src/app/model/Patient/patient.model';
import { SecurityService } from 'src/app/core/security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { Subject } from 'rxjs';
import { Disease } from 'src/app/model/admin/disease.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastService, ModalDirective, IMyOptions, MdbCheckboxChange } from 'ng-uikit-pro-standard';
import { QuestionnaireService } from 'src/app/core/questionnaire.service';
import { debounceTime, startWith } from 'rxjs/operators';
import { HttpResError } from 'src/app/model/common/http-response-error';
import * as moment from 'moment';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import { SubSink } from 'src/app/SubSink';
import { DiagnoseStatus } from 'src/app/Enums/ccm.enum';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
let that;
@Component({
  selector: 'app-diagnose',
  templateUrl: './diagnose.component.html',
  styleUrls: ['./diagnose.component.scss']
})
export class DiagnoseComponent implements OnInit, OnDestroy, AfterContentChecked {
  hideActionButtons = false;
  @Input() awId: number;
  @Input() bhiPatientId: number;
  @Input() PRCMPatientId: number;
  @Input() awDisable: boolean;
  @Input() hideListView: boolean;
  @Input() careplanView: boolean;

  @Output() diagnosesListEmitter: EventEmitter<DiagnosisDto[]> = new EventEmitter<DiagnosisDto[]>();
  @Output() diagnosesAddEditEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  private subs = new SubSink();
  yearNow = new Date();
  // AssignRemoveCareProvidersToPatientsDto
  public myDatePickerOptions: IMyOptions = {
    minYear: 1900,
    maxYear: this.yearNow.getFullYear() + 5,
    closeAfterSelect: true,
    dateFormat: 'yyyy-mm-dd',
  };
  assignedDateProp: string;
  isLoading = false;
  rows: DiagnosisDto[] = [];
  PatientId: number;
  diagnosisDto = new DiagnosisDto();
  searchWatch = new Subject<string>();
  url: string;
  selectedDisease: Disease;
  diagnoseForm: FormGroup;
  diagnose = new DiagnosisDto();
  diagnoseId: number;
  cronicDiseaseList = new Array<{ id: 0; desc: ''; detail: '' }>();
  diseaseList = new Array<Disease>();
  chronicDiseasesByUrl = new Array<{ code: string; detail: string }>();
  selectedChronicCondition = { id: 0, desc: '', detail: '' };
  selecteChronicDiseaseList = new Array<SelectChronicDiseaseDto>();
  selectItem = new SelectChronicDiseaseDto();
  deleteDiagnoseDto = new DeleteDiagnoseDto();
  diseaseOnServicesDto = new DiseaseOnServicesDto();
  minimumedate = new Date();
  isNoAction: boolean;
  chronicDependentDiseases = new Array<{
    id: 0;
    icdCode: '';
    icdCodeSystem: '';
    description: '';
    detail: '';
  }>();
  searchDisease = '';
  selectedCronicDisease = {
    code: '',
    detail: ''
  };

  public DisplayDate;
  // minimumedate: SingleCalendarValue;
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD'
  };
  public scrollbarOptionsTimeline = {
    axis: 'y',
    theme: 'dark-3',
    scrollInertia: 2,
    scrollButtons: { enable: true },
    scrollbarPosition: 'inside',
  };
  // selected: { start: Moment; end: Moment };
  isHideAction: number;
  selectedDate = new Date();
  LoadingData: boolean;
  searchParam = '';
  // public datePickerConfig: IDatePickerConfig = {
  //   allowMultiSelect: false,
  //   returnedValueType: ECalendarValue.StringArr
  // };
  public displayDate;
  seleteddate = new Date();
  @ViewChild('addDiagnose') addDiagnoseModal: ModalDirective;
  disabledDates = [new Date('2020-01-01'), new Date('2021-01-01')];
  isIcdCodeExist = false;
  saveAndAdd = 0;
  diagnoseStatusEnum = DiagnoseStatus;
  assigningDate: boolean;
  selectedRow: any;
  RPMDiagnosesCheckState: { icdCode: string; isOnRpm: boolean; };
  showRMPCheckedWarning: boolean;
  constructor(
    private securityService: SecurityService,
    private patientsService: PatientsService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toaster: ToastService,
    private appUi: AppUiService,
    public sanitizer:DomSanitizer,
    // private wikiService: WekipediaService,
    private questionService: QuestionnaireService
  ) {}
  ngAfterContentChecked(): void {
    if (this.bhiPatientId || this.PRCMPatientId) {
      const eded = $('#disableDiagnoseView').find('input, textarea, button, select');
      eded.prop('disabled', true);
    }
  }

  ngOnInit() {
    // this.minimumedate = moment().format("YYYY-MM-DD");
    this.PatientId = +this.route.snapshot.paramMap.get('id');
    if (!this.PatientId) {
      this.PatientId = +this.route.pathFromRoot[3]?.snapshot?.paramMap?.get("id");
    }
    if (this.securityService.securityObject.userType === UserType.Patient) {
      this.PatientId = this.securityService.securityObject.id;
      this.isHideAction = this.securityService.securityObject.id;
    }
    if (this.bhiPatientId) {
      this.PatientId = this.bhiPatientId;
    }
    if (this.PRCMPatientId) {
      this.PatientId = this.PRCMPatientId;
    }
    this.loadDiagnoses();
    this.getDiseases();
    this.diagnoseForm = this.fb.group({
      // practiceName: ['', [Validators.required]],
      icdCode: [''],
      // icdCodeSystem: [''],
      addToChronic: false,
      isOnRpm: false,
      isOnCcm: false,
      id: 0,
      note: '',
      description: [''],
      isChronic: true,
      diagnosisDate: '',
      resolvedDate: ''
    });
    // this.diagnoseForm.get('country').valueChanges.subscribe(val => {
    //   this.wikiSearch(val);
    // });
    this.getCronicDiseases();
    this.getClinicalTableDiseases();
    this.SearchObserver();
    that = this;
    this.hideActionButtons = this.route.snapshot.queryParamMap.get('hideActionButtons') ? true : false;
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  loadDiagnoses() {
    if (this.PatientId) {
      this.isLoading = true;
      // this.patientsService.getPatientDetail(this.PatientId).subscribe(
      this.subs.sink = this.patientsService.GetDiagnosesByPatientId(this.PatientId, this.awId, this.bhiPatientId).subscribe(
        (res: any) => {
          this.isLoading = false;
          if (res && res.length >= 0) {
            this.rows = res;
            this.selecteChronicDiseaseList = res;
            this.diagnosesListEmitter.emit(this.rows);
          } else {
            this.diagnosesListEmitter.emit([]);
          }
          if (!this.rows || !this.rows.length) {
            const tempData = {
              description: 'NA',
              encounterTimestamp: 'NA',
              icdCode: 'NA',
              note: 'NA'
            };
            this.rows.push(tempData as any);
          }
        },
        error => {
          this.isLoading = false;
          // console.log(error);
        }
      );
    }
  }
  onActivate(event: any) {
    if (event.type === 'click') {
      // id: number = +event.row.id;
    }
  }
  // resetDiagnoses() {
  //   this.diagnosisDto = new DiagnosisDto();
  // }
  getDiagnoseById(diagnoseId: number) {
    this.clearChronicDisease();
    this.diagnoseId = diagnoseId;
    this.subs.sink = this.patientsService
      .getDiagnoseById(diagnoseId)
      .subscribe((res: DiagnosisDto) => {
        this.addDiagnoseModal.show();
        // this.selecteChronicDiseaseList.filter(fil => {
        // fil.icdCode === res.icdCode;
        //   this.selectedCronicDisease = fil;
        // });
        // this.searchParam = res.description;
        // that.getClinicalTableDiseases();
        if (res.resolvedDate) {
          res.resolvedDate = moment(res.resolvedDate).format('YYYY-MM-DD');
        }
        if (res.diagnosisDate) {
          res.diagnosisDate = moment(res.diagnosisDate).format('YYYY-MM-DD');
        }

        this.IsDiseaseOnServices(res.icdCode);
        // this.selectedCronicDisease = this.selectedCronicDisease;
        this.diagnoseForm.patchValue(res);
      });
  }
  SearchObserver() {
    this.searchWatch.pipe(debounceTime(1000)).subscribe(x => {
      this.searchParam = x;
      that.getClinicalTableDiseases();
    });
  }
  getCronicDiseases() {
    this.subs.sink = this.patientsService.getDiseaseCategories().subscribe(
      (res: any) => {
        this.cronicDiseaseList = res;
      },
      err => {
        // console.log(err);
      }
    );
  }
  getDependentDiseases(id: number) {
    this.LoadingData = true;
    this.subs.sink = this.patientsService.getDiseaseBYCategoryId(id).subscribe(
      (res: Array<any>) => {
        this.LoadingData = false;
        this.chronicDependentDiseases = res;
      },
      err => {
        this.LoadingData = false;
        // console.log(err);
      }
    );
  }
  getClinicalTableDiseases() {
    this.LoadingData = true;
    this.chronicDiseasesByUrl = new Array<{ code: string; detail: string }>();
    this.subs.sink = this.patientsService
      .getCLinicalDiseases(this.searchParam)
      .subscribe(
        (res: any) => {
          this.LoadingData = false;
          res[3].forEach(item => {
            this.chronicDiseasesByUrl.push({ code: item[0], detail: item[1] });
          });
          if (
            this.chronicDiseasesByUrl &&
            this.chronicDiseasesByUrl.length === 1
          ) {
            this.selectedCronicDisease = this.chronicDiseasesByUrl[0];
            this.diseaseSelected(this.selectedCronicDisease);
          } else if (this.chronicDiseasesByUrl && this.chronicDiseasesByUrl.length > 0 && this.selectItem && this.selectItem.icdCode) {
            this.chronicDiseasesByUrl.forEach(x => {
              const sCode = this.selectItem.icdCode.replace('.', '');
              const searchCode = x.code.replace('.', '');
              if (sCode.toLowerCase() === searchCode.toLowerCase()) {
                this.selectedCronicDisease = x;
              }
            });
          }
          // console.log(this.chronicDiseasesByUrl);
        },
        err => {
          this.LoadingData = false;
          // console.log(err);
        }
      );
  }
  // customSearchFn(term: string, item: any) {
  //     that.searchParam = term;
  //     that.searchWatch.next(term);
  // }

  diseaseSelected(item: any) {
    this.diagnoseForm.get('isOnCcm').setValue(false);
    this.diagnoseForm.get('isOnRpm').setValue(false);
    this.showRMPCheckedWarning = false;
    if (item) {
      this.diagnose.icdCode = item.code;
      this.diagnose.description = item.detail;
      this.checkIcdCodeExist();
      // this.checkIfDiagnoseOnRPM();
      this.IsDiseaseOnServices(item.code);
    }

    // if (this.selectedCronicDisease) {
    //   this.diagnoseForm.get('icdCode').setValue(this.selectedCronicDisease['code']);
    //   this.diagnoseForm
    //     .get('icdCodeSystem')
    //     .setValue('10');
    // }
  }
    adddiagnose() {
    Object.assign(this.diagnose, this.diagnoseForm.value);
    if (this.diagnose.isChronic == null) {
      this.diagnose.isChronic = true;
    }
    if (this.diagnose.addToChronic == null) {
      this.diagnose.addToChronic = false;
    }
    this.diagnose.patientId = +this.route.pathFromRoot[3].snapshot.paramMap.get(
      'id'
    );
    if (this.securityService.securityObject.userType === UserType.Patient) {
      this.diagnose.patientId = this.securityService.securityObject.id;
    }
    if (this.diagnose.diagnosisDate && this.diagnose.resolvedDate) {
      const sTime = moment(this.diagnose.diagnosisDate, 'YYYY-MM-DD');
      const eTime = moment(this.diagnose.resolvedDate, 'YYYY-MM-DD');
      const res = sTime.isBefore(eTime);
      if (!res) {
        // window.alert("Stop date must be after start date");
        this.openConfirmModal2();
        this.diagnoseForm.get('diagnosisDate').setValue('');
        this.diagnoseForm.get('resolvedDate').setValue('');
        this.diagnose.diagnosisDate = '';
        this.diagnose.resolvedDate = '';

        return;
      }
    }
    if (this.saveAndAdd == 0) {
      this.addDiagnoseModal.hide();
    }
    if (!this.diagnoseId) {

      this.diagnose.icdCode = this.selectedCronicDisease.code;
      this.diagnose.description = this.selectedCronicDisease.detail;
    } else {
      this.diagnose.icdCode = this.selectItem.icdCode;
      this.diagnose.description = this.selectItem.description;
    }
      const fPDto = new DiagnosisDto();
    for (const filterProp in this.diagnose) {
      if (
        this.diagnose[filterProp] === null ||
        this.diagnose[filterProp] === undefined
      ) {
        this.diagnose[filterProp] = fPDto[filterProp];
        // this.FilterPatientDto[filterProp] = 0;
      }
    }
    this.subs.sink = this.patientsService
      .AddEditPatientDiagnosis(this.diagnose)
      .subscribe(
        (res: any) => {
          if (this.diagnose.id === 0) {
            this.toaster.success('Record Saved Successfully');
          } else {
            this.toaster.success('Record Updated Successfully.');
          }
          this.loadDiagnoses();
          this.diagnosesAddEditEmitter.emit(true);
          this.diagnose = new DiagnosisDto();

          this.clearChronicDisease();
          this.diagnoseForm.reset();
          this.resetDiagnoses();
          // this.selectedCronicDisease.icdCode='';
          // this.selectedCronicDisease.description ='';

          // this.selectedCronicDisease.description = "";
          // this.selectedCronicDisease.icdCode = "";
          // this.selectedCronicDisease.detail = "";
          // this.selectedCronicDisease.icdCodeSystem = "";
          // this.selectedCronicDisease.id = null;
          // this.closeModal.emit();
        },
        (error: HttpResError) => {
          this.toaster.error(error.error);
          // this.closeModal.emit();
        }
      );
  }
  openConfirmModal2() {
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Alert';
    modalDto.Text = 'Resolve date must be after Diagnose date';
    modalDto.hideProceed = true;
    modalDto.callBack = this.callBack2;
    // modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack2 = (data: any) => {};
  getDiseases() {
    this.subs.sink = this.questionService.getCCMDiseases().subscribe(
      (res: any) => {
        this.diseaseList = res;
      },
      err => {}
    );
  }
  deletePatientDiagnosis(row: any) {
    // if (confirm("Are you sure to delete " + row.patientName + "Diagnose")) {
    this.isLoading = true;
    this.deleteDiagnoseDto.diagnosisId = row.id;
    this.deleteDiagnoseDto.patientId = row.patientId;
    this.subs.sink = this.patientsService
      .deletePatientDiagnosis(this.deleteDiagnoseDto)
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          this.toaster.success('Record Deleted Successfully.');
          this.loadDiagnoses();
          this.diagnosesAddEditEmitter.emit(true);
        },
        err => {
          this.isLoading = false;
          this.toaster.error(err.error);
        }
      );
    // }
  }
  openConfirmModal(data: any) {
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Delete Diagnose';
    modalDto.Text = 'Are you sure to delete Diagnose';
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.deletePatientDiagnosis(data);
  }
  clearChronicDisease() {
    this.chronicDiseasesByUrl = new Array<{ code: string; detail: string }>();
    if (this.selectedCronicDisease) {
      this.selectedCronicDisease = {
        code: '',
        detail: ''
      };
    }
  }
  resetDiagnoses() {
    this.diagnoseId = 0;
    this.diagnose = new DiagnosisDto();
    // this.diagnoseForm.reset();
    this.clearChronicDisease();
    this.diagnoseForm
      .get('diagnosisDate')
      .setValue(moment().format('YYYY-MM-DD'));
    this.diagnoseForm.get('diagnosisDate').setValue('');
    this.diagnoseForm.get('id').setValue(0);
    this.diagnoseForm.get('isChronic').setValue(true);
    this.diagnoseForm.get('addToChronic').setValue(false);
    this.diagnoseForm.get('isOnCcm').setValue(false);
    this.diagnoseForm.get('isOnRpm').setValue(false);
    this.diagnoseForm.get('note').setValue('');
    this.diagnoseForm
      .get('resolvedDate')
      .setValue(moment().format('YYYY-MM-DD'));
    this.diagnoseForm.get('resolvedDate').setValue('');
    this.diseaseOnServicesDto.isOnRpm=false;
    this.diseaseOnServicesDto.isOnCcm=false;
  }
  checkNoAction() {
    if (this.isNoAction) {
      this.diagnoseId = 0;
      this.diagnose = new DiagnosisDto();
      this.clearChronicDisease();
      this.diagnoseForm.get('diagnosisDate').setValue('NA');
      this.diagnoseForm.get('id').setValue(0);
      this.diagnoseForm.get('isChronic').setValue(false);
      this.diagnoseForm.get('addToChronic').setValue(false);
      this.diagnoseForm.get('isOnRpm').setValue(false);
      this.diagnoseForm.get('note').setValue('');
      this.diagnoseForm.get('resolvedDate').setValue('');
    } else {
      this.resetDiagnoses();
    }
  }
  checkIcdCodeExist() {
    this.isIcdCodeExist = false;
    if (this.diagnose.icdCode) {
    // this.addICDCodeDto.chronicConditionId = this.diagnose.icdCode;
    this.patientsService.CheckIcdCodeExist(this.diagnose.icdCode).subscribe(
      (res: boolean) => {
        this.isIcdCodeExist = res;
        if(res) {
          // this.toaster.warning("Already marked as chronic disease");
        }
      },
      (error: HttpResError) => {
        this.isIcdCodeExist = false;
        this.toaster.error(error.error, error.message);
      }
    );
    }
  }
  checkIfDiagnoseOnRPM() {
    if (this.diagnose.icdCode) {
    // this.addICDCodeDto.chronicConditionId = this.diagnose.icdCode;
      this.patientsService.IsDiseaseOnRpm(this.diagnose.icdCode).subscribe(
        (res: boolean) => {
          this.RPMDiagnosesCheckState = {
            icdCode: this.diagnose.icdCode,
            isOnRpm: res === true ? true : false
          }
          if (res === true) {
            this.diagnoseForm.get('isOnRpm').setValue(true);
          } else {
            this.diagnoseForm.get('isOnRpm').setValue(false);
          }
          if (this.diagnoseId) {
            this.diagnoseForm.get('isOnRpm').setValue(this.selectItem['isOnRpm']);
          }
          this.IsOnRPmChanged();
        },
        (error: HttpResError) => {
          this.RPMDiagnosesCheckState = {
            icdCode: this.diagnose.icdCode,
            isOnRpm: false
          }
          if (this.diagnoseId) {
            this.diagnoseForm.get('isOnRpm').setValue(this.selectItem['isOnRpm']);
          }
          this.IsOnRPmChanged();
          // this.toaster.error(error.error, error.message);
        }
      );
    }
  }
  IsOnRPmChanged(event?: MdbCheckboxChange) {
    const isOnRpm = this.diagnoseForm.get('isOnRpm').value;
    if (isOnRpm && this.RPMDiagnosesCheckState?.icdCode && !this.RPMDiagnosesCheckState?.isOnRpm) {
      this.showRMPCheckedWarning = true;
    } else {
      this.showRMPCheckedWarning = false;
    }
  }
  updateDiagnosisDateById(modal: any) {
    this.assigningDate = true;
    if (this.assignedDateProp == null) {
      this.assignedDateProp = '';
    }
    this.patientsService.UpdateDiagnosisDateById(this.selectedRow.id, this.assignedDateProp).subscribe(
      (res: boolean) => {
        modal.hide();
        this.loadDiagnoses();
        this.assigningDate = false;
        this.toaster.success('Added Successfully');
      },
      (error: HttpResError) => {
        this.assigningDate = false;
        this.toaster.error(error.error, error.message);
      }
    );
    }
    IsDiseaseOnServices(code){
      this.patientsService.IsDiseaseOnServices(code).subscribe((res: DiseaseOnServicesDto) =>{
        this.diseaseOnServicesDto = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      })
    }
  ExternalRequestEdit(row: DiagnosisDto) {
    this.resetDiagnoses();
    this.selectItem = row as any;
    this.getDiagnoseById(row.id);
  }
  ExternalAddNew(row: DiagnosisDto) {
    this.resetDiagnoses();
    this.diagnoseForm.get('id').setValue(0);
    this.diagnoseForm.get('isChronic').setValue(false);
    this.diagnoseForm.get('addToChronic').setValue(false);
    this.diagnoseForm.get('isOnRpm').setValue(false);
    this.diagnoseForm.get('note').setValue(row.note);
    this.diagnoseForm.get('diagnosisDate').setValue(row.diagnosisDate || '');
    this.diagnoseForm.get('resolvedDate').setValue(row.resolvedDate || '');
    this.addDiagnoseModal.show();
    this.searchParam = row.description;
    that.getClinicalTableDiseases();
  }
  getInfo(icdCode){
    this.url = `https://connect.medlineplus.gov/application?mainSearchCriteria.v.c=${icdCode}&mainSearchCriteria.v.cs=2.16.840.1.113883.6.90&mainSearchCriteria.v.dn=&informationRecipient.languageCode.c=en`;
    // window.open(this.url, "_blank");
    window.open(this.url, "_blank", "resizable=yes, scrollbars=yes, titlebar=no, width=800, height=900, top=10, left=10, location=no");
  }
}
