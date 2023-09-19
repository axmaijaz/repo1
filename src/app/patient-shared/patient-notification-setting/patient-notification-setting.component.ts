import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { AppUiService } from 'src/app/core/app-ui.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { SetFacilityServiceConfigDto } from 'src/app/model/Facility/facility.model';
import { PatientNotificationDto } from 'src/app/model/Patient/patient-notification-model';

@Component({
  selector: 'app-patient-notification-setting',
  templateUrl: './patient-notification-setting.component.html',
  styleUrls: ['./patient-notification-setting.component.scss']
})
export class PatientNotificationSettingComponent implements OnInit {
  // @ViewChild("patientNotificationModal") patientNotificationModal: ModalDirective;

  public timePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "HH:mm",
  };
  PatientId: number;
  isLoadingConfig: boolean;
  PatientNotifSetting = new PatientNotificationDto();
  notificationTime = '';
  SetFacilityServiceCOnfigDto = new SetFacilityServiceConfigDto();
  facilityId: number;

  constructor(private PatientService: PatientsService,
    private route: ActivatedRoute,
    private securityService: SecurityService,
    private toaster: ToastService,
    private facilityService: FacilityService,
    private appUi: AppUiService) { }

  ngOnInit(): void {
    this.PatientId = +this.route.snapshot.paramMap.get("id");
    this.OpenAlertModal(this.PatientId)
    this.facilityId = +this.securityService.getClaim('FacilityId')?.claimValue;
    this.GetFacilityServiceConfig(this.facilityId);
  }
  GetFacilityServiceConfig(facilityId: number) {
    this.isLoadingConfig = true;
    this.facilityService.GetFacilityServiceConfig(facilityId).subscribe(
      (res: SetFacilityServiceConfigDto) => {
        this.SetFacilityServiceCOnfigDto = res;
        this.isLoadingConfig = false;
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
        this.isLoadingConfig = false;
      }
    );
  }
  OpenAlertModal(patientId: number) {
    this.PatientNotifSetting = new PatientNotificationDto();
    this.notificationTime = '';
    if (!patientId) {
      this.toaster.warning('Patinet id is invalid')
      return;
    }
    this.PatientId = patientId;
    // this.patientNotificationModal.show()
    this.GetPatientNotificationConfig();
  }
  GetPatientNotificationConfig() {
    this.isLoadingConfig = true;
    this.PatientService.GetPatientNotificationConfig(this.PatientId).subscribe(
      (res: PatientNotificationDto) => {
        this.isLoadingConfig = false;
        if (res) {
          this.PatientNotifSetting = res;
          // const hours = this.PatientNotifSetting?.notificationTime?.hour;
          // const minutes = this.PatientNotifSetting?.notificationTime?.minute;
          // this.notificationTime = `${hours}:${minutes}`;
        }
      },
      (error: HttpResError) => {
        this.isLoadingConfig = false;
        this.toaster.error(error.message, error.error);
      }
    );
  }

  EditPatientNotificationConfig() {
    this.isLoadingConfig = true;
    this.PatientNotifSetting.patientId = this.PatientId
    this.PatientService.EditPatientNotificationConfig(this.PatientNotifSetting).subscribe(
      (res: any) => {
        this.isLoadingConfig = false;
        this.toaster.success('Notification setting saved successfully.')
      },
      (error: HttpResError) => {
        this.isLoadingConfig = false;
        this.toaster.error(error.message, error.error);
      }
    );
  }
}
