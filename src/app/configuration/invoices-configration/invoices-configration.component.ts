import { FacilityService } from "../../core/facility/facility.service";
import { PaymentTermEnum } from "../../Enums/billing.enum";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { AppUiService } from "src/app/core/app-ui.service";
import { BillingService } from "src/app/core/billing.service";
import { ToastService, ModalDirective } from "ng-uikit-pro-standard";
import { SubSink } from "src/app/SubSink";
import { FacilityClaimChargeReadAndUpdateDto } from "src/app/model/Accounts/accounts.model";
import { HttpResError } from "src/app/model/common/http-response-error";
import { FacilityDto } from "src/app/model/Facility/facility.model";
import { LazyModalDto } from "src/app/model/AppModels/app.model";
@Component({
  selector: "app-invoices-configration",
  templateUrl: "./invoices-configration.component.html",
  styleUrls: ["./invoices-configration.component.scss"],
})
export class InvoicesConfigrationComponent implements OnInit {
  @ViewChild("editCptconfigModal") editCptconfigModal: ModalDirective;
  facilityId: number;
  facilityList = new Array<FacilityDto>();
  facilityDto = new FacilityDto();
  selectedFacilityId: number;
  facilityClaimChargeReadAndUpdateDto = new FacilityClaimChargeReadAndUpdateDto();
  facilityClaimChargesList = new Array<FacilityClaimChargeReadAndUpdateDto>();
  paymentTermEnum = PaymentTermEnum;
  private subs = new SubSink();
  isLoading: boolean;
  facilityName = "";
  monthlyCharges: number;
  alreadySelectedFacilityId: number;
  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private appUi: AppUiService,
    private billingService: BillingService,
    private toaster: ToastService,
    private facilityService: FacilityService
  ) {}

  ngOnInit(): void {
    this.facilityId = +this.route.snapshot.paramMap.get("facilityId");
    this.getFacilityById();
    this.getFacilityList();

    this.getInvoiceVerification();
  }
  getInvoiceVerification() {
    this.isLoading = true;

    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
    this.subs.sink = this.billingService
      .getfacilityClaimCharges(this.facilityId)
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          this.facilityClaimChargesList = new Array<
            FacilityClaimChargeReadAndUpdateDto
          >();
          // this.facilityName = res.facilityName;
          // this.monthlyCharges = res.monthlyCharge;
          this.facilityClaimChargesList = res;
          // this.getFacilityClaimCharge();
        },
        (error: HttpResError) => {
          this.toaster.error(error.error);
          this.isLoading = false;
          // this.closeModal.emit();
        }
      );
  }

  editfacilityClaimCharges() {
    this.isLoading = true;
    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
    this.subs.sink = this.billingService
      .editfacilityClaimCharges(this.facilityClaimChargeReadAndUpdateDto)
      .subscribe(
        (res: any) => {
          this.editCptconfigModal.hide();
          this.isLoading = false;
          this.facilityClaimChargeReadAndUpdateDto = new FacilityClaimChargeReadAndUpdateDto();
          // this.getFacilityClaimCharge();
          this.getInvoiceVerification();
        },
        (error: HttpResError) => {
          this.toaster.error(error.error);
          this.isLoading = false;
          // this.closeModal.emit();
        }
      );
  }
  getFacilityList() {
    // this.isLoading = true;
    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
    this.subs.sink = this.facilityService.getFacilityList().subscribe(
      (res: any) => {
        this.facilityList = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error);
      }
    );
  }

  getFacilityById() {
    // this.isLoading = true;
    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
    this.subs.sink = this.facilityService
      .getFacilityDetail(this.facilityId)
      .subscribe(
        (res: any) => {
          this.facilityDto = res;
          this.facilityName = this.facilityDto.facilityName;
          this.monthlyCharges = this.facilityDto.monthlyCharge;
        },
        (error: HttpResError) => {
          this.toaster.error(error.error);
        }
      );
  }
  editMonthlyCharge() {
    // this.isLoading = true;
    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
    this.subs.sink = this.facilityService
      .editMonthlyCharge(this.facilityId, this.monthlyCharges)
      .subscribe(
        (res: any) => {},
        (error: HttpResError) => {
          this.toaster.error(error.error);
        }
      );
  }
  copyCptCodeFomOtherFacility() {
    if (this.selectedFacilityId) {
      this.alreadySelectedFacilityId = this.selectedFacilityId;
      this.isLoading = true;
      // this.patientsService.getPatientDetail(this.PatientId).subscribe(
      this.subs.sink = this.facilityService
        .copyCptCodeFomOtherFacility(this.facilityId, this.selectedFacilityId)
        .subscribe(
          (res: any) => {
            this.isLoading = false;
            this.getInvoiceVerification();
          },
          (error: HttpResError) => {
            this.isLoading = false;
            this.toaster.error(error.error);
          }
        );
    }
  }
  openConfirmModal() {
    const modalDto1 = new LazyModalDto();
    modalDto1.Title = 'Confirmation';
    modalDto1.Text =
      `This will replace the existing Charge Amount values with the selected Facility's Charge Amount. Are you sure?`;
    modalDto1.callBack = this.callBackBhi;
    modalDto1.rejectCallBack = this.rejectCallBackBhi;
    this.appUi.openLazyConfrimModal(modalDto1);
}
rejectCallBackBhi = () => {
  if(this.alreadySelectedFacilityId){
    this.selectedFacilityId = this.alreadySelectedFacilityId;
  }else{
    this.selectedFacilityId = null;
  }
}
callBackBhi = (row) => {
  this.copyCptCodeFomOtherFacility()
}
  goBack() {
    this.location.back();
  }
  verifyFacilityClaimCharge(row: any) {
    this.isLoading = true;
    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
    this.subs.sink = this.billingService
      .verifyFacilityClaimCharge(row.id)
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          row.verified = true;
          // this.getInvoiceVerification();
        },
        (error: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(error.error);
        }
      );
  }
  checkValidation(value?: number) {
    if (value == 1) {
      if (this.facilityClaimChargeReadAndUpdateDto.paymentAmount > 100) {
        this.facilityClaimChargeReadAndUpdateDto.paymentAmount = null;
      }
    }

    if (this.facilityClaimChargeReadAndUpdateDto.paymentTerm == 1 && this.facilityClaimChargeReadAndUpdateDto.paymentAmount > 100) {
      this.facilityClaimChargeReadAndUpdateDto.paymentAmount = null;
    }
  }
}
