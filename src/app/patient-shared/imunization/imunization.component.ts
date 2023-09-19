import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { ActivatedRoute } from '@angular/router';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { MedicationDto, DeleteImmunizationDto } from 'src/app/model/Patient/patient.model';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UserType } from 'src/app/Enums/UserType.enum';
import { SecurityService } from 'src/app/core/security/security.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ToastService } from 'ng-uikit-pro-standard';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-imunization',
  templateUrl: './imunization.component.html',
  styleUrls: ['./imunization.component.scss']
})
export class ImunizationComponent implements OnInit {
  @Input() awId: number;
@Input() awDisable: boolean;
  @ViewChild('vacDate') dateRef: NgModel;
  isLoading = false;
  nkdaCheck = false;
  deleteImmunizationDto = new DeleteImmunizationDto();
  rows = [];
  isHideAction: number;
  vaccinationCodesList = new Array<{
    id: number;
    code: number;
    description: string;
    date: string;
    note: string;
  }>();
  vaccinationDto = {
    id: 0,
    date: '',
    note: '',
    vaccinationCodeId: 0,
    patientId: 0
  };
  PatientId: number;
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
    format: 'YYYY-MM-DD'
  };
  public displayDate;
  seleteddate = new Date();
  synonmsList: string[];
  isLoadingMedicine: boolean;
  dateValidation: boolean;

  constructor(
    private securityService: SecurityService,
    private patientsService: PatientsService,
    private appUi: AppUiService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private toaster: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get('id');
    if (this.securityService.securityObject.userType === UserType.Patient) {
      this.PatientId = this.securityService.securityObject.id;
      this.isHideAction = this.securityService.securityObject.id;
    }
    this.GetVaccinationCodes();
    this.loadPatientDetail();
  }
  ngAfterViewChecked() {
    //your code to update the model
    this.cdr.detectChanges();
  }
  // SearchObserver() {
  //   this.vaccinationCode.pipe(
  //     debounceTime(1000),
  //   ).subscribe(x => {
  //     if (x) {
  //       this.GetVaccinationCodes(x);
  //     }
  //   });
  // }
  GetVaccinationCodes() {
    this.isLoading = true;
    this.vaccinationCodesList = [];
    this.patientsService.GetVaccinationCodes().subscribe(
      (res: any) => {
        this.isLoading = false;
        this.vaccinationCodesList = res;
      },
      error => {
        this.isLoading = false;
      }
    );
  }
  editVaccination(row: any) {
    Object.assign(this.vaccinationDto, row);
  }
  onActivate(event: any) {
    if (event.type === 'click') {
      // id: number = +event.row.id;
    }
  }
  loadPatientDetail() {
    if (this.PatientId) {
      this.isLoading = true;
      this.patientsService.GetImmunizationsOfPatient(this.PatientId, this.awId).subscribe(
        (res: any) => {
          this.isLoading = false;
          if (Array.isArray(res)) {
            this.rows = res;
            if (this.rows && this.rows.length > 1) {
              if (this.vaccinationCodesList && this.vaccinationCodesList.length) {
                const vacc = this.vaccinationCodesList.find(x => x.code.toString() === `99999`);
                this.rows.forEach(item => {
                  if (item.note === `No Immunization Record` && vacc && item.vaccinationCodeId === vacc.id) {
                    this.deleteImmunization(item);
                  }
                });
              }
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
    this.vaccinationDto.date = this.datePipe.transform(
      medication.date,
      'yyyy-MM-dd'
    );
  }
  addMedication() {
    this.isLoading = true;
    this.vaccinationDto.patientId = this.PatientId;
    this.patientsService
      .AddEditImmunizationForPatient(this.vaccinationDto)
      .subscribe(
        (res: any) => {
          if (this.vaccinationDto.id === 0) {
            this.toaster.success('Record Saved Successfully');
          } else {
            this.toaster.success('Record Updated Successfully');
          }
          this.isLoading = false;
          this.loadPatientDetail();
        },
        err => {
          this.isLoading = false;
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }

  deleteImmunization(row: any) {
    // if (confirm("Are you sure to delete Immunization")) {
    this.isLoading = true;
    this.deleteImmunizationDto.immunizationId = row.id;
    this.deleteImmunizationDto.patientId = row.patientId;
    this.patientsService
      .DeletePatientImmunization(this.deleteImmunizationDto)
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          this.toaster.success('Immunization deleted successfully');
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
    modalDto.Title = 'Delete Immunization';
    modalDto.Text = 'Are you sure to delete Immunization';
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.deleteImmunization(data);
  };

  resetImmunization() {
    this.vaccinationDto = {
      id: 0,
      date: '',
      note: '',
      vaccinationCodeId: null,
      patientId: 0
    };
    this.dateRef.control.clearValidators();
  }
  checkvalidation() {
    if (this.dateRef.touched && !this.vaccinationDto.date) {
      this.dateValidation = true;
    } else {
      this.dateValidation = false;
    }
  }
  nkdaChecked() {
    if (this.nkdaCheck) {
      this.vaccinationDto.vaccinationCodeId = this.vaccinationCodesList.find(x => x.code.toString() === `99999`).id;
      this.vaccinationDto.note = `No Immunization Record`;
      this.vaccinationDto.date = this.datePipe.transform(
        new Date(),
        'yyyy-MM-dd'
      );
    } else {
      this.resetImmunization();
    }
  }
}

