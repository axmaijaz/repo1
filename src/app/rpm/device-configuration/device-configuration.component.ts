import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Pipe, PipeTransform } from '@angular/core';
import { Location } from '@angular/common';
import { EventTypes, EventBusService } from 'src/app/core/event-bus.service';
import { ModalDirective, ToastService, TabsetComponent } from 'ng-uikit-pro-standard';
import { ActivatedRoute } from '@angular/router';
import { RpmService } from 'src/app/core/rpm.service';
import { BillingService } from 'src/app/core/billing.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import {
  ModalityDto,
  DeviceDto,
  IntigrationCheckList,
  ModalityConfDto,
  TermsAndConditionDto,
  BPDeviceDataDto,
  WeightDataDto,
  PulseOximetryDataDto,
  BGDeviceDataDto,
  ActivityDataDto
} from 'src/app/model/rpm.model';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { UnRecordImageDto } from '../device-data-sync/device-data-sync.component';
import { DeviceManagementService } from 'src/app/core/device-management.service';

@Component({
  selector: 'app-device-configuration',
  templateUrl: './device-configuration.component.html',
  styleUrls: ['./device-configuration.component.scss']
})
export class DeviceConfigurationComponent implements OnInit, AfterViewInit {
  ShowAsMOdal = false;
  isLoadingDevice = true;
  modalityConfDto = new ModalityConfDto();
  modalitiesList = new Array<ModalityDto>();
  selectedModality = new ModalityDto();
  selectedDevice = new DeviceDto();
  description = '';
  devicesList = new Array<DeviceDto>();
  filterDeviceList = new Array<any>();
  private _searchText: string;
  isAuthorized: boolean;
  isAuthorizing: boolean;
  IsDeviceConfigured: boolean;
  loadingTestImages: boolean;
  canConfigureModalities = true;
  isSavingData: boolean;
  notApplicable: boolean;
  isLoadingTestData: boolean;
  serialNumbers = new Array<string>();
  gettingSerialNumbers: boolean;

  get searchText(): any {
    return this._searchText;
  }

  set searchText(value: any) {
    this._searchText = value;
    this.filterDeviceList = this.filterdDeviceList(value);
  }

  planType = 0;
  deviceInventoryId = 0;
  intigrationCheckList = new Array<IntigrationCheckList>();
  @ViewChild('modalityConfigMOdal') modalityConfigMOdal: ModalDirective;
  @ViewChild('mdbModalityTabs') mdbModalityTabs: TabsetComponent;
  @ViewChild('FStepTabs') FStepTabs: TabsetComponent;
  patientId: number;
  @ViewChild('verifySerialText2') verifySerialText2: ElementRef;
  @ViewChild('verifySerialText3') verifySerialText3: ElementRef;
  unRecordImgDto = new Array<UnRecordImageDto>();
  // agreementChecked = false;
  isCheckListCompleted = false;
  facilityId: number;
  providerList = new Array<CreateFacilityUserDto>();
  termsAndConditionDto = new TermsAndConditionDto();
  deviceConsentUrl: string;
  isLoadingDeviceData: boolean;
  PatientTestData = new Array<any>();
  UnknownDevice: boolean;
  constructor(
    private facilityService: FacilityService,
    private securityService: SecurityService,
    private deviceManagementService: DeviceManagementService,
    private location: Location,
    private eventBus: EventBusService,
    private route: ActivatedRoute,
    private rpmService: RpmService,
    private toaster: ToastService,
    private billingService: BillingService
  ) {}

  public scrollbarOptionsTimeline = {
    axis: 'y',
    theme: 'dark-3',
    scrollInertia: 2,
    scrollButtons: { enable: true },
    autoHideScrollbar: true
  };

  ngOnInit() {
    this.patientId = +this.route.snapshot.paramMap.get('id');
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
      this.loadCareProviders();
    } else {
      this.facilityId = 0;
    }
    this.filterDeviceList = this.devicesList;
    this.getModalities();
    this.openModalEventSubscribe();
    this.getTermsAndConditions();
  }
  ngAfterViewInit(): void {
    fromEvent(this.verifySerialText2.nativeElement, 'keyup')
      .pipe(
        // get value
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(2000)
        // subscription for response
      )
      .subscribe((text: string) => {
        this.GetSerialNumbersByFacilityId(text);
      });
  }
  getUnRecordImage() {
    this.loadingTestImages = true;
    this.deviceManagementService
    .GetUnRecordedImg(this.patientId)
    .subscribe((res: any) => {
      this.loadingTestImages = false;
      // res.dateCreated = res.dateCreated.slice(0,10);

      this.unRecordImgDto = res;
    }, err => {
      this.loadingTestImages = false;
    });
  }
  verifySerialNumber(text: string) {
    if (text) {
      this.deviceInventoryId = 0;
      this.rpmService
        // .VerifyDeviceSerialNumberByFacilityId('MM-1100', 1)
        .VerifyDeviceSerialNumberByFacilityId(
          text,
          this.facilityId,
          this.selectedDevice.id
        )
        .subscribe(
          (res: any) => {
            if (res && res.id) {
              this.deviceInventoryId = res.id;
            } else {
              this.deviceInventoryId = 0;
            }
            this.toaster.success('serial number verified');
          },
          (error: HttpResError) => {
            this.deviceInventoryId = 0;
            this.toaster.error(error.message, error.error);
          }
        );
    } else {
      this.deviceInventoryId = 0;
    }
  }
  GetSerialNumbersByFacilityId(text: string) {
    if (text) {
      this.gettingSerialNumbers = true;
      this.serialNumbers = [];
      this.rpmService .GetSerialNumbersByFacilityId(
        text,
        this.facilityId,
        this.selectedDevice.id
        )
        .subscribe(
          (res: string[]) => {
            this.gettingSerialNumbers = false;
            if (res.length > 0) {
              this.serialNumbers = res;
            } else {
              this.toaster.warning('No serial number found');
            }
          },
          (error: HttpResError) => {
            this.gettingSerialNumbers = false;
            this.deviceInventoryId = 0;
            this.toaster.error(error.message, error.error);
          }
        );
    }
  }
  filterdDeviceList(searchString: any) {
    return this.devicesList.filter(
      device =>
        device.deviceName.toLowerCase().indexOf(searchString.toLowerCase()) !==
        -1
    );
  }

  openModalEventSubscribe() {
    this.eventBus.on(EventTypes.OpenModalityConfig).subscribe(res => {
      this.ShowAsMOdal = true;
      this.modalityConfigMOdal.show();
    });
  }
  navigateBack() {
    this.location.back();
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
              this.getDevicesBymodality();

              this.GetIntegrationChecklistbyModalityId();
            } else {
              this.canConfigureModalities = false;
            }
          },
          (error: HttpResError) => {
            this.toaster.error(error.message, error.error);
            this.isLoadingDevice = false;
          }
        );
    }
  }
  getDevicesBymodality() {
    if (this.selectedModality) {
      this.isLoadingDevice = true;
      if (this.selectedModality.code === 'BP') {
        this.modalityConfDto.alerts.threshold.bloodPressure.minLowPressure = 60;
        this.modalityConfDto.alerts.threshold.bloodPressure.minHighPressure = 100;
        this.modalityConfDto.alerts.threshold.bloodPressure.maxLowPressure = 80;
        this.modalityConfDto.alerts.threshold.bloodPressure.maxHighPressure = 160;
      } else if (this.selectedModality.code === 'BG') {
        this.modalityConfDto.alerts.threshold.bloodGlucose.minGlucose = 80;
        this.modalityConfDto.alerts.threshold.bloodGlucose.maxGlucose = 200;
      } else if (this.selectedModality.code === 'PO') {
        this.modalityConfDto.alerts.threshold.pulse.minBloodOxygen = 89;
        this.modalityConfDto.alerts.threshold.pulse.maxBloodOxygen = 200;
      } else if (this.selectedModality.code === 'WT') {
        this.modalityConfDto.alerts.threshold.weight.minWeight = 150;
        this.modalityConfDto.alerts.threshold.weight.maxWeight = 160;
      } else if (this.selectedModality.code === 'AT') {
        this.modalityConfDto.alerts.threshold.activity.minSteps = 100;
        this.modalityConfDto.alerts.threshold.activity.maxSteps = 150;
      }
      this.rpmService.getDevicesByModality(this.selectedModality.id).subscribe(
        res => {
          this.isLoadingDevice = false;
          this.devicesList = res;

          this.filterDeviceList = this.devicesList;
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
    this.devicesList.forEach((element: DeviceDto) => {
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
  getDeviceConsentUrl() {
    let methodName = '';
    this.selectedDevice.deviceVendorCode = 'IH'; /// to be deleted fixed
    if (this.selectedDevice && this.selectedDevice.deviceVendorCode === 'OM') {
      methodName = 'GetOmronDeviceConsentUrl';
    } else if (
      this.selectedDevice &&
      this.selectedDevice.deviceVendorCode === 'WI'
    ) {
      methodName = 'GetWithingsDeviceConsentUrl';
    } else if (
      this.selectedDevice &&
      this.selectedDevice.deviceVendorCode === 'IH'
    ) {
      methodName = 'GetIHealthDeviceConsentUrl';
    } else if (
      this.selectedDevice &&
      this.selectedDevice.deviceVendorCode === 'DX'
    ) {
      methodName = 'GetDexcomDeviceConsentUrl';
    }
    if (methodName) {
      this.rpmService['' + methodName](this.patientId).subscribe(
        (res: any) => {
          if (res) {
            this.deviceConsentUrl = res;
          }
        },
        error => {
        }
      );
    }
  }
  GetIntegrationChecklistbyModalityId() {
    if (this.selectedModality) {
      let modalityId = 0;
      if (this.selectedModality.id > 0) {
        modalityId = this.selectedModality.id;
      } else {
        modalityId = 0;
      }
      if (this.UnknownDevice) {
        modalityId = 0;
      }

      this.rpmService.GetIntegrationChecklistbyModalityId(modalityId).subscribe(
        res => {
          this.intigrationCheckList = res;
        },
        (error: HttpResError) => {
          this.toaster.error(error.message, error.error);
        }
      );
    }
  }
  CheckMinMaxvalue() {
    if (
      this.modalityConfDto.alerts.threshold.bloodPressure.minLowPressure >=
      this.modalityConfDto.alerts.threshold.bloodPressure.minHighPressure
    ) {
      this.modalityConfDto.alerts.threshold.bloodPressure.minHighPressure = null;
    }
    if (
      this.modalityConfDto.alerts.threshold.bloodPressure.maxLowPressure >=
      this.modalityConfDto.alerts.threshold.bloodPressure.maxHighPressure
    ) {
      this.modalityConfDto.alerts.threshold.bloodPressure.maxHighPressure = null;
    }
    if (
      this.modalityConfDto.alerts.threshold.weight.minWeight >=
      this.modalityConfDto.alerts.threshold.weight.maxWeight
    ) {
      this.modalityConfDto.alerts.threshold.weight.maxWeight = null;
    }
    if (
      this.modalityConfDto.alerts.threshold.pulse.minBloodOxygen >=
      this.modalityConfDto.alerts.threshold.pulse.maxBloodOxygen
    ) {
      this.modalityConfDto.alerts.threshold.pulse.maxBloodOxygen = null;
    }
    if (
      this.modalityConfDto.alerts.threshold.bloodGlucose.minGlucose >=
      this.modalityConfDto.alerts.threshold.bloodGlucose.maxGlucose
    ) {
      this.modalityConfDto.alerts.threshold.bloodGlucose.maxGlucose = null;
    }
    if (
      this.modalityConfDto.alerts.threshold.activity.minSteps >=
      this.modalityConfDto.alerts.threshold.activity.maxSteps
    ) {
      this.modalityConfDto.alerts.threshold.activity.maxSteps = null;
    }
  }
  calculatePercentage(price: number) {
    if (price) {
      const amount = (50 / 100) * this.selectedDevice.price;
      return amount / 12 + this.selectedDevice.price / 12;
    } else {
      return price;
    }
  }
  getCheckListStatus() {
    if (this.intigrationCheckList && this.intigrationCheckList.length > 0) {
      let KeepGoing = true;
      this.intigrationCheckList.forEach(item => {
        if (item.isMandatory && !item.isChecked) {
          KeepGoing = false;
        }
      });
      if (KeepGoing) {
        this.isCheckListCompleted = true;
      } else {
        this.isCheckListCompleted = false;
      }
    } else {
      this.isCheckListCompleted = false;
    }
  }

  loadCareProviders() {
    // this.userManagerService.getGetCareProviderList().subscribe(
    // this.facilityService.getFacilityUserList(this.facilityId).subscribe(
    this.facilityService
      .getCareProvidersByFacilityId(this.facilityId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.providerList = res;
          }
        },
        error => {
        }
      );
  }
  getTermsAndConditions() {
    this.facilityService.GetTermsAndConditions(this.planType).subscribe(
      (res: TermsAndConditionDto) => {
        if (res) {
          this.termsAndConditionDto = res;
        }
      },
      error => {
      }
    );
  }

  SaveModalityConf() {
    this.IsDeviceConfigured = false;
    this.modalityConfDto.patientId = this.patientId;
    this.modalityConfDto.deviceInventoryId = this.deviceInventoryId;
    this.modalityConfDto.termsAndConditionsId = this.termsAndConditionDto.id;
    this.modalityConfDto.purchasePlan.planType = this.planType;
    this.modalityConfDto.modalityId = this.selectedModality.id;
    this.modalityConfDto.purchasePlan.purchaseDate = moment().format(
      'YYYY-MM-DD'
    );
    this.modalityConfDto.healthCareDeviceId = this.selectedDevice.id;
    if (this.UnknownDevice) {
      this.modalityConfDto.healthCareDeviceId = 0;
    }
    this.modalityConfDto.purchasePlan.amount = this.selectedDevice.price;
    if (this.planType === 1) {
      this.modalityConfDto.purchasePlan.serialNumber = this.verifySerialText2.nativeElement.value;
    } else if (this.planType === 2) {
      this.modalityConfDto.purchasePlan.serialNumber = this.verifySerialText3.nativeElement.value;
    }
    if (!this.planType && this.planType !== 0) {
      this.modalityConfDto.purchasePlan = null;
    }
    this.isSavingData = true;
    this.rpmService.SaveModalityConf(this.modalityConfDto).subscribe(
      (res: any) => {
        this.isSavingData = false;
        this.IsDeviceConfigured = true;
        this.modalityConfDto = new ModalityConfDto();
        this.mdbModalityTabs.tabs[4].disabled = false;
        if (this.UnknownDevice) {
          this.mdbModalityTabs.tabs[5].disabled = false;
          this.mdbModalityTabs.setActiveTab(6);
          this.FStepTabs.setActiveTab(2);
        } else {
          this.mdbModalityTabs.setActiveTab(5);
          this.FStepTabs.setActiveTab(1);
        }
        // this.getModalities();
        if (res) {
        }
        this.toaster.success('data saved successfully.');
      },
      (error: HttpResError) => {
      this.IsDeviceConfigured = false;
        this.isSavingData = false;
        this.toaster.error(error.message, error.error);
      }
    );
  }
  onNavigate() {
    const win = window.open(
      this.deviceConsentUrl,
      'Snopzer',
      'left=20,top=20,width=500,height=500,toolbar=1,resizable=0'
    );
    // win.onunload = function() {

    //   checkIfDeviceConsentTaken();
    //   alert('Bye now!');
    // };
    win.addEventListener('beforeunload', eve => {
      this.checkIfDeviceConsentTaken();
    });
  }
  unKnownSelected() {
    if (this.UnknownDevice) {
      this.planType = 2;
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
  checkIfDeviceConsentTaken() {
    this.isAuthorized = false;
    this.isAuthorizing = true;
    this.rpmService.GetRPMVendorToken(this.patientId, this.selectedDevice.deviceVendorId).subscribe(
        (res: any) => {
          this.isAuthorizing = false;
          this.isAuthorized = true;
          if (res) {
          }
          this.toaster.success('Authorization successful.');
        },
        (err: HttpResError) => {
          this.isAuthorizing = false;
          this.isAuthorized = false;
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }

  DownloadDeviceData() {
    this.isLoadingTestData = true;
    // this.rpmService.DownloadDeviceData(this.selectedDevice.deviceVendorCode, this.selectedModality.code, this.patientId).subscribe(
    this.rpmService
      .DownloadIhealthAllModalitiesDeviceData(
        this.selectedDevice.deviceVendorCode,
        this.selectedModality.code,
        this.patientId
      )
      .subscribe(
        // this.rpmService.DownloadDeviceData('IH', this.selectedModality.code, this.patientId).subscribe(
        (res: any) => {
          if (res) {
          }
          this.getDeviceDisplayData();
          // this.toaster.success('data saved successfully.');
        },
         (error: HttpResError) => {
          this.isLoadingTestData = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  GenerateRPMEncounterClaims() {
    this.billingService
      .AddConfigureDeviceEncounterClaimAsync(this.patientId, this.facilityId )
      .subscribe(
        (res: any) => {
          if (res) {
            if (res != null && res !== 0) {
             this.toaster.success("Encounter Claim saved successfully.");
            } else {
              this.toaster.success('Encounter Claim saved successfully.');
            }
            this.navigateBack();
          }
        },
          (error: HttpResError) => {
          this.toaster.error(error.message, error.error);
        }
      );
  }
  getDeviceDisplayData() {
    if (this.selectedDevice) {
        if (this.selectedDevice.modalityCode === 'BP') {
          this.GetBPDeviceDisplayData(this.selectedDevice);
        } else if (this.selectedDevice.modalityCode === 'WT') {
          this.GetWeightDeviceDatabyPatientId(this.selectedDevice);
        } else if (this.selectedDevice.modalityCode === 'PO') {
          this.GetPulseDeviceDatabyPatientId(this.selectedDevice);
        } else if (this.selectedDevice.modalityCode === 'BG') {
          this.GetBloodGlucoseDeviceDatabyPatientId(this.selectedDevice);
        } else if (this.selectedDevice.modalityCode === 'AT') {
          this.GetActivityDeviceDatabyPatientId(this.selectedDevice);
        }
    } else {
      this.isLoadingTestData = false;
    }
  }
  GetBPDeviceDisplayData(device: DeviceDto) {
    this.rpmService
      .GetBPDisplayData(
        this.patientId,
        new Date().getMonth() + 1,
        new Date().getFullYear()
      )
      .subscribe(
        (res: BPDeviceDataDto[]) => {
          this.isLoadingTestData = false;
          this.PatientTestData = res;
        },
        (error: HttpResError) => {
          this.isLoadingTestData = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  GetWeightDeviceDatabyPatientId(device: DeviceDto) {
    this.rpmService
      .GetWeightDeviceDatabyPatientId(
        this.patientId,
        new Date().getMonth() + 1,
        new Date().getFullYear()
      )
      .subscribe(
        (res: WeightDataDto[]) => {
          this.isLoadingTestData = false;
          this.PatientTestData = res;
        },
        (error: HttpResError) => {
          this.isLoadingTestData = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  GetPulseDeviceDatabyPatientId(device: DeviceDto) {
    this.rpmService
      .GetPulseDeviceDatabyPatientId(
        this.patientId,
        new Date().getMonth() + 1,
        new Date().getFullYear()
      )
      .subscribe(
        (res: PulseOximetryDataDto[]) => {
          this.isLoadingTestData = false;
          this.PatientTestData = res;
        },
        (error: HttpResError) => {
          this.isLoadingTestData = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  GetBloodGlucoseDeviceDatabyPatientId(device: DeviceDto) {
    this.rpmService
      .GetBloodGlucoseDeviceDatabyPatientId(
        this.patientId,
        new Date().getMonth() + 1,
        new Date().getFullYear()
      )
      .subscribe(
        (res: BGDeviceDataDto[]) => {
          this.isLoadingTestData = false;
          this.PatientTestData = res;
        },
        (error: HttpResError) => {
          this.isLoadingTestData = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  GetActivityDeviceDatabyPatientId(device: DeviceDto) {
    this.rpmService
      .GetActivityDeviceDatabyPatientId(
        this.patientId,
        new Date().getMonth() + 1,
        new Date().getFullYear()
      )
      .subscribe(
        (res: ActivityDataDto[]) => {
          this.isLoadingTestData = false;
          this.PatientTestData = res;
        },
        (error: HttpResError) => {
          this.isLoadingTestData = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  movetoFinalizing() {
    if (this.notApplicable || this.isAuthorized) {
      this.mdbModalityTabs.setActiveTab(6);
    } else {
      this.isAuthorized = false;
      this.isAuthorizing = true;
      this.rpmService.GetRPMVendorToken(this.patientId, this.selectedDevice.deviceVendorId).subscribe(
          (res: any) => {
            this.isAuthorizing = false;
            this.isAuthorized = true;
            this.mdbModalityTabs.tabs[5].disabled = false;
            this.mdbModalityTabs.setActiveTab(6);
            this.FStepTabs.tabs[0].disabled = false;
            this.FStepTabs.setActiveTab(1);
            this.toaster.success('Authorization successful.');
          },
          error => {
            this.isAuthorizing = false;
            this.isAuthorized = false;
            this.toaster.error('Authorization not completed, Click connect to proceed.');
          }
        );
      }
  }
}
