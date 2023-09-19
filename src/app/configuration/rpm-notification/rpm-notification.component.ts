import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { ToastService } from 'ng-uikit-pro-standard';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { AppUiService } from 'src/app/core/app-ui.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { RingCentralService } from 'src/app/core/RingCentral/ring-central.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { FacilityNotificationDto } from 'src/app/model/Facility/facility-notification.model';
import { CreateFacilityUserDto, MarkFacilityUsersSmsAlertDto, SetFacilityServiceConfigDto } from 'src/app/model/Facility/facility.model';

@Component({
  selector: 'app-rpm-notification',
  templateUrl: './rpm-notification.component.html',
  styleUrls: ['./rpm-notification.component.scss']
})
export class RpmNotificationComponent implements OnInit {
  public timePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "HH:mm",
  };
  facilityId: number;
  isLoadingConfig: boolean;
  facilityNotifSetting = new FacilityNotificationDto();
  notificationTime = '';
  isLoadingServiceConfig: boolean;
  SetFacilityServiceCOnfigDto = new SetFacilityServiceConfigDto();
  smsNotification: boolean = true;
  teamNotification: boolean = false;
  careTeamNotificationSetting = new MarkFacilityUsersSmsAlertDto()
  isLoadingTeamConfig: boolean;
  isLoadingUsers: boolean;
  facilityUsersList = new Array<CreateFacilityUserDto>();

  constructor(private facilityService: FacilityService,
    private route: ActivatedRoute,
    private securityService: SecurityService,
    private toaster: ToastService,
    public rcService: RingCentralService,
    private appUi: AppUiService) { }

  ngOnInit(): void {
    this.facilityId = +this.securityService.getClaim('FacilityId')?.claimValue;
    this.GetFacilityNotificationConfig();
    this.GetFacilityServiceConfig(this.facilityId);
    this.GetSmsAlertEnabledFacilityUsers()
    this.getFacilityUsers()
  }
  smsNoti() {
    this.smsNotification = true;
    this.teamNotification = false;
  }
  careNoti() {
    this.smsNotification = false;
    this.teamNotification = true;
  }
  GetFacilityServiceConfig(facilityId: number) {
    this.isLoadingServiceConfig = true;
    this.facilityService.GetFacilityServiceConfig(facilityId).subscribe(
      (res: SetFacilityServiceConfigDto) => {
        this.SetFacilityServiceCOnfigDto = res;
        this.isLoadingServiceConfig = false;
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
        this.isLoadingServiceConfig = false;
      }
    );
  }
  GetFacilityNotificationConfig() {
    this.isLoadingConfig = true;
    this.facilityService.GetFacilityNotificationConfig(this.facilityId).subscribe(
      (res: FacilityNotificationDto) => {
        this.isLoadingConfig = false;
        this.facilityNotifSetting = res;
      },
      (error: HttpResError) => {
        this.isLoadingConfig = false;
        this.toaster.error(error.message, error.error);
      }
    );
  }
  EditFacilityNotificationConfig() {
    this.isLoadingConfig = true;
    this.facilityService.EditFacilityNotificationConfig(this.facilityNotifSetting).subscribe(
      (res: FacilityNotificationDto) => {
        this.isLoadingConfig = false;
        this.toaster.success('Notification setting saved successfully.')
      },
      (error: HttpResError) => {
        this.isLoadingConfig = false;
        this.toaster.error(error.message, error.error);
      }
    );
  }
  getFacilityUsers() {
    // let roleName = "PRCM Care Manager";
    this.isLoadingUsers = true;
    this.facilityService.getFacilityUserList(this.facilityId).subscribe(
      (res: []) => {
        this.facilityUsersList = res;
        this.isLoadingUsers = false;
      },
      (error: HttpResError) => {
        this.isLoadingUsers = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  MarkFacilityUsersSmsAlertEnabled() {
    this.isLoadingTeamConfig = true;
    this.careTeamNotificationSetting.facilityId = this.facilityId;
    this.facilityService.MarkFacilityUsersSmsAlertEnabled(this.careTeamNotificationSetting).subscribe(
      (res: any) => {
        this.isLoadingTeamConfig = false;
        this.toaster.success('Care team notification setting saved.')
      },
      (error: HttpResError) => {
        this.isLoadingTeamConfig = false;
        this.toaster.error(error.message, error.error);
      }
    );
  }
  GetSmsAlertEnabledFacilityUsers() {
    this.isLoadingTeamConfig = true;
    this.careTeamNotificationSetting.facilityId = this.facilityId;
    this.facilityService.GetSmsAlertEnabledFacilityUsers(this.facilityId).subscribe(
      (res: any[]) => {
        this.isLoadingTeamConfig = false;
        if (res?.length) {
          this.careTeamNotificationSetting.facilityUserIds = res.map(x => x.facilityUserId)
        }

      },
      (error: HttpResError) => {
        this.isLoadingTeamConfig = false;
        this.toaster.error(error.message, error.error);
      }
    );
  }

}
