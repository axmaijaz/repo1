import { AppUiService } from './../../core/app-ui.service';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { SecurityService } from 'src/app/core/security/security.service';
import { FacilityDto } from 'src/app/model/Facility/facility.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { SubSink } from 'src/app/SubSink';
import { CareGapDto } from 'src/app/model/pcm/payers.model';
import { InsuranceService } from 'src/app/core/insurance.service';
import { Location } from '@angular/common';
import { RingCentralService } from 'src/app/core/RingCentral/ring-central.service';
import { LazyModalDto, RCVIewState } from 'src/app/model/AppModels/app.model';
import { EventTypes, EventBusService, EmitEvent } from 'src/app/core/event-bus.service';
import { RCPhoneRecordDto } from 'src/app/twoc-ring-central/rc-calls-msg/ringCentral.model';

@Component({
  selector: 'app-facility-user-setting',
  templateUrl: './facility-user-setting.component.html',
  styleUrls: ['./facility-user-setting.component.scss']
})
export class FacilityUserSettingComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  facilityId: number;
  switchFacilityId = 0;
  OrganizationId: number;
  CareGapsList: CareGapDto[];
  isLoading: boolean;
  facilityList = new Array<FacilityDto>();
  selectedGapIds = new Array<number>();
  gettingGaps: boolean;
  savingGapsData: boolean;
  gettingFacilityGaps: boolean;
  monthlyTarget: number;
  isMonthlyTargetLoading: boolean;
  gettingRcDetails: boolean;
  rcConfData: any;
  gettingRcAuthCode: boolean;
  deletingRCToken: boolean;
  activatedItem = 'FG';
  gettingRCPhoneNo: boolean;
  rcPhoneNumberInfo: RCPhoneRecordDto[] = [];
  settingDefaultSms: boolean;
  alertMessage: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private insuranceService: InsuranceService,
    private appUi: AppUiService,
    private facilityService: FacilityService,
    private toaster: ToastService,
    private location: Location,
    private rcService: RingCentralService,
    private securityService: SecurityService,
    private eventBus: EventBusService,
  ) {}
  ngOnInit() {
      setTimeout(() => {
        const sideNaveType = this.route.snapshot?.queryParamMap?.get('type');
        if(sideNaveType && sideNaveType == 'RC'){
          this.activatedItem = 'RC';
          this.NavigateTO('');
        }
      }, 1000);
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    this.OrganizationId = +this.securityService.getClaim('OrganizationId')
    const TelephonyCommunication = this.securityService.getClaim('TelephonyCommunication')?.claimValue;
    if (this.OrganizationId) {
      this.getFaciliesDetailsByUserId();
    }
    if (this.facilityId) {
      this.switchFacilityId = this.facilityId;
      if (TelephonyCommunication) {
        this.GetRcConfigDetails();
        this.GetPhoneNumberInfo();
        this.eventBus.on(EventTypes.GlobalIframeClosed).subscribe((data: {url: string}) => {
          if (data.url) {
            this.GetRcConfigDetails();
            this.GetPhoneNumberInfo();
          }
        });
      }

    }
    this.ManageGapsClicked();
  }
  ngOnDestroy() {
this.subs.unsubscribe();
  }
  ManageGapsClicked() {
    this.selectedGapIds = [];
    this.CareGapsList = [];
    this.GetAllCareGaps();
  }
  navigateBack() {
    this.location.back();
  }
  NavigateTO(nUrl: string) {
    // this.router.navigate([nUrl], {relativeTo: this.route});
    this.router.navigateByUrl(`/admin/usersettings${nUrl}`, {skipLocationChange: true});
  }
  navigateToService(nUrl: string){
    this.router.navigateByUrl(`${nUrl}`, {skipLocationChange: true});
  }
  GetRcConfigDetails() {
    this.gettingRcDetails = true;
    this.rcService.GetRcConfigDetails(this.facilityId).subscribe(
      (res: any) => {
        this.rcConfData = res;
        this.gettingRcDetails = false;
        // this.rcService.GetRCPhoneInfo();
      },
      (error: HttpResError) => {
        this.gettingRcDetails = false;
        this.alertMessage = error.message
        if (typeof error.error === 'object' && error.error !== null) {
          this.alertMessage += ` : ${JSON.stringify(error.error)}`
        } else {
          this.alertMessage += ` : ${error.error}`
        }
        // if (error.error == 'RingCentral not connected.') {
        // } else {
        //   this.toaster.error(error.error, error.message);
        // }
      }
    );
  }
  GetPhoneNumberInfo() {
    this.gettingRCPhoneNo = true;
    this.rcService.GetPhoneNumberInfo(this.facilityId).subscribe(
      (res: any) => {
        if (res?.records) {
          this.rcPhoneNumberInfo = res.records;
          this.rcService.rcPhoneInfo = res.records || [];
          this.alertMessage = '';
        }
        this.gettingRCPhoneNo = false;
      },
      (error: HttpResError) => {
        this.gettingRCPhoneNo = false;
        this.alertMessage = error.message
        if (typeof error.error === 'object' && error.error !== null) {
          this.alertMessage += ` : ${JSON.stringify(error.error)}`
        } else {
          this.alertMessage += ` : ${error.error}`
        }
      }
    );
  }
  ConfirmSetSMSSenderNumber(data: any) {
    if (!data.features.includes('SmsSender')) {
      this.toaster.warning(`Send SMS feature is not enabled against this number`)
      return;
    }
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Set SMS Sender Number';
    modalDto.Text = 'Are you sure that you want to set this as default SMS sender ?';
    modalDto.callBack = this.SetSMSSenderNumber;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  SetSMSSenderNumber = (phone) => {
    this.settingDefaultSms = true;
    this.rcService.ChangePrimaryPhoneNo(this.facilityId , phone.phoneNumber).subscribe(
      (res: any) => {

        this.settingDefaultSms = false;
        if (this.rcConfData[0]) {
          this.rcConfData[0].smsSenderNumber = phone.phoneNumber;
        }
        this.toaster.success(`${phone.phoneNumber} saved as primary number for sms`)
      },
      (error: HttpResError) => {
        this.settingDefaultSms = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  openConfirmModal(data: number) {
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Remove RingCentral Number';
    modalDto.Text = 'Are you sure that you want to delete RingCentral number.';
    modalDto.callBack = this.DeleteRCTokenById;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  DeleteRCTokenById = (id: number) => {
    this.deletingRCToken = true;
    this.rcService.DeleteRCTokenById(id).subscribe(
      (res: any) => {
        this.GetRcConfigDetails();
        this.deletingRCToken = false;
        this.rcPhoneNumberInfo = []
        this.rcService.rcPhoneInfo = [];
        this.rcService.RcWidgetLogout();
        this.rcService.RequestRcViewStateChange(RCVIewState.minimize)
      },
      (error: HttpResError) => {
        this.deletingRCToken = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetRCAuthCode() {
    this.gettingRcAuthCode = true;
    this.rcService.GetAuthCode().subscribe(
      (res: any) => {
        // window.open(res, '_blank');
        const emitObj = new EmitEvent();
        emitObj.name = EventTypes.TriggerGlobalIframe;
        emitObj.value = `${res}`;
        this.eventBus.emit(emitObj);
        // window.addEventListener('message', receiveMessage, false);
        this.gettingRcAuthCode = false;
      },
      (error: HttpResError) => {
        this.gettingRcAuthCode = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetPayersByFacilityId() {
    this.gettingFacilityGaps = true;
    this.subs.sink = this.insuranceService.GetGapsByFacilityId(this.facilityId).subscribe(
      (res: number[]) => {
        this.selectedGapIds = res;
        this.selectedGapIds.forEach(element => {
          const gap1 = this.CareGapsList.find(i => i.id === element);
          if (gap1) {
            gap1['checked'] = true;
          }
        });
        this.gettingFacilityGaps = false;
      },
      (error: HttpResError) => {
        this.gettingFacilityGaps = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetAllCareGaps() {
    this.gettingGaps = true;
    this.subs.sink = this.insuranceService.GetAllCareGaps().subscribe(
      (res: CareGapDto[]) => {
        this.CareGapsList = res;
        this.GetPayersByFacilityId();
        this.gettingGaps = false;
      },
      (error: HttpResError) => {
        this.gettingGaps = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GapValueChanged(checked: boolean, gap: CareGapDto, index: number) {
    if (checked) {
      this.selectedGapIds.push(gap.id);
    } else {
      const gIndex = this.selectedGapIds.findIndex(x => x === gap.id);
      this.selectedGapIds.splice(gIndex, 1);
    }
    const gap1 = this.CareGapsList.find(i => i.id === gap.id);
      if (gap1) {
        gap1['checked'] = checked;
      }
  }
  EditCareGapsByFacilityId(modal: ModalDirective) {
    this.savingGapsData = true;
    const data = {
      facilityId: this.facilityId,
      selectedGapIds: this.selectedGapIds
    };
    this.subs.sink = this.insuranceService.EditFacilityGaps(data).subscribe(
      (res: any) => {
        this.savingGapsData = false;
        this.toaster.success('Data updated successfully');
        modal.hide();
      },
      (error: HttpResError) => {
        this.savingGapsData = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }

  getFaciliesDetailsByUserId() {
    this.isLoading = true;
    this.subs.sink = this.facilityService
      .getFaciliesDetailsByUserId(this.securityService.securityObject.id)
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          if (res) {
            this.facilityList = res;
          }
        },
        error => {
          this.toaster.error(error.message, error.error || error.error);
          this.isLoading = false;
          // console.log(error);
        }
      );
  }
  addEditMonthlyTarget(monthlyTargetModal: ModalDirective) {
    this.isMonthlyTargetLoading = true;
    this.subs.sink = this.facilityService
      .AddEditMonthlyTarget(this.facilityId, this.monthlyTarget)
      .subscribe(
        (res: any) => {
          monthlyTargetModal.hide();
          this.toaster.success('Save Successfully')
          this.isMonthlyTargetLoading = false;
        },
        (error: HttpResError) => {
          this.toaster.error(error.error, error.message);
          this.isMonthlyTargetLoading = false;
          // console.log(error);
        }
      );
  }
  GetMonthlyTarget() {
    this.subs.sink = this.facilityService
      .GetMonthlyTarget(this.facilityId)
      .subscribe(
        (res: any) => {
          this.monthlyTarget = res.monthlyTarget;
        },
        (error: HttpResError) => {
          this.toaster.error(error.error, error.message);
          // console.log(error);
        }
      );
  }

  switchFacility() {
    this.isLoading = true;
    const data = {
      facilityUserId: this.securityService.securityObject.id,
      facilityId: this.switchFacilityId
    };
    this.subs.sink = this.facilityService.SwitchFacility(data).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res) {
          this.securityService.updateToken(res);
          if (this.router.url.includes('home/page')) {
            window.location.reload();
          } else {
            this.router.navigateByUrl('home/page');
            window.location.reload();
          }
        }
      },
      (err: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
}
