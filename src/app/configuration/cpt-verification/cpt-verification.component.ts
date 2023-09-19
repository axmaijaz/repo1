import { Component, OnInit } from '@angular/core';
import { SyncFacilityClaimChargeDto } from 'src/app/model/Accounts/accounts.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import { BillingService } from 'src/app/core/billing.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { SubSink } from 'src/app/SubSink';
import { Location } from '@angular/common';
import { HttpResError } from 'src/app/model/common/http-response-error';

@Component({
  selector: 'app-cpt-verification',
  templateUrl: './cpt-verification.component.html',
  styleUrls: ['./cpt-verification.component.scss']
})
export class CptVerificationComponent implements OnInit {
  facilityClaimChargeList = new Array<SyncFacilityClaimChargeDto>();
  facilityClaimChargeDto = new SyncFacilityClaimChargeDto();
  isLoading: boolean;
  private subs = new SubSink();
  constructor(private location: Location,
    private appUi: AppUiService,
    private billingService: BillingService,
    private toaster: ToastService) { }

  ngOnInit(): void {
    this.getFacilityClaimCharge();
  }

  getFacilityClaimCharge() {
    this.isLoading = true;
    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
    this.subs.sink = this.billingService.syncFacilityClaimCharge().subscribe(
      (res: any) => {
        this.isLoading = false;
        this.facilityClaimChargeList = new Array<SyncFacilityClaimChargeDto>();
        if (res && res.length >= 0) {
          this.facilityClaimChargeList = res;
        }
      },
      (error: HttpResError) => {
        this.toaster.error(error.error);
        this.isLoading = false;
        // this.closeModal.emit();
      }
    );
  }

  goBack() {
    this.location.back();
  }
}
