import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { SecurityService } from "src/app/core/security/security.service";
import { PatientsService } from "src/app/core/Patient/patients.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ToastService, ModalDirective } from "ng-uikit-pro-standard";
import { FormControl, Validators } from "@angular/forms";
import { SubSink } from 'src/app/SubSink';

@Component({
  selector: "app-care-plan-view",
  templateUrl: "./care-plan-view.component.html",
  styleUrls: ["./care-plan-view.component.scss"]
})
export class CarePlanViewComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  @ViewChild("carePlanHistoryViewModal")
  carePlanHistoryViewModal: ModalDirective;
  isLoadingCPHistory: boolean;
  email = new FormControl("", [Validators.required, Validators.email]);
  carePlanHistoryView: any;
  patientId = 0;
  isCarePlanFound = true;
  sendMailDto = new SendCarePlanHistoryPdfDto();
  isLoadingMail: boolean;
  // emailAddress: string;
  constructor(
    private securityService: SecurityService,
    private patientService: PatientsService,
    private sanatizer: DomSanitizer,
    private toaster: ToastService
  ) {}

  ngOnInit() {
    this.patientId = this.securityService.securityObject.id;
    this.getCarePlanHistory();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  getCarePlanHistory() {
    this.isLoadingCPHistory = true;
    const patientId = this.securityService.securityObject.id;
    this.subs.sink = this.patientService.DownloadCarePlanPdfByPatientId(patientId).subscribe(
      (res: any) => {
        this.isLoadingCPHistory = false;
        this.isCarePlanFound = true;
        // this.isLoading = false;
        var file = new Blob([res], { type: "application/pdf" });
        var fileURL = URL.createObjectURL(file);
        this.carePlanHistoryView = this.sanatizer.bypassSecurityTrustResourceUrl(
          fileURL
        );
      },
      error => {
        this.isCarePlanFound = false;
        this.isLoadingCPHistory = false;
        this.toaster.error(error.message, error.error || error.error);
      }
    );
  }
  sendCarePlanHistoryPdf() {
    this.isLoadingMail = true;
    this.sendMailDto.PatientId = this.patientId;
    this.sendMailDto.email = this.email.value;
    this.subs.sink = this.patientService
      .SendCarePlanHistoryPdf(this.sendMailDto)
      .subscribe(
        (res: any) => {
          this.carePlanHistoryViewModal.hide();
          this.sendMailDto = new SendCarePlanHistoryPdfDto();
          this.isLoadingMail = false;
          this.toaster.success("Send Email");
        },
        err => {
          this.isLoadingMail = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  resetFields() {
    this.email.reset();
    this.sendMailDto = new SendCarePlanHistoryPdfDto();
  }
}
export class SendCarePlanHistoryPdfDto {
  email = '';
  PatientId = 0;
}
