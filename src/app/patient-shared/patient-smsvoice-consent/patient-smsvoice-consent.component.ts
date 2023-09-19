import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { AppUiService } from 'src/app/core/app-ui.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { SetFacilityServiceConfigDto } from 'src/app/model/Facility/facility.model';
import { PatientNotificationDto } from 'src/app/model/Patient/patient-notification-model';
import { PatientDto } from 'src/app/model/Patient/patient.model';
import { HttpResError } from 'src/app/model/common/http-response-error';

@Component({
  selector: 'app-patient-smsvoice-consent',
  templateUrl: './patient-smsvoice-consent.component.html',
  styleUrls: ['./patient-smsvoice-consent.component.scss']
})
export class PatientSmsvoiceConsentComponent implements OnInit {

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
  selectedPatient = new PatientDto();
  smsvoiceConsent: boolean;

  constructor(private PatientService: PatientsService,
    private route: ActivatedRoute,
    private securityService: SecurityService,
    private toaster: ToastService,
    private facilityService: FacilityService,
    private appUi: AppUiService) { }

  ngOnInit(): void {
    this.PatientId = +this.route.snapshot.paramMap.get("id");
    this.getPatientById()
    this.OpenAlertModal(this.PatientId)
    this.facilityId = +this.securityService.getClaim('FacilityId')?.claimValue;
    this.GetFacilityServiceConfig(this.facilityId);
  }
  async getPatientById(){
    this.PatientService.getPatientDetail(this.PatientId).subscribe((res: any)=>{
      this.selectedPatient =  res;
    }, (err: HttpResError) => {
      this.toaster.error(err.error);
    })
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
          if (this.PatientNotifSetting.telephonyCommunication) {
            this.smsvoiceConsent = true;
          }
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

  EditPatientTelephonyConfig() {
    this.isLoadingConfig = true;
    this.PatientNotifSetting.patientId = this.PatientId
    this.PatientService.EditPatientTelephonyConfig(this.PatientNotifSetting).subscribe(
      (res: any) => {
        this.isLoadingConfig = false;
        this.toaster.success('SMS/Voice consent saved successfully.')
        if (this.PatientNotifSetting.telephonyCommunication) {
          this.smsvoiceConsent = true;
        }
        const obj = {
          type: 'PatientNotificationSettingChanged',
          mData: this.PatientNotifSetting
        }

        window.parent.postMessage(obj, '*');
      },
      (error: HttpResError) => {
        this.isLoadingConfig = false;
        this.toaster.error(error.message, error.error);
      }
    );
  }
}
