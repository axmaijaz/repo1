import { TwocChatService } from 'src/app/core/2c-chat.service';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { Subject } from 'rxjs';
import { AppUiService } from 'src/app/core/app-ui.service';
import { DeviceManagementService } from 'src/app/core/device-management.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { RpmService } from 'src/app/core/rpm.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { SearchedChatUsersDto } from 'src/app/model/chat/chat.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { debounceTime } from 'rxjs/operators';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { FilterPatient, PatientDto } from 'src/app/model/Patient/patient.model';
import { RpmPHDeviceListDto, TransferDeviceToFacilityDto } from 'src/app/model/Inventory/rpm-inventory.model';
import { FacilityDto } from 'src/app/model/Facility/facility.model';
import { UserType } from 'src/app/Enums/UserType.enum';
import { PHDeviceStatus } from 'src/app/Enums/phDevice.enum';
import { RPMDeviceListDtoNew } from 'src/app/model/rpm.model';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';

@Component({
  selector: 'app-rpm-device-issue',
  templateUrl: './rpm-device-issue.component.html',
  styleUrls: ['./rpm-device-issue.component.scss']
})
export class RpmDeviceIssueComponent implements OnInit {
  @ViewChild('issueDeviceModal') issueDeviceModal: ModalDirective;
  @ViewChild('transferDeviceModal') transferDeviceModal: ModalDirective;
  facilityId: number;
  gettingInHandDevices: boolean;
  gettingFacilitiesList: boolean;
  rpmDevicesList: RpmPHDeviceListDto[] = [];
  devicesList = new Array<RPMDeviceListDtoNew>();
  selectedDevice = new  RpmPHDeviceListDto();
  selectedFacility = new  FacilityDto();
  selectedTransferDevice = new  RpmPHDeviceListDto();
  transferDeviceToFacilityDto = new TransferDeviceToFacilityDto();
  searchParam = '';
  filterModalStr = '';
  alreadyPendingBillingMsg = '';
  searchingChatUsers: boolean;
  searchWatch = new Subject<string>();
  searchedChatUserList: PatientDto[];
  CurrentPatient = new PatientDto();
  IssuingDevice: boolean;
  cpT99453: boolean;
  facilityList = new Array<FacilityDto>();
  @Output() ReloadInventory: EventEmitter<any> = new EventEmitter<any>();
  organizationId: number;
  filterPatientDto = new FilterPatient();
  makingDeviceActive: boolean;
  isLoadingModalities: boolean;
  modalityList: any;
  patientDevicesList= new Array<RPMDeviceListDtoNew>();
  alreadyHaveADevice = '';

  constructor(private toaster: ToastService, private TwocHatService: TwocChatService,  private rpm: RpmService, private deviceService: DeviceManagementService,
    private facilityService: FacilityService, private securityService: SecurityService, private patientService: PatientsService, private appUiService: AppUiService) { }

  ngOnInit(): void {
    this.organizationId = +this.securityService.getClaim('OrganizationId').claimValue;
      this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    if (!this.facilityId) {
      this.facilityId = 0;
    }
    this.SearchObserver();
  }
  GetInhandDevices() {
    this.gettingInHandDevices = true;
    this.deviceService.GetRpmInventoryDevices(this.facilityId, true, false, false ,this.filterModalStr)
      .subscribe(
        (res: any[]) => {
          if (res) {
            this.rpmDevicesList = res;
          }
          this.gettingInHandDevices = false;
        },
        (err: HttpResError) => {
          this.toaster.error(err.message);
          this.gettingInHandDevices = false;
        }
      );
  }
  changed(searchStr: string) {
    if (!searchStr) {
      this.searchedChatUserList = new Array<PatientDto>();
      return;
    }
    this.searchWatch.next(searchStr);
  }
  getFilterPatientsList2() {
    const fPDto = new FilterPatient();
    this.searchedChatUserList = [];
    this.searchingChatUsers = true;
    for (const filterProp in this.filterPatientDto) {
      if (
        this.filterPatientDto[filterProp] === null ||
        this.filterPatientDto[filterProp] === undefined
      ) {
        this.filterPatientDto[filterProp] = fPDto[filterProp];
        // this.FilterPatientDto[filterProp] = 0;
      }
    }
    this.searchingChatUsers = true;
    // this.searchingChatUsersPayersList = true;
    this.filterPatientDto.FacilityUserId = 0;
    // FacilityId = 0
    this.filterPatientDto.CareProviderId = 0;
    this.filterPatientDto.FacilityId = this.facilityId;
    this.filterPatientDto.PageNumber = 1;
    this.filterPatientDto.PageSize = 20;
    this.filterPatientDto.ccmStatus = [];

    this.patientService.getFilterPatientsList2(this.filterPatientDto).subscribe(
      (res: any) => {
        this.searchingChatUsers = false;
        this.searchedChatUserList = res.patientsList;
      },
      (error: HttpResError) => {
        this.searchingChatUsers = false;
        // this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  SearchObserver() {
    this.searchWatch.pipe(debounceTime(1000)).subscribe(x => {
      this.filterPatientDto.SearchParam = x;
      if (!this.filterPatientDto.SearchParam) {
        // this.filterPatientId = null;
        // this.GetIssuedDevices();
        return;
      }
      this.getFilterPatientsList2();
    });
  }
  SelectPatient(patient: SearchedChatUsersDto) {
    this.searchedChatUserList = [];
    this.alreadyPendingBillingMsg = '';
    this.cpT99453 = false;
    this.patientService.getPatientDetail(patient.id).subscribe(
      (res: PatientDto) => {
        this.searchParam =  res.firstName + ' ' + res.lastName;
        this.CurrentPatient = res;
    });
    this.CheckUnbilledDeviceConfigClaim(patient.id);
  }
  CheckUnbilledDeviceConfigClaim(patientId: number) {
    this.rpm.CheckUnbilledDeviceConfigClaim(patientId)
      .subscribe(
        (res: any) => {
          this.alreadyPendingBillingMsg = res.message;
          if (!res.message) {
            this.cpT99453 = true;
          }
        },
        (error: HttpResError) => {
          this.toaster.error(error.message, error.error);
        }
      );
  }
  IssueDevice() {
    this.IssuingDevice = true;
    this.deviceService.AssignDeviceToPatient(this.CurrentPatient.id, this.selectedDevice.id, this.cpT99453)
      .subscribe(
        (res: any[]) => {
          this.IssuingDevice = false;
          this.toaster.success('Operation successfull');
          this.alreadyPendingBillingMsg = '';
          this.cpT99453 = false;
          this.ReloadInventory.next()
          this.issueDeviceModal.hide();
        },
        (err: HttpResError) => {
          this.toaster.error(err.message);
          this.IssuingDevice = false;
        }
      );
  }
  GetPHDevicesByPatientId() {
    this.IssuingDevice = true;
    this.rpm.GetPHDevicesByPatientId(this.CurrentPatient.id).subscribe(
      (res: any) => {
          this.devicesList = res;
          if (this.devicesList.length) {
           const deviceAvailable =  this.devicesList.filter((device: RPMDeviceListDtoNew) => device.modality === this.selectedDevice.modality);
           if(deviceAvailable.length){
            // this.toaster.warning('This Patient already has a device of the same modality.');
            this.alreadyHaveADevice = `Patient already has ${this.selectedDevice.modalityName} device assigned. Please return that 
            device before assigning a new device for same ${this.selectedDevice.modalityName}. Current 
            device serial number is ${this.selectedDevice.serialNo}`
           }else{
            this.alreadyHaveADevice = '';
            this.IssueDevice();
           }
          }else{
            this.alreadyHaveADevice = '';
            this.IssueDevice();
          }
          this.IssuingDevice = false;
        },
        (err) => {
          this.IssuingDevice = false;
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }
  ActivatePhDevice = () => {
    if (this.selectedDevice.status === PHDeviceStatus.Active) {
      this.GetPHDevicesByPatientId();
      return;
    }
    this.makingDeviceActive = true;
    this.IssuingDevice = true;
    this.deviceService.ActivatePhDevice(this.selectedDevice.id).subscribe(
      (res: any) => {
        this.GetPHDevicesByPatientId();
        this.makingDeviceActive = false;
        this.selectedDevice.status = PHDeviceStatus.Active;
        // this.toaster.success('Device activated')
      },
      (error: HttpResError) => {
        this.makingDeviceActive = false;
        this.IssuingDevice = false;
        this.toaster.error(error.error, error.message);
      }
      );
    }
  closeIssueDeviceModal(){
  this.CurrentPatient = new PatientDto();
  this.selectedDevice = new  RpmPHDeviceListDto();
  this.searchParam = '';
  }
  openConfirmModal() {
    const modalDto1 = new LazyModalDto();
    modalDto1.Title = 'Confirmation';
    modalDto1.Text =
      `The device ${this.selectedDevice.serialNo} will be issued to ${this.CurrentPatient.fullName}. Do you want to proceed?`;
    modalDto1.callBack = this.callBackBhi;
    modalDto1.rejectCallBack = this.rejectCallBackBhi;
    this.appUiService.openLazyConfrimModal(modalDto1);
}
rejectCallBackBhi = () => {
}
callBackBhi = (row) => {
  this.ActivatePhDevice();
}
}
