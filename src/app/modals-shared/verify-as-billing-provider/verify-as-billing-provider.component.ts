import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { AppUiService } from 'src/app/core/app-ui.service';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { SubSink } from 'src/app/SubSink';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { VerifyModalDto } from 'src/app/model/AppModels/app.model';
import { RpmService } from 'src/app/core/rpm.service';

@Component({
  selector: 'app-verify-as-billing-provider',
  templateUrl: './verify-as-billing-provider.component.html',
  styleUrls: ['./verify-as-billing-provider.component.scss']
})
export class VerifyAsBillingProviderComponent implements OnInit, AfterViewInit, OnDestroy {
  private subs = new SubSink();
  verified: boolean;
  @ViewChild('changeProviderModal') changeProviderModal: ModalDirective;
  facilityId: number;
  password: string;
  billingProviders = new Array<CreateFacilityUserDto>();
  selectedBillingProvider = new CreateFacilityUserDto();
  modalObj: VerifyModalDto;
  Verifying: boolean;
  billingProviderId: number;
  constructor(private appUi: AppUiService, private rpmService: RpmService , private toaster: ToastService, private facilityService: FacilityService, private securityService: SecurityService) {
    appUi.showVerifyProviderModalSubject.asObservable().subscribe((res: VerifyModalDto) => {
      this.modalObj = res;
      this.selectedBillingProvider = new CreateFacilityUserDto();
      this.changeProviderModal.config = { backdrop: false, ignoreBackdropClick: false };
      if (this.securityService.hasClaim('IsBillingProvider')) {
        this.billingProviderId = this.securityService.securityObject.id;
      }
      this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
      this.getBillingProviders();
      this.password = '';
      this.changeProviderModal.show();
    });
  }
  ngOnInit() {
  }
  ngAfterViewInit() {
    this.changeProviderModal.config = { backdrop: false, ignoreBackdropClick: false };
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  Proceed(data: number, name: string) {
    this.changeProviderModal.hide();
    setTimeout(() => {
      const self = this;
      // this.modalObj.callBack(this.modalObj.data);
      const callFunc = this.modalObj.callBack.bind(this);
      const mydata = data;
      callFunc(mydata, name);
    }, 500);
  }
  Reject() {
    this.changeProviderModal.hide();
  }
  getBillingProviders() {
    if (this.facilityId) {
      this.subs.sink = this.facilityService
        .getBillingProvidersByFacilityId(this.facilityId)
        .subscribe(
          res => {
            this.billingProviders = res;
            if (this.billingProviderId) {
              this.selectedBillingProvider = this.billingProviders.find(x => x.id === this.billingProviderId);
            }
          },
          (error: HttpResError) => {
            this.toaster.error(error.message, error.error);
          }
        );
    }
  }
  validateUser() {
    this.Verifying = true;
    this.subs.sink = this.rpmService
    .validateUser(this.selectedBillingProvider.userId, this.password)
    .subscribe(
      (res: boolean) => {
        this.Verifying = false;
        if (res) {
          this.Proceed(this.selectedBillingProvider.id, this.selectedBillingProvider.firstName + ' ' + this.selectedBillingProvider.lastName);
        } else {
          this.toaster.error('Password is incorrect');
        }
      },
      (error: HttpResError) => {
        this.Verifying = false;
        this.toaster.error(error.message, error.error);
        }
      );
  }

}
