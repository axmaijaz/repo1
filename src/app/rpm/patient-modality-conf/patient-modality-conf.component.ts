import { id } from '@swimlane/ngx-datatable';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { RpmService } from 'src/app/core/rpm.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { DeletePatientDeviceDto, DeviceDto, ModalityDto, PatientHealthCareDeviceForListDto } from 'src/app/model/rpm.model';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';

@Component({
  selector: 'app-patient-modality-conf',
  templateUrl: './patient-modality-conf.component.html',
  styleUrls: ['./patient-modality-conf.component.scss']
})
export class PatientModalityConfComponent implements OnInit {
  devicesList = new Array<PatientHealthCareDeviceForListDto>();
  isLoading: boolean;
  patientId: number;
  deletePatientDeviceDto = new DeletePatientDeviceDto();
  selectedDevice: any;
  deviceConsentUrl: any;
  isLoadingDevice: boolean;
  isDexcomConnected: boolean;
  modalitiesList = new Array<ModalityDto>();
  selectedModality = new ModalityDto();
  devicesListByModality = new Array<DeviceDto>();
  filterDeviceList = new Array<any>();
  UnknownDevice: boolean;
  manufactureCode: string;
  @ViewChild ('modalitiesModal') modalitiesModal: ModalDirective;
  isdexcomLoading = false;
  checkingDexcomAuth: boolean;

  constructor(private rpmService: RpmService,
    private toaster: ToastService,
    private router: Router,
    private securityService: SecurityService,
    private appUi: AppUiService,) { }

  ngOnInit() {
    if (
      this.securityService.securityObject.userType === UserType.Patient
    ) {
      this.patientId = this.securityService.securityObject.id;
    }
    // this.getDevicesByPatientId();
    // this.getModalities();
    this.GetDexcomCheckAuthGiven();
  }
  getDevicesByPatientId() {
    if (this.patientId) {
      this.isLoading = true;
      this.rpmService.getDevicesByPatientId(this.patientId).subscribe(
        res => {
          this.isLoading = false;
          this.devicesList = res;
          // console.log(this.devicesList);
          if (this.devicesList) {
            this.devicesList.forEach((device: PatientHealthCareDeviceForListDto) => {
              if (device.modalityCode) {
                if (device.modalityCode === 'BP') {
                  device.deviceName = 'Blood Pressure';
                }
                if (device.modalityCode === 'WT') {
                  device.deviceName = 'Weight';
                }
                if (device.modalityCode === 'PO') {
                  device.deviceName = 'Pulse Oximetry';
                }
                if (device.modalityCode === 'BG') {
                  device.deviceName = 'Blood Glucose';
                }
                if (device.modalityCode === 'AT') {
                  device.deviceName = 'Activity';
                }
              }
            });
          }
        },
        (error: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(error.message, error.error);
        }
      );
    }
  }
  GetDexcomCheckAuthGiven() {
    this.checkingDexcomAuth = true;
    this.rpmService
      .GetDexcomCheckAuthGiven(this.patientId)
      .subscribe(
        (res: any) => {
          this.checkingDexcomAuth = false;
          this.isDexcomConnected = res;
        },
        (error: HttpResError) => {
          this.checkingDexcomAuth = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  deviceStatusChanged(checked: boolean, item: PatientHealthCareDeviceForListDto) {
    this.isLoading = true;
    this.rpmService
      .UpdatePatientDeviceStatus(this.patientId, item.id, checked)
      .subscribe(
        res => {
          if (checked) {
            this.toaster.success('Device is activated successfully');
          } else {
            this.toaster.warning('Device is deactivated');
          }
          this.getDevicesByPatientId();
        },
        (error: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  DeletePatientDevice(patientDeviceId) {
    // if (window.confirm('Do you want to remove this device ?')) {
      this.isLoading = true;
      this.deletePatientDeviceDto.cPatientDeviceId = patientDeviceId;
      this.rpmService
        .DeletePatientDevice(this.deletePatientDeviceDto)
        .subscribe(
          res => {
            this.getDevicesByPatientId();
            this.toaster.success('Device deleted successfully');
          },
          (error: HttpResError) => {
            this.isLoading = false;
            this.toaster.error(error.message, error.error);
          }
        );
    // }
  }
  openConfirmModal(data: any) {
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Delete Device';
    modalDto.Text = 'Do you want to remove this device ?';
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.DeletePatientDevice(data);
  }
  onNavigate() {
    const win = window.open(
      this.deviceConsentUrl,
      'Snopzer',
      'left=20,top=20,width=1200,height=500,toolbar=1,resizable=0'
    );
    // win.onunload = function() {

    //   checkIfDeviceConsentTaken();
    //   alert('Bye now!');
    // };
    win.addEventListener('beforeunload', eve => {
      // this.checkIfDeviceConsentTaken();
      this.getDevicesByPatientId();
    });
  }
  getModalities() {
    if (this.patientId) {
      this.isLoadingDevice = true;
      this.rpmService
        .GetUnAssignedModalitiesByPatientId(this.patientId)
        .subscribe(
          res => {
            this.isLoadingDevice = false;
            this.modalitiesList = res;
            if (this.modalitiesList && this.modalitiesList.length > 0) {
              this.selectedModality = this.modalitiesList[0];
              // this.getDevicesBymodality();

              // this.GetIntegrationChecklistbyModalityId();
            } else {
              // this.canConfigureModalities = false;
            }
          },
          (error: HttpResError) => {
            this.toaster.error(error.message, error.error);
            this.isLoadingDevice = false;
          }
        );
    }
  }
  unKnownSelected() {
    if (this.UnknownDevice) {
      // this.planType = 2;
      // this.planType = null;
      // this.deviceInventoryId = 0;
      // this.verifySerialText1.nativeElement.value = '';
      // this.verifySerialText2.nativeElement.value = '';
      this.selectedDevice = new DeviceDto();
      this.UnCheckAll();
      // this.mdbModalityTabs.tabs[2].disabled = false;
      // this.mdbModalityTabs.setActiveTab(3);
      // const  codee = this.selectedModality.code;
      // this.selectedModality = {
      //   id: 0,
      //   code: codee,
      //   name: ''
      // };
      // this.GetIntegrationChecklistbyModalityId();
    }
  }
  getDeviceConsentUrl() {
    let methodName = '';
    // this.selectedDevice.deviceVendorCode = 'DX'; /// to be deleted fixed
    if (this.manufactureCode && this.manufactureCode === 'OM') {
      methodName = 'GetOmronDeviceConsentUrl';
    } else if (
      this.manufactureCode &&
      this.manufactureCode === 'WI'
    ) {
      methodName = 'GetWithingsDeviceConsentUrl';
    } else if (
      this.manufactureCode &&
      this.manufactureCode === 'IH'
    ) {
      methodName = 'GetIHealthDeviceConsentUrl';
    } else if (
      this.manufactureCode &&
      this.manufactureCode === 'DX'
    ) {
      methodName = 'GetDexcomDeviceConsentUrl';
    }
    if (methodName) {
      this.rpmService['' + methodName](this.patientId).subscribe(
        (res: any) => {
          if (res) {
            this.deviceConsentUrl = res;
            this.isdexcomLoading = false;
            this.onNavigate();
          }
        },
        error => {
          this.isdexcomLoading = false;
        }
      );
    }
    this.manufactureCode = '';
  }
  getDevicesBymodality() {
    if (this.selectedModality) {
      this.isLoadingDevice = true;
      this.rpmService.getDevicesByModality(this.selectedModality.id).subscribe(
        res => {
          this.modalitiesModal.show();
          this.isLoadingDevice = false;
          this.devicesListByModality = res;

          this.filterDeviceList = this.devicesListByModality;
          this.UnCheckAll();
          // console.log(this.devicesList);
        },
        (error: HttpResError) => {
          this.toaster.error(error.message, error.error);
          this.isLoadingDevice = false;
        }
      );
    }
  }
  UnCheckAll() {
    this.devicesListByModality.forEach((element: DeviceDto) => {
      if (
        element &&
        this.selectedDevice &&
        element.id === this.selectedDevice.id &&
        this.selectedDevice.isActive === true
      ) {
        element.isActive = true;
        // this.mdbModalityTabs.setActiveTab(2);
      } else {
        element.isActive = false;
      }
    });
  }

}
