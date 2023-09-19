import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalDirective, ToastService } from "ng-uikit-pro-standard";
import { Subject } from "rxjs";
import { AppAdminService } from "src/app/core/administration/app-admin.service";
import { PatientsService } from "src/app/core/Patient/patients.service";
import { BhiStatusEnum } from "src/app/Enums/bhi.enum";
import {
  CcmStatus,
  PatientStatus,
  RpmStatus,
} from "src/app/Enums/filterPatient.enum";
import { PcmStatus } from "src/app/Enums/pcm.enum";
import { AppStatistics, LazyModalDto } from "src/app/model/AppModels/app.model";
import { HttpResError } from "src/app/model/common/http-response-error";
import { debounceTime } from "rxjs/operators";
import {
  DeletPatientDto,
  PatientDetailsForAdmin,
  SearchPatient,
} from "src/app/model/Patient/patient.model";
import { SubSink } from "src/app/SubSink";
import { AppUiService } from "src/app/core/app-ui.service";
import { SecurityService } from "src/app/core/security/security.service";
import { UserType } from "src/app/Enums/UserType.enum";

@Component({
  selector: "app-search-patients",
  templateUrl: "./search-patients.component.html",
  styleUrls: ["./search-patients.component.scss"],
})
export class SearchPatientsComponent implements OnInit {
  @ViewChild("deletePatientModal") deletePatientModal: ModalDirective;
  @ViewChild("patientStatusCHangeModal")
  patientStatusCHangeModal: ModalDirective;
  searchCriteria = 3;
  searchPatientsDto = new SearchPatient();
  patientSearchMode = true;
  private subs = new SubSink();
  deletePatientDto = new DeletPatientDto();
  appStatistics = new AppStatistics();
  patientData = new PatientDetailsForAdmin();
  patientList = [];
  filterPatientId: number;
  patientStatusEnum = PatientStatus;
  deactivateReason = "";
  deactivateStatus: PatientStatus;

  ccmStatusEnum = CcmStatus;
  pcmStatusEnum = PcmStatus;
  bhiStatusEnum = BhiStatusEnum;
  rpmStatusEnum = RpmStatus;
  isSearchingPatient: boolean;
  searchWatch = new Subject<string>();
  isInActivatingPatient: boolean;

  constructor(
    private patientsService: PatientsService,
    private toaster: ToastService,
    private appAdminService: AppAdminService,
    private appUi: AppUiService,
    private securityService: SecurityService,
  ) {}

  ngOnInit() {
    this.getAppStatistics();
    this.searchObserver();
  }
  searchObserver() {
    this.searchWatch.pipe(debounceTime(1000)).subscribe((x) => {
      if (!x) {
        this.patientList = []
        return;
      }
      if (this.searchCriteria == 1) {
        if(typeof +x == 'number' && +x > 0) {
          this.searchPatientsDto.patientId = +x;
        } else {
          this.toaster.warning(`Please enter a valid id`);
          return;
        }
      } else if (this.searchCriteria == 2) {
        this.searchPatientsDto.emrId = x;
      }else if (this.searchCriteria == 4) {
        this.searchPatientsDto.phoneNo = x;
      } else {
        this.searchPatientsDto.fullName = x;
      }
      this.searchPatient();
    });
  }
  getAppStatistics() {
    this.appAdminService.GetAppStatistics().subscribe(
      (res: AppStatistics) => {
        this.appStatistics = res;
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  getPatientDetailsById(filterPatientId) {
    this.patientsService.GetPatientDetailsById(filterPatientId).subscribe(
      (res: any) => {
        this.patientData = res;
        console.log(this.patientData )
        this.isSearchingPatient = false;
        this.patientSearchMode = false;
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
        this.isSearchingPatient = false;
      }
    );
  }
  searchPatient() {
    this.isSearchingPatient = true;

    if (this.securityService.securityObject.userType == UserType.FacilityUser) {
      this.searchPatientsDto.facilityId = +this.securityService.getClaim('FacilityId')?.claimValue;
    }
    this.patientsService
      .SearchPatients(this.searchPatientsDto)
      .subscribe((res: any) => {
        this.patientList = res;
        this.isSearchingPatient = false;
      }),
      (error: HttpResError) => {
        this.toaster.error(error.message);
        this.isSearchingPatient = false;
      };
  }
  MarkPatientInActive() {
    this.isInActivatingPatient = true;
    this.subs.sink = this.patientsService
      .MarkPatientInActive(
        this.patientData.id,
        this.deactivateStatus,
        this.deactivateReason
      )
      .subscribe(
        (res: any) => {
          this.patientData.patientStatus = this.deactivateStatus;
          this.isInActivatingPatient = false;
          this.patientStatusCHangeModal.hide();
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
          this.isInActivatingPatient = false;
        }
      );
  }
  // confirmDelete(patient: PatientDetailsForAdmin) {
  //   const modalDto = new LazyModalDto();
  //   modalDto.Title = "Delete Patient";
  //   modalDto.Text = "Do you want to delete this patient?";
  //   modalDto.callBack = this.DeletePatientCallBack;
  //   modalDto.data = patient;
  //   this.appUi.openLazyConfrimModal(modalDto);
  // }
  confirmRecover(patient: PatientDetailsForAdmin) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Recover Patient";
    modalDto.Text = "Do you want to Recover this patient?";
    modalDto.callBack = this.RecoverPatientCallBack;
    modalDto.data = patient;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  RecoverPatientCallBack = (patient: PatientDetailsForAdmin) => {
    this.subs.sink = this.patientsService
      .ReActivateDeletedPatient(patient.patientEmrId, patient.facilityId)
      .subscribe(
        (res: any) => {
          this.patientData.patientStatus = PatientStatus.Active;
          this.patientSearchMode = true;
          this.toaster.success(`Patient Reactivated`)
        },
        (err: HttpResError) => {
          this.toaster.error(err.error, err.message);
        }
      );
  };
  confirmReActive(patient: PatientDetailsForAdmin) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Reactivate Patient";
    modalDto.Text = "Do you want to Reactivate this patient?";
    modalDto.callBack = this.ReactivatePatientCallBack;
    modalDto.data = patient;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  ReactivatePatientCallBack = (patient: PatientDetailsForAdmin) => {
    this.subs.sink = this.patientsService
      .ReactivatePatient(patient.id)
      .subscribe(
        (res: any) => {
          this.patientData.patientStatus = PatientStatus.Active;
        },
        (err: HttpResError) => {
          this.toaster.error(err.error, err.message);
        }
      );
  };
  deletePatient(){
    console.log(this.deletePatientDto)
    this.subs.sink = this.patientsService
      .deletePatient(this.deletePatientDto)
      .subscribe(
        (res: any) => {
          this.deletePatientDto.reasonDeleteDetails = "";
          this.deletePatientDto.reasonDeleted = 0;
          this.toaster.success('Patient deleted successfully');
          this.deletePatientModal.hide();
          this.navigateToSearchMode();
        },
        (err: HttpResError) => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }
  resetSearchPatientDtoValue() {
    this.searchPatientsDto = new SearchPatient();
  }
  navigateToSearchMode(){
    this.patientSearchMode = true ;
    this.filterPatientId = null;
    this.patientList=[];
  }
}
