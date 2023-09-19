import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  ActivatedRoute,
} from "@angular/router";
import { ToastService } from "ng-uikit-pro-standard";
import { Observable } from "rxjs";
import { LazyModalDto } from "src/app/model/AppModels/app.model";
import { HttpResError } from "src/app/model/common/http-response-error";
import { PatientDto } from "src/app/model/Patient/patient.model";
import { AppDataService } from "../app-data.service";
import { AppUiService } from "../app-ui.service";
import { DataFilterService } from "../data-filter.service";
import { PatientsService } from "../Patient/patients.service";
import { SecurityService } from "../security/security.service";

@Injectable({
  providedIn: "root",
})
export class ServiceConfigGuard implements CanActivate {
  patientData = new PatientDto();
  revokeType: string;
  showValidationAlert: string;
  patientId: number;
  isCarePLanApproved = false;
  serviceType: any;
  constructor(
    private security: SecurityService,
    private appData: AppDataService,
    private toaster: ToastService,
    private filterDataService: DataFilterService,
    private appUi: AppUiService,
    private router: Router,
    private patientService: PatientsService,
    private route: ActivatedRoute
  ) {}
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    this.serviceType = next.data["serviceType"];
    this.patientId = +this.route.snapshot.children[0]?.firstChild?.children[0].params.id;
    if (!this.patientId) {
      this.patientId = +next.params['id'];
    }
    if (!this.patientId) {
      this.patientId = +this.route.snapshot?.paramMap?.get('id');
    }
    if (!this.patientId) {
      this.patientId = +this.route.pathFromRoot[3]?.snapshot?.paramMap?.get("id");
    }
    if (this.patientId) {
      await this.getPatientById();
    }
    const result = await this.applyRouteCriteria();
    return result;
  }
  applyRouteCriteria(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.serviceType == "RPM") {
        if (this.patientData.rpmStatus !== 0) {
          this.ModelForInActiveRpmPatient();
          this.showAlertMessage();
          resolve(false);
        } else if (this.patientData.isRPMRevoked) {
          this.ModelForRevokeMR(this.serviceType);
          this.showAlertMessage();
          resolve(false);
        } else if (!this.patientData.isRPMConsentTaken) {
          this.ModelForConsentNotDone();
          this.showAlertMessage();
          resolve(false);
        } else {
          resolve(true);
        }
      } else if (this.serviceType == "CCM") {
        if (this.patientData.isCCMRevoked) {
          this.ModelForRevokeMR(this.serviceType);
          this.showAlertMessage();
          resolve(false);
        } else if (!this.patientData.isCCMConsentTaken) {
          this.ModelForConsentNotDone();
          this.showAlertMessage();
          resolve(false);
        } else if (
          this.patientData &&
          this.patientData.id === this.patientId &&
          (this.patientData.chronicDiagnosesIds.length < 2 ||
            this.patientData.profileStatus === false)
        ) {
          if (this.patientData.profileStatus === false) {
            if (!location.href.includes('insights')) {
              this.router.navigate(["/admin/addPatient/" + this.patientId]);
            }
            this.toaster.warning("Please complete profile before proceed.");
            resolve(false);
          }
           else {
            if (location.href.includes('insights')) {
              this.router.navigate([`/insights/diagnoses/${this.patientId}`]);
            } else {
              this.router.navigate(["/admin/patient/" + this.patientId +"/pDetail/pDiagnoses"]);
            }
            this.toaster.warning(
              "Please add chronic diseases before proceeding."
            );
            resolve(false);
          }
        } else {
          resolve(true);
        }
      } else {
        resolve(true);
      }
    });
  }
  ModelForRevokeMR(revokeType) {
    this.showValidationAlert = `
        <div>
          <div class="d-flex justify-content-between">
            <div>
              <strong class="ml-3"></strong>
              <span>Patient ${revokeType} Consent is revoked.
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
  ModelForInActiveRpmPatient() {
    this.showValidationAlert = `
        <div>
          <div class="d-flex justify-content-between">
            <div>
              <strong class="ml-3"></strong>
              <span>Patient Status is Not Active,
              This patient is not eligible for this work.</span>
            </div>
            </div>
          </div>
        </div>`;
  }
  showAlertMessage() {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Alert";
    modalDto.Text = this.showValidationAlert;
    modalDto.data = {};
    modalDto.rejectButtonText = "OK";
    this.appUi.openLazyConfrimModal(modalDto);
  }
  getPatientById() {
    return new Promise((resolve, reject) => {
      this.patientService
        .getPatientDetail(this.patientId)
        .subscribe((res: any) => {
          this.patientData = res;
          resolve(res);
        });
    });
  }
}
