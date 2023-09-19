import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Input,
  EventEmitter,
  Output
} from "@angular/core";
import { PatientsService } from "src/app/core/Patient/patients.service";
import { ActivatedRoute } from "@angular/router";
import { IDatePickerConfig, ECalendarValue } from "ng2-date-picker";
import {
  AllergyDto,
  DeleteAllergyDto
} from "src/app/model/Patient/patient.model";
import { DatePipe } from "@angular/common";
import { UserType } from "src/app/Enums/UserType.enum";
import { SecurityService } from "src/app/core/security/security.service";
import { ModalDirective, ToastService } from "ng-uikit-pro-standard";
import { LazyModalDto } from "src/app/model/AppModels/app.model";
import { AppUiService } from "src/app/core/app-ui.service";
import { NgModel } from "@angular/forms";
import {AllergyTypes,AllergyCategory,AllergyClinicalStatus,AllergyCriticality} from "src/app/Enums/allergy.enum"

@Component({
  selector: "app-allergies",
  templateUrl: "./allergies.component.html",
  styleUrls: ["./allergies.component.scss"]
})
export class AllergiesComponent implements OnInit {
  @ViewChild("addAllergyModal") addAllergyModal: ModalDirective;
  @Input() awId: number;
@Input() awDisable: boolean;
@Input() careplanView: boolean;
@Output() allergiesAddEditEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild("date") dateRef: NgModel;
  isLoading = false;
  rows = [];
  isHideAction: number;
  allergyList = new Array<AllergyDto>();
  allergyDto = new AllergyDto();
  PatientId: number;
  dateValidation: boolean;
  deleteAllergyDto = new DeleteAllergyDto();
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM-DD"
  };
  public displayDate;
  seleteddate = new Date();
  synonmsList: string[];
  isLoadingMedicine: boolean;
  allergyTypesEnum = AllergyTypes;
  allergyClinicalStatusEnum = AllergyClinicalStatus;
  allergyCriticalityEnum = AllergyCriticality;
  allergyCategoryEnum = AllergyCategory;
  nkda = false;
  @Input() hideListView: boolean;
  @Output() allergiesListEmitter: EventEmitter<AllergyDto[]> = new EventEmitter<AllergyDto[]>();

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
    this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get("id");
    if (this.securityService.securityObject.userType === UserType.Patient) {
      this.PatientId = this.securityService.securityObject.id;
      this.isHideAction = this.securityService.securityObject.id;
    }
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
  editVaccination(row: any) {
    Object.assign(this.allergyDto, row);
  }
  onActivate(event: any) {
    if (event.type === "click") {
      // id: number = +event.row.id;
    }
  }
  loadPatientDetail() {
    if (this.PatientId) {
      this.isLoading = true;
      this.patientsService.getPatientAllergies(this.PatientId, this.awId).subscribe(
        (res: any) => {
          this.isLoading = false;
          this.rows = [];
          if (Array.isArray(res)) {
            this.rows = res;
            if (this.rows && this.rows.length > 1) {
                this.rows.forEach(item => {
                  if (item.type === -1 && item.category === -1) {
                    this.deleteAllergy(item);
                  }
                });
            }
          }
          this.allergiesListEmitter.emit(this.rows);
        },
        error => {
          this.isLoading = false;
        }
      );
    }
  }
  dateformat(medication) {
    if (medication.createdOn) {
      this.allergyDto.date = this.datePipe.transform(
        medication["createdOn"],
        "yyyy-MM-dd"
      );
    }
    else if (medication.date) {
      this.allergyDto.date = this.datePipe.transform(
        medication["date"],
        "yyyy-MM-dd"
      );
    }
  }
  defaultSetDate() {
    let now = new Date();
    this.allergyDto.date = this.datePipe.transform(now, 'yyyy-MM-dd');
  }

  addAllergy() {
    this.isLoading = true;
    this.allergyDto.patientId = this.PatientId;
    this.patientsService.addAllergy(this.allergyDto).subscribe(
      (res: any) => {
        if (this.allergyDto.id === 0) {
          this.toaster.success("Record Saved Successfully");
        } else {
          this.toaster.success("Record Updated Successfully");
        }
        this.isLoading = false;
        this.allergyDto = new AllergyDto();
        this.loadPatientDetail();
        this.allergiesAddEditEmitter.emit(true);
      },
      error => {
        this.isLoading = false;
        this.toaster.error(error.message, error.error || error.error);
      }
    );
  }

  deleteAllergy(row: any) {
    // if (confirm("Are you sure to delete Allergy")) {
    this.isLoading = true;
    this.deleteAllergyDto.allergyId = row.id;
    this.deleteAllergyDto.patientId = row.patientId;
    this.patientsService.DeletePatientAllergy(this.deleteAllergyDto).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.toaster.success("Allergy deleted successfully");
        this.loadPatientDetail();
        this.allergiesAddEditEmitter.emit(true);
      },
      error => {
        this.isLoading = false;
        this.toaster.error(error.message, error.error || error.error);
      }
    );
    // }
  }

  NKDAassignValues() {
    if (this.nkda) {
      // this.allergyDto.date =
      this.allergyDto.category = -1;
      this.allergyDto.clinicalStatus = -1;
      this.allergyDto.criticality = -1;
      this.allergyDto.type = -1;
      this.allergyDto.agent = 'NKDA';
      this.allergyDto.reaction = 'None'
    } else {
      this.allergyDto = new AllergyDto();
      this.defaultSetDate();
    }
  }



  openConfirmModal(data: any) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Delete Allergy";
    modalDto.Text = "Are you sure to delete Allergy";
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.deleteAllergy(data);
  };

  resetAllergy() {
    this.allergyDto = new AllergyDto();
    this.dateRef.control.clearValidators();
    this.defaultSetDate();
    //  this.dateRef.control.markAsUntouched();
  }
  checkvalidation() {
    if (this.dateRef.touched && !this.allergyDto.date) {
      this.dateValidation = true;
    } else {
      this.dateValidation = false;
    }
  }
  ExternalRequestEdit(mObj: AllergyDto) {
    this.dateValidation = false;
    this.editVaccination(mObj);
    this.dateformat(this.allergyDto);
    this.addAllergyModal.show();
  }
  ExternalAddRequest(mObj: AllergyDto) {
    this.resetAllergy();
    this.dateValidation = false;
    this.editVaccination(mObj);
    this.dateformat(this.allergyDto);
    this.addAllergyModal.show();
  }
}
