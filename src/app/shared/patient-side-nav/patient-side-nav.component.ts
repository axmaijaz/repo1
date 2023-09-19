import { paginationData } from './../../model/TeleMedicine/telemedicine.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import { AppDataService } from 'src/app/core/app-data.service';
import { PatientDto } from 'src/app/model/Patient/patient.model';
import { PRCMService } from 'src/app/core/prcm.service';
import { PatientsPRCMDataDto } from 'src/app/model/Prcm/Prcm.model';
import { DataFilterService } from 'src/app/core/data-filter.service';


@Component({
  selector: 'app-patient-side-nav',
  templateUrl: './patient-side-nav.component.html',
  styleUrls: ['./patient-side-nav.component.scss']
})
export class PatientSideNavComponent implements OnInit {
  @ViewChild('unApprovedCarePLanModal') unApprovedCarePLanModal: ModalDirective;
  PatientId: number;
  isCarePLanApproved = false;
  isLoading: boolean;
  patientData = new PatientDto();
  prcmPatientData = new PatientsPRCMDataDto();
  showValidationAlert: string;
  revokeType: string;
  constructor(private route: ActivatedRoute, private appData: AppDataService, private PRCMService: PRCMService,
     private appUi: AppUiService, private router: Router , private patientService: PatientsService, private toaster: ToastService, private filterDataService: DataFilterService) { }

  ngOnInit() {
    this.ModelForRevokeMR();
      this.PatientId = +this.route.snapshot.paramMap.get('id');
      if (!this.PatientId) {
        // this.PatientId = +this.route.pathFromRoot[2].children[0].snapshot.paramMap.get('id');
        this.PatientId = +this.route.snapshot.children[0].firstChild.paramMap.get('id');
      }
      if (!this.PatientId) {
        this.PatientId = this.route.snapshot.queryParams['patientID'];
      }
      this.getPatientDetail();
      this.checkCarePlanApproved();
      this.GetPatientsPRCMData();
      // if(this.addEditMAsterCareplanObj.isApprovedByBillingProvider === false) {
      // return;
      // } else {
      this.patientService.refreshPatient.subscribe((res: any) => {
        this.getPatientDetail();
      })
      // }
  }
  PrCMProceedNavigation() {
    this.router.navigateByUrl(
      // `/principalcare/PrcmEncounters/${row.id}`
      `/principalcare/PrcmEncounters/${this.PatientId}?prcmCareFacilitatorId=${this.prcmPatientData.end_PrCMCareFacilitatorId}&prcmSpecialistId=${this.prcmPatientData.end_PrCMSpecialistBillerId}`
      // ?psychiatristId=${row.psychiatristId}&PRCMCareManagerId=${row.PRCMCareManagerId}&PRCMStatus=${row.PRCMStatus}`
    );
  }
  getPatientDetail() {
    if (this.PatientId) {
      //  this.FacilityModal.show();
      this.patientService.getPatientDetail(this.PatientId).subscribe(
        (res: any) => {
            this.patientData = res;
            this.appData.summeryViewPatient = this.patientData;
        },
        error => {
        }
      );
    }
  }
  GetPatientsPRCMData() {
    if (this.PatientId) {
      //  this.FacilityModal.show();
      this.PRCMService.GetPatientsPRCMData(this.PatientId).subscribe(
        (res: any) => {
            this.prcmPatientData = res;
            // End_PrCMSpecialistBillerId

        },
        error => {
        }
      );
    }
  }
  checkCarePlanApproved() {
    this.patientService.IsCarePlanApproved(this.PatientId).subscribe((res: any) => {
      this.isCarePLanApproved = res;
    }, (err: HttpResError) => {
      this.toaster.error('Error retrieving  Data');
    });
  }
  checkIsApprovedByBillingProvider() {
    this.patientData = this.appData.summeryViewPatient;
    if (this.patientData.isCCMRevoked) {
      this.revokeType = "CCM";
      this.ModelForRevokeMR();
      this.showAlertMessage();
      return;
    }
    if (!this.patientData.isCCMConsentTaken) {
      
      this.ModelForConsentNotDone();
      this.showAlertMessage();
      return;
    }
    // if (this.isCarePLanApproved === true) {
    //   this.router.navigateByUrl('/admin/CpQuestions/' + this.PatientId);
    //   return;
    // }
    if (this.appData.summeryViewPatient && this.appData.summeryViewPatient.id === this.PatientId  && (this.appData.summeryViewPatient.chronicDiagnosesIds.length < 2 || this.appData.summeryViewPatient.profileStatus === false)) {
      if (this.appData.summeryViewPatient.profileStatus === false) {
        this.router.navigate(['/admin/addPatient/' + this.PatientId]);
        this.toaster.warning(
          'Please complete profile before proceed.'
          );
          return;
      } else {
         this.router.navigate(["/admin/patient/" + this.PatientId +"/pDetail/pDiagnoses"]);
            this.toaster.warning(
              "Please add chronic diseases before proceeding."
            );
          return;
      }
    }
    this.patientService.IsCarePlanApproved(this.PatientId).subscribe((res: any) => {
      this.isCarePLanApproved = res;
      if (this.isCarePLanApproved === false) {
        // this.unApprovedCarePLanModal.show();
          // if (window.confirm('Care PLan is not approved by Billing Provider.')) {
          //   this.router.navigateByUrl('/admin/CpQuestions/' + this.PatientId);
          // } else {
          //   return;
          // }
          this.openConfirmModal('any');
        } else {
          // this.router.navigateByUrl('/patientMr/CpQuestions/' + this.PatientId);
          this.router.navigateByUrl('/patientMr/' + this.PatientId + '/monthlyReview' );
          // routerLink="/admin/CpQuestions/{{PatientId}}"
        }
    }, (err: HttpResError) => {
      this.toaster.error('Error retrieving  Data');
    });
  }
  ModelForRevokeMR() {
    this.showValidationAlert = `
        <div>
          <div class="d-flex justify-content-between">
            <div>
              <strong class="ml-3"></strong>
              <span>Patient ${this.revokeType} Consent is revoked.
              This patient is not eligible for this work.</span>
            </div>
            </div>
          </div>
        </div>`;
  }
  ModelForConsentNotDone() {
    this.showValidationAlert = `
        <div>
          <div class="d-flex justify-content-between">
            <div>
              <strong class="ml-3"></strong>
              <span>Patient consent is not taken,
              This patient is not eligible for this work.</span>
            </div>
            </div>
          </div>
        </div>`;
  }
  showAlertMessage() {
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Alert';
    modalDto.Text = this.showValidationAlert;
    // modalDto.hideProceed = true;
    // modalDto.callBack = this.SubmitEncounterTimeForm;
    modalDto.data = {};
    modalDto.rejectButtonText = "OK";
    // modalDto.acceptButtonText = ".";
    this.appUi.openLazyConfrimModal(modalDto);
  }
  checkRpmRevoked() {
    this.revokeType = "RPM";
    if (this.patientData.isRPMRevoked) {
      this.ModelForRevokeMR();
      this.showAlertMessage();
      return;
    } else {
      this.router.navigateByUrl('/rpm/PatientRpm/' + this.PatientId );
    }
  }
  navigateToMonthlyReview() {
    // this.router.navigateByUrl('/admin/CpQuestions/' + this.PatientId);
    this.router.navigateByUrl('/patientMr/' + this.PatientId + '/monthlyReview' );
  }
  openConfirmModal(data: any) {
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Unapproved Profile';
    modalDto.Text = 'Care Plan is not approved by Billing Provider.';
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    modalDto.rejectButtonText = "CLOSE";
    modalDto.acceptButtonText = "PROCEED";
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) =>  {
    this.navigateToMonthlyReview();
  }
}
