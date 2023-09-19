import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input, AfterViewChecked, AfterContentChecked, EventEmitter, Output } from '@angular/core';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { ActivatedRoute } from '@angular/router';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { MedicationDto, DeleteDiagnoseDto, DeleteMedicationDto } from 'src/app/model/Patient/patient.model';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UserType } from 'src/app/Enums/UserType.enum';
import { SecurityService } from 'src/app/core/security/security.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import { SubSink } from 'src/app/SubSink';
// @Pipe({
//     name: 'dateFormatPipe',
// })
@Component({
  selector: "app-medication",
  templateUrl: "./medication.component.html",
  styleUrls: ["./medication.component.scss"],
  providers: [DatePipe]
})
export class MedicationComponent implements OnInit, AfterContentChecked, OnDestroy {
  @Output() medicationAddEditEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() awId: number;
@Input() awDisable: boolean;
  private subs = new SubSink();
  isLoading = false;
  nkdaCheck = false;
  searchWatch = new Subject<string>();
  selectedMed: any;
  rows = [];
  isHideAction: number;
  medicinesList = new Array<{ id: number; name: string }>();
  selectedSearch: { id: number; name: string };
  PatientId: number;
  deleteMedicationDto = new DeleteMedicationDto();
  medicationDto = new MedicationDto();
  // @ViewChild('rxNormCode') rxNormCode: ElementRef;
  // @ViewChild('medicationName') medicationName: ElementRef;
  // @ViewChild('dose') dose: ElementRef;
  // @ViewChild('originalStartDate') originalStartDate: ElementRef;
  // @ViewChild('ndcId') ndcId: ElementRef;
  // @ViewChild('route') routee: ElementRef;

  // medicationName.reset();
  // dose
  // route
  // originalStartDate
  // ndcId
  // rxNormCode
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM-DD"
  };
  public displayDate;
  saveAndAdd = 0;
  seleteddate = new Date();
  synonmsList: any;
  @Input() bhiPatientId: number;
  @Input() PRCMPatientId: number;
  @Input() hideListView: boolean;
  @Input() careplanView: boolean;
  isLoadingMedicine: boolean;
  @ViewChild("addMedicationMOdal") addMedicationMOdal: ModalDirective;
  @Output() medicationListEmitter: EventEmitter<MedicationDto[]> = new EventEmitter<MedicationDto[]>();
  url: string;
  constructor(
    private securityService: SecurityService,
    private patientsService: PatientsService,
    private appUi: AppUiService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private toaster: ToastService
  ) {}

  ngOnInit() {
    this.PatientId = +this.route.snapshot.paramMap.get('id');
    if (!this.PatientId) {
      this.PatientId = +this.route.pathFromRoot[3]?.snapshot?.paramMap?.get("id");
    }
    if (this.securityService.securityObject.userType === UserType.Patient) {
      this.PatientId = this.securityService.securityObject.id;
      this.isHideAction = this.securityService.securityObject.id;
    }
    this.loadPatientDetail();
    this.SearchObserver();
  }
  ngAfterContentChecked(): void {
    if (this.bhiPatientId || this.PRCMPatientId) {
      const eded = $('#disableMedica54View').find('input, textarea, button, select');
      eded.prop('disabled', true);
    }
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  SearchObserver() {
    this.searchWatch.pipe(debounceTime(1000)).subscribe(x => {
      if (x) {
        this.loadMedicinesList(x);
      }
    });
  }
  loadMedicinesList(searchParam: string) {
    this.isLoadingMedicine = true;
    this.medicinesList = [];
    this.subs.sink = this.patientsService.getMedicinesList(searchParam).subscribe(
      (res: any) => {
        this.isLoadingMedicine = false;
        this.medicinesList = res;
        if (this.medicinesList.length === 0) {
          this.synonmsList = [];
          let searchParamObj= {
            name: searchParam
          }
          this.synonmsList.push(searchParamObj);
          this.medicationDto.medicationName = searchParam;
        }
      },
      error => {
        this.isLoadingMedicine = false;
      }
    );
  }
  editMedication(row: MedicationDto) {
    this.selectedMed = row.medicationName;
    Object.assign(this.medicationDto, row);
  }
  onActivate(event: any) {
    if (event.type === "click") {
      // id: number = +event.row.id;
    }
  }
  updateMedicineDto(){
    if(this.selectedMed){
      this.medicationDto.medicationName = this.selectedMed.name;
      this.medicationDto.rxCui = this.selectedMed.rxcui;
    }
  }
  getSynonyms() {
    if (this.selectedSearch) {
      this.isLoadingMedicine = true;
      this.synonmsList = [];
      this.medicationDto.medicationName = null;
      this.subs.sink = this.patientsService
        .GetTermTypeSynonyms(this.selectedSearch.name)
        .subscribe(
          (res: any) => {
            this.isLoadingMedicine = false;
            if(this.selectedMed){
              this.selectedMed = null;
            }
            if (res.length === 0) {
              this.synonmsList = [{'name' : this.selectedSearch.name}];
              this.medicationDto.medicationName = this.selectedSearch.name;
              return;
            }
            if (Array.isArray(res)) {
              this.synonmsList = res;
            } else {
              this.synonmsList = [];
            }
          },
          error => {
            this.isLoadingMedicine = false;
          }
        );
    } else {
      this.medicationDto.medicationName = null;
      this.synonmsList = [];
    }
  }

  loadPatientDetail() {
    if (this.PatientId) {
      this.isLoading = true;

      this.subs.sink = this.patientsService
        .getPatientMedications(this.PatientId, this.awId)
        .subscribe(
          (res: any) => {
            this.isLoading = false;
            this.medicationListEmitter.emit(res || []);
            if (Array.isArray(res)) {
              this.rows = res;
              if (this.rows && this.rows.length > 1) {
                this.rows.forEach(item => {
                  if (item.dose === `Not Applicable` && item.medicationName === `No Active Medications`) {
                    this.deleteMedication(item);
                  }
                });
              }
            }
          },
          error => {
            this.isLoading = false;
          }
        );
    }
  }
  dateformat(medication) {
    medication.startDate = this.datePipe.transform(
      medication.startDate,
      "yyyy-MM-dd"
    );
    medication.originalStartDate = this.datePipe.transform(
      medication.originalStartDate,
      "yyyy-MM-dd"
    );
    medication.stopDate = this.datePipe.transform(
      medication.stopDate,
      "yyyy-MM-dd"
    );
  }
  addMedication() {
    this.medicationDto.patientId = this.PatientId;
    if (this.medicationDto.startDate && this.medicationDto.stopDate) {
      const sTime = moment(this.medicationDto.startDate, "YYYY-MM-DD");
      const eTime = moment(this.medicationDto.stopDate, "YYYY-MM-DD");
      const res = sTime.isBefore(eTime);
      if (!res) {
        // window.alert("Stop date must be after start date");
        this.openConfirmModal2();
        this.medicationDto.startDate = "";
        this.medicationDto.stopDate = "";

        return;
      }
    }
    this.isLoading = true;
    this.subs.sink = this.patientsService
      .addUpdateMedication(this.medicationDto)
      .subscribe(
        (res: any) => {
          if (this.medicationDto.id === 0) {
            this.toaster.success("Record Saved Successfully");
          } else {
            this.toaster.success("Record Updated Successfully");
          }
          this.isLoading = false;
          if (this.saveAndAdd == 0) {
            this.addMedicationMOdal.hide();
          }
          this.loadPatientDetail();
          this.medicationAddEditEmitter.emit(true);
        },
        err => {
          this.isLoading = false;
          this.addMedicationMOdal.hide();
          this.toaster.error(err.message, err.error || err.error);
        }
      );
    // this.selectedSearch.name =;
    if (this.selectedSearch) {
      this.selectedSearch.id = null;
    }
  }
  openConfirmModal2() {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Alert";
    modalDto.Text = "Stop date must be after start date";
    modalDto.hideProceed = true;
    modalDto.callBack = this.callBack2;
    // modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack2 = (data: any) => {};
  deleteMedication(row: any) {
    // if (confirm("Are you sure to delete " + row.patientName + "Medication")) {
    this.isLoading = true;
    this.deleteMedicationDto.medicationId = row.id;
    this.deleteMedicationDto.patientId = row.patientId;
    this.subs.sink = this.patientsService
      .deleteMedication(this.deleteMedicationDto)
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          this.toaster.success("Patient Medication deleted successfully");
          this.loadPatientDetail();
        },
        err => {
          this.isLoading = false;
          this.toaster.error(err.message, err.error || err.error);
        }
      );
    // }
  }
  openConfirmModal(data: any) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Delete Medication";
    modalDto.Text = "Are you sure to delete Medication";
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.deleteMedication(data);
  };
  resetMedication() {
    this.selectedSearch = { id: null, name: null };
    this.medicationDto = new MedicationDto();
  }
  nkdaChecked() {
    if (this.nkdaCheck) {
      this.medicationDto.medicationName = `No Active Medications`;
      this.medicationDto.dose = `Not Applicable`;
    } else {
      this.medicationDto.medicationName = ``;
      this.medicationDto.dose = ``;
    }
  }
  ExternalAddRequest(row: MedicationDto) {
    this.editMedication(row);
    this.dateformat(this.medicationDto);
    this.addMedicationMOdal.show();
  }
  ExternalRequestEdit(row: MedicationDto) {
    this.editMedication(row);
    this.dateformat(this.medicationDto);
    this.addMedicationMOdal.show();
  }
  getInfo(rxCui){
    this.url = `https://connect.medlineplus.gov/application?mainSearchCriteria.v.c=${rxCui}&mainSearchCriteria.v.cs=2.16.840.1.113883.6.88&mainSearchCriteria.v.dn=&informationRecipient.languageCode.c=en`;
    // window.open(this.url, "_blank");
    window.open(this.url, "_blank", "resizable=yes, scrollbars=yes, titlebar=no, width=800, height=900, top=10, left=10, location=no");
  }
  clearData(){
    this.medicationDto = new MedicationDto();
    this.selectedMed = null;
    this.selectedSearch = null;
  }
}
