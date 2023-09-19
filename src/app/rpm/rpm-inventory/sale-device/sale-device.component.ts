import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import moment from "moment";
import { ModalDirective, ToastService } from "ng-uikit-pro-standard";
import { ECalendarValue, IDatePickerConfig } from "ng2-date-picker";
import { DeviceManagementService } from "src/app/core/device-management.service";
import { EventBusService, EventTypes } from "src/app/core/event-bus.service";
import { FacilityService } from "src/app/core/facility/facility.service";
import { PatientsService } from "src/app/core/Patient/patients.service";
import { RpmService } from "src/app/core/rpm.service";
import { PhdevicePricingService } from "src/app/core/rpm/phdevice-pricing.service";
import { SecurityService } from "src/app/core/security/security.service";
import { SearchedChatUsersDto } from "src/app/model/chat/chat.model";
import { HttpResError } from "src/app/model/common/http-response-error";
import { FacilityDto } from "src/app/model/Facility/facility.model";
import {
  DeviceRequestListDto,
  RpmPHDeviceListDto,
  SaleDeviceToFacilityDto,
} from "src/app/model/Inventory/rpm-inventory.model";
import { FilterPatient, PatientDto } from "src/app/model/Patient/patient.model";
import {
  PHDevicePricingListDto,
  SaleTypeEnum,
  TransmissionChargesDto,
} from "src/app/model/rpm/phdevice-pricing.model";
import { CheckPatientDeviceExistsDto } from "src/app/model/ScreeningTools/phq.modal";

@Component({
  selector: "app-sale-device",
  templateUrl: "./sale-device.component.html",
  styleUrls: ["./sale-device.component.scss"],
})
export class SaleDeviceComponent implements OnInit {
  @ViewChild("saleDeviceModal") saleDeviceModal: ModalDirective;
  @ViewChild("ConfirmsaleDeviceModal") ConfirmsaleDeviceModal: ModalDirective;
  saleModalBackdrop = true;
  selectedDeviceIds = new Array();
  checkPatientDeviceExistsDto = new CheckPatientDeviceExistsDto();
  isBulkIssuance = false;
  selectedFacility = new FacilityDto();
  selectedSaleDevice = new Array<RpmPHDeviceListDto>();
  deviceRequest = new DeviceRequestListDto();
  saleDeviceToFacilityObj = new SaleDeviceToFacilityDto();
  facilityList = new Array<FacilityDto>();
  organizationId: number;
  facilityId: number;
  gettingInHandDevices: boolean;
  gettingFacilitiesList: boolean;
  rpmDevicesList: RpmPHDeviceListDto[] = [];
  filterModalStr = "";
  CurrentPatient = new PatientDto();
  @Output() ReloadInventory: EventEmitter<any> = new EventEmitter<any>();
  gettignPricing: boolean;
  gettignCharges: boolean;
  transmissionCHargesObj: TransmissionChargesDto;
  phDevicesPricingList: PHDevicePricingListDto[];

  filterPatientDto = new FilterPatient();
  searchedChatUserList: PatientDto[];
  searchParam = "";
  searchingChatUsers: boolean;
  alreadyPendingBillingMsg: string;
  cpT99453: boolean;
  IssuingDevice: boolean;
  SaleTypeEnumObj = SaleTypeEnum;
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    max: moment().format("YYYY-MM-DD"),
    min: moment().startOf("month").format("YYYY-MM-DD"),
    format: "YYYY-MM-DD",
    appendTo: "body",
    disableKeypress: true,
    drops: "down",
  };
  sellingDevice: boolean;
  preserveSelectedSaleDevice: RpmPHDeviceListDto[];
  preserveSelectedFacility= new FacilityDto();
  salePriceSum= 0;
  shippingSum: number;
  discountSum: number;
  totalPriceSum: number;
  scanMessage: string;
  selectedDetailsType = 'facility';
  scanAudio = new Audio();
  scanErrorAudio = new Audio();
  patientHaveAlreadyModality= false;
  alreadyExistWarning: string;
  constructor(
    private securityService: SecurityService,
    private deviceService: DeviceManagementService,
    private PHDPricing: PhdevicePricingService,
    private toaster: ToastService,
    private facilityService: FacilityService,
    private patientService: PatientsService,
    private rpm: RpmService,
    private eventBus: EventBusService,
  ) {}

  ngOnInit(): void {
    this.organizationId =
      +this.securityService.getClaim("OrganizationId").claimValue;
    this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    if (!this.facilityId) {
      this.facilityId = 0;
    }
    this.eventBus.on(EventTypes.DeviceScanResult).subscribe((res) => {
      this.SelectScannedDevice(res)
     });
     this.scanAudio.src = '../../../../assets/sounds/scan.mp3';
     this.scanAudio.load();
     this.scanErrorAudio.src = '../../../../assets/sounds/scanerror.mp3';
     this.scanErrorAudio.load();
  }

  SelectScannedDevice(serial: string) {
    const scannedDevice = this.rpmDevicesList.find(x => x.serialNo == serial || x.macAddress == serial);
    if (!scannedDevice) {
      this.presentScanMessage(`Device ${serial} not found`);
    }
    const selectedDevice = this.selectedSaleDevice.find(x => x.serialNo == serial || x.macAddress == serial);
    if (selectedDevice) {
      this.presentScanMessage(`Device: ${serial} already selected`);
    }
    if (scannedDevice && !selectedDevice) {
      this.selectedSaleDevice.push(scannedDevice);
      this.selectedSaleDevice = [...this.selectedSaleDevice]
      this.scanAudio.play()
    } else {
      this.scanErrorAudio.play()
    }
  }
  presentScanMessage(message: string) {
    this.scanMessage = message;
    setTimeout(() => {
      this.scanMessage = '';
    }, 3000);
  }
  getFacilitiesbyOrgId() {
    if (!this.organizationId) {
      return;
    }
    this.gettingFacilitiesList = true;
    this.facilityService.getFacilityByOrgId(this.organizationId, false, true).subscribe(
      (res: any) => {
        this.gettingFacilitiesList = false;
        if (res) {
          this.facilityList = res;
        }
        if (this.deviceRequest?.id) {
          this.selectedFacility = this.facilityList.find(x => x.id == this.deviceRequest.facilityId)
        }
      },
      (error) => {
        this.toaster.error(error.message, error.error || error.error);
        this.gettingFacilitiesList = false;
      }
    );
  }
  GetInhandDevices() {
    this.gettingInHandDevices = true;
    this.deviceService
      .GetRpmInventoryDevices(
        this.facilityId,
        true,
        false,
        false,
        this.filterModalStr
      )
      .subscribe(
        (res: any[]) => {
          if (res) {
            if (this.deviceRequest?.id) {
              res = res.filter(x => x.modality == this.deviceRequest.modalityCode);
            }
            this.rpmDevicesList = res;
          }

          const selectedDevices = [];
          if (this.selectedDeviceIds.length) {
            this.selectedDeviceIds.forEach((deviceid) => {
             var findDevice = this.rpmDevicesList.find((rpmDev) => rpmDev.id == deviceid)
              if(findDevice){
                selectedDevices.push(findDevice)
              }
            })
            this.selectedSaleDevice = [...selectedDevices];
            // var findDevices = this.rpmDevicesList.find((device) => {
            //   return this.selectedDeviceIds.forEach(
            //     (ssId) => ssId == device.id
            //   );
            // });
          }

          this.gettingInHandDevices = false;
        },
        (err: HttpResError) => {
          this.toaster.error(err.message);
          this.gettingInHandDevices = false;
        }
      );
  }
  saleDevice() {
    var phDeviceIds = [];
    this.sellingDevice = true;
    this.saleDeviceToFacilityObj.facilityToId = this.selectedFacility.id;
    if (this.selectedSaleDevice.length) {
      this.selectedSaleDevice.forEach((device) => {
        phDeviceIds.push(device.id);
      });
    }
    this.saleDeviceToFacilityObj.phDeviceIds = phDeviceIds;
    this.PHDPricing.MultipleSaleDeviceToFacility(
      this.saleDeviceToFacilityObj
    ).subscribe(
      (res: any) => {
        // this.toaster.success("Successfully","Device Soled");
        this.ReloadInventory.next();
        // this.saleDeviceModal.hide();
        if (this.CurrentPatient.id) {
          this.IssueDevice(
            this.saleDeviceToFacilityObj.phDeviceIds,
            this.saleDeviceToFacilityObj.saleDate || ""
          );
          this.saleModalBackdrop = true;
          this.closeTransferModal();
          this.ConfirmsaleDeviceModal.hide();
        } else {
          this.saleModalBackdrop = true;
          this.closeTransferModal();
          this.ConfirmsaleDeviceModal.hide();
          this.toaster.success("Device Sold");
          this.saleDeviceModal.hide();
        }
        this.sellingDevice = false;
      },
      (err: HttpResError) => {
        this.sellingDevice = false;
        this.toaster.error(err.error || err.error);
      }
    );
  }
  IssueDevice(deviceId, saleDate?: string) {
    this.IssuingDevice = true;
    // this.
    this.deviceService
      .AssignDeviceToPatient(
        this.CurrentPatient.id,
        deviceId[0] || this.selectedSaleDevice[0].id,
        this.cpT99453,
        saleDate
      )
      .subscribe(
        (res: any[]) => {
          this.IssuingDevice = false;
          this.toaster.success("Operation successfull");
          this.alreadyPendingBillingMsg = "";
          this.cpT99453 = false;
          this.ReloadInventory.next();
          this.saleDeviceModal.hide();
        },
        (err: HttpResError) => {
          this.toaster.error(err.error || err.error);
          this.IssuingDevice = false;
        }
      );
  }
  closeTransferModal() {
    this.selectedFacility = new FacilityDto();
    this.selectedSaleDevice = new Array<RpmPHDeviceListDto>();
    this.CurrentPatient = new PatientDto();
    this.alreadyPendingBillingMsg = "";
    this.searchParam = "";
    this.saleDeviceToFacilityObj = new SaleDeviceToFacilityDto();
    this.selectedDetailsType = 'facility';
    this.isBulkIssuance = false;

  }
  facilityChanged() {
      this.GetPricingsByFacilityId();
      this.GetTransmissionChargesByFacilityId();
      this.CurrentPatient = new PatientDto();
      this.saleDeviceToFacilityObj = new SaleDeviceToFacilityDto();
      this.saleDeviceToFacilityObj.saleDate = moment().format("YYYY-MM-DD");
      this.searchParam = '';
  }
  GetPricingsByFacilityId() {
    this.gettignPricing = true;
    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
    this.PHDPricing.GetPricingsByFacilityId(this.selectedFacility.id).subscribe(
      (res: PHDevicePricingListDto[]) => {
        this.gettignPricing = false;
        this.phDevicesPricingList = res.sort((x, y) =>
          x.modality.localeCompare(y.modality)
        );
        this.ApplyDefaultPricing();
      },
      (error: HttpResError) => {
        this.toaster.error(error.error || error.error);
        this.gettignPricing = false;
        // this.closeModal.emit();
      }
    );
  }
  GetTransmissionChargesByFacilityId() {
    this.gettignCharges = true;
    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
    this.PHDPricing.GetTransmissionChargesByFacilityId(
      this.selectedFacility.id
    ).subscribe(
      (res: TransmissionChargesDto) => {
        this.gettignCharges = false;
        this.transmissionCHargesObj = res;
        // this.saleDeviceToFacilityObj.transmissionCharges = this.transmissionCHargesObj.transmissionCharges
      },
      (error: HttpResError) => {
        this.toaster.error(error.error || error.error);
        this.gettignCharges = false;
        // this.closeModal.emit();
      }
    );
  }
  FillSaleDataFromRequest( row: DeviceRequestListDto) {
    this.deviceRequest = row;
    this.saleDeviceToFacilityObj.saleType = row.saleType;
    this.saleDeviceToFacilityObj.salePrice =row.salePrice;
    this.saleDeviceToFacilityObj.shipping = row.shipping;
    this.saleDeviceToFacilityObj.discount = 0;
    this.saleDeviceToFacilityObj.totalPrice = row.totalPrice;
    this.saleDeviceToFacilityObj.note = row.note;
    this.saleDeviceToFacilityObj.installmentCount = row.installmentCount;
    this.saleDeviceToFacilityObj.requestNumber = row.requestNumber;
    if (row.patientId) {
      this.selectedDetailsType = 'patient'
      const newPatient = new SearchedChatUsersDto();
      newPatient.id = row.patientId;
      this.SelectPatient(newPatient)
      this.checkPatientDeviceExists()
    } else {
      this.selectedDetailsType = 'facility'
    }
  }
  ApplyDefaultPricing() {
    const modalityPricing = this.phDevicesPricingList?.find(
      (x) => x.modality === this.selectedSaleDevice[0]?.modality
    );
    this.saleDeviceToFacilityObj.saleType = SaleTypeEnum.Sale;
    this.saleDeviceToFacilityObj.salePrice = modalityPricing?.price;
    this.saleDeviceToFacilityObj.shipping = 0;
    this.saleDeviceToFacilityObj.discount = 0;
    this.saleDeviceToFacilityObj.totalPrice = modalityPricing?.price;
    this.saleDeviceToFacilityObj.note = "";
    this.saleDeviceToFacilityObj.installmentCount = modalityPricing?.installmentsCount;
  }
  SaleTypeCHanged() {
    const modalityPricing = this.phDevicesPricingList?.find(
      (x) => x.modality === this.selectedSaleDevice[0]?.modality
    );
    if (modalityPricing) {
      if (this.saleDeviceToFacilityObj.saleType === SaleTypeEnum.Sale) {
        this.saleDeviceToFacilityObj.salePrice = modalityPricing.price;
        this.saleDeviceToFacilityObj.installmentCount = 0;
      } else {
        this.saleDeviceToFacilityObj.installmentCount =
          modalityPricing.installmentsCount || 2;
        this.saleDeviceToFacilityObj.salePrice = modalityPricing.leasePrice;
      }
    }
    this.PricesChanged();
  }
  PricesChanged() {
    if(!this.saleDeviceToFacilityObj.salePrice){
      this.saleDeviceToFacilityObj.salePrice = 0;
    }
    if(!this.saleDeviceToFacilityObj.shipping){
      this.saleDeviceToFacilityObj.shipping = 0;
    }
    if(!this.saleDeviceToFacilityObj.discount){
      this.saleDeviceToFacilityObj.discount = 0;
    }
    if(!this.saleDeviceToFacilityObj.installmentCount){
      this.saleDeviceToFacilityObj.discount = 0;
    }
    if (
      this.saleDeviceToFacilityObj.discount >
      this.saleDeviceToFacilityObj.salePrice
    ) {
      this.toaster.warning("Discount should be less than sale price");
      this.saleDeviceToFacilityObj.discount = 0;
    }
    this.saleDeviceToFacilityObj.totalPrice =
      (this.saleDeviceToFacilityObj.salePrice +  (this.saleDeviceToFacilityObj?.shipping || 0)) - (this.saleDeviceToFacilityObj?.discount || 0);
  }
  bulkSelectDevice() {
    if(this.selectedDetailsType == 'patient' && this.selectedSaleDevice.length > 1){
      this. selectedSaleDevice = this.selectedSaleDevice.filter((device, index) => index ==0);
      this.toaster.warning('You are not able to sale multiple devices to patient.');
    }
    if(this.selectedDetailsType == 'patient'){
     this.checkPatientDeviceExists();
    }

  }
  resetSelectedDevicesList(){
    this.CurrentPatient = new PatientDto();
    this.selectedFacility = new FacilityDto();
    if(this.selectedSaleDevice.length > 1){
      this.selectedSaleDevice = new Array<RpmPHDeviceListDto>();
      this.saleDeviceToFacilityObj = new SaleDeviceToFacilityDto();
      this.saleDeviceToFacilityObj.saleDate = moment().format("YYYY-MM-DD");
    }
    this.patientHaveAlreadyModality = false;
    this.alreadyPendingBillingMsg = "";
    this.searchParam = "";
    this.alreadyExistWarning = "";
  }
  checkPatientDeviceExists() {
    this.alreadyExistWarning = ''
      this.checkPatientDeviceExistsDto.patientId = this.CurrentPatient.id;
      this.checkPatientDeviceExistsDto.modalityCode =
        this.selectedSaleDevice[0]?.modality;
      if (this.checkPatientDeviceExistsDto.modalityCode) {
        this.PHDPricing
          .CheckPatientDeviceExists(this.checkPatientDeviceExistsDto)
          .subscribe(
            (res: boolean) => {
              if (res == true) {
                this.patientHaveAlreadyModality = true;
                // this.toaster.warning('This Patient already have a device of same modality.')
                this.alreadyExistWarning = 'This Patient already have a device of same modality'
              } else {
                this.patientHaveAlreadyModality = false;
              }
            },
            (err: HttpResError) => {
              this.toaster.error(err.error);
            }
          );
      }

  }
  InstallmentChanged() {
    if (this.saleDeviceToFacilityObj.discount) {
    }
    if (
      this.saleDeviceToFacilityObj.saleType === SaleTypeEnum.Lease &&
      this.saleDeviceToFacilityObj.installmentCount < 1
    ) {
      this.toaster.warning("Installments can not be Zero");
      this.saleDeviceToFacilityObj.installmentCount = 1;
    }
  }
  getFilterPatientsList2() {
    if (
      this.CurrentPatient.fullName + " " + this.CurrentPatient.patientEmrId ==
      this.searchParam
    ) {
      return;
    }
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
    this.filterPatientDto.FacilityId = this.selectedFacility.id;
    this.filterPatientDto.PageNumber = 1;
    this.filterPatientDto.PageSize = 20;
    this.filterPatientDto.SearchParam = this.searchParam;
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
  SelectPatient(patient: SearchedChatUsersDto) {
    if(this.selectedSaleDevice.length > 1){
      this.selectedSaleDevice = new Array<RpmPHDeviceListDto>();
    }
    this.searchedChatUserList = [];
    this.alreadyPendingBillingMsg = "";
    this.cpT99453 = false;
    this.patientService
      .getPatientDetail(patient.id)
      .subscribe((res: PatientDto) => {
        this.searchParam = res.fullName + " " + res.patientEmrId;
        this.CurrentPatient = res;
        if(this.selectedSaleDevice.length == 1){
        }
        this.checkPatientDeviceExists();
      });
    this.CheckUnbilledDeviceConfigClaim(patient.id);
  }
  CheckUnbilledDeviceConfigClaim(patientId: number) {
    this.rpm.CheckUnbilledDeviceConfigClaim(patientId).subscribe(
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
  calculateSale(){
    const quantity = this.selectedSaleDevice.length;
    this.salePriceSum = (this.saleDeviceToFacilityObj.salePrice * quantity) || 0;
    this.shippingSum = (this.saleDeviceToFacilityObj.shipping * quantity) || 0;
    this.discountSum = (this.saleDeviceToFacilityObj.discount * quantity) || 0;
    this.totalPriceSum = (this.salePriceSum + this.shippingSum)- this.discountSum;
  }
}
