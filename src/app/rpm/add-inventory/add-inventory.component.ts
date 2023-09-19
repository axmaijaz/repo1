import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { iif, Subject } from 'rxjs';
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';
import { debounceTime } from 'rxjs/operators';
import { TwocChatService } from 'src/app/core/2c-chat.service';
import { AppUiService } from 'src/app/core/app-ui.service';
import { ClonerService } from 'src/app/core/cloner.service';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { DeviceVendorService } from 'src/app/core/rpm/device-vendor.service';
import { PhdevicePricingService } from 'src/app/core/rpm/phdevice-pricing.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { SmartMeterService } from 'src/app/core/smart-meter.service';
import { CustomerType } from 'src/app/Enums/smartMeter.enum';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { SearchedChatUsersDto } from 'src/app/model/chat/chat.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { FacilityDto } from 'src/app/model/Facility/facility.model';
import { FilterPatient, PatientDto } from 'src/app/model/Patient/patient.model';
import { PHDevicePricingListDto, SaleTypeEnum, TransmissionChargesDto } from 'src/app/model/rpm/phdevice-pricing.model';
import { CheckPatientDeviceExistsDto } from 'src/app/model/ScreeningTools/phq.modal';
import { AddInventoryDto, CreateOrderDevice, CreateSMOrderDto, DeviceVendorsListDto, Line, SMModelDto, SMOrderDetailsRes, SMOrderListDto, SMSKuDto, THExcelFileDto } from 'src/app/model/smartMeter.model';

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.scss']
})
export class AddInventoryComponent implements OnInit {
  manualOrder = true;
  facilityId: number;
  facilityList = new Array<FacilityDto>();
  createSMOrderObj = new CreateSMOrderDto();
  creatingSMOrders: boolean;
  selectedSku: any;
  skuQty = 1;
  searchParam = '';
  searchedChatUserList = new Array<SearchedChatUsersDto>();
  checkPatientDeviceExistsDto = new CheckPatientDeviceExistsDto();
  searchWatch = new Subject<string>();
  searchIngPatients: boolean;
  customerType = 2;
  skuList: SMSKuDto[] = [];
  skuListPres: SMSKuDto[] = [];
  modelList: SMModelDto[] = [];
  modelListPres: SMModelDto[] = [];
  deviceVendorsList: DeviceVendorsListDto[] = [];
  datass: any;
  filterPatientId: number;
  LoadingData: boolean;
  filterPatientDto = new FilterPatient();
  patientList: PatientDto[];
  patientId: number;
  selectedPatient: PatientDto;
  previousOrdersList: any;
  isLoadingPreviousOrders: boolean;
  selectedVendor = new DeviceVendorsListDto();
  selectedSkuLine = new Line();
  allDevicesFile: File;
  skuDevicesFile: File;
  gettignPricing: boolean;
  phDevicesPricingList: PHDevicePricingListDto[];
  gettignCharges: boolean;
  transmissionCHargesObj: TransmissionChargesDto;
  SaleTypeEnumObj = SaleTypeEnum;
  patientHaveAlreadyModality = false;
  selectedTab = 0;
  addInventoryDto = new AddInventoryDto();

  manualOrderId = '';
  gettingSMOrders: boolean;
  orderDetailObj: SMOrderDetailsRes;
  trackingNumberList: any;
  LoadingDataOrder: boolean;


  constructor(private toaster: ToastService, private patientService: PatientsService, private smService: SmartMeterService,
    private dvService: DeviceVendorService, private cloner: ClonerService, private filterData: DataFilterService, private PHDPricing: PhdevicePricingService,
    private facilityService: FacilityService, private securityService: SecurityService, private location: Location,
    private TwocHatService: TwocChatService, private router: Router, private route: ActivatedRoute, private appUi: AppUiService,) { }

  ngOnInit(): void {
    this.patientId = +this.route.snapshot.queryParamMap.get('patient');
    this.facilityId = +this.route.snapshot.queryParamMap.get('facility');
    if (this.facilityId && this.patientId) {
      this.getFacilityList();
      this.SearchObserver();
      this.filterPatientId = this.patientId;
      const fillPatientDetail = true
      this.getPatientById(this.patientId, fillPatientDetail);
    } else {
      this.SearchObserver();
      // this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
      // if (!this.facilityId) {
      this.facilityId = 0;
      // }
      this.getFacilityList();
    }
    this.GetDeviceVendors();
  }
  OrderTypeChanged() {
    this.manualOrder = !this.manualOrder;
    this.selectedVendor = new DeviceVendorsListDto();
    this.skuListPres = [];
    this.skuList = [];
    this.createSMOrderObj.lines = [];
    this.previousOrdersList = [];
    if (this.manualOrder) {
      this.customerType = CustomerType.CCHealth;
      this.CustomerTypeCHanged();
    }
  }

  autoFillPatientAndFacilityData() {
    this.customerType = CustomerType.Patient;
    this.CustomerTypeCHanged();
    if (this.selectedPatient) {
      this.patientList.push(this.selectedPatient);
    }

  }
  VendorChanged() {
    this.skuList = [];
    this.skuListPres = [];
    this.GetSkus();
    this.getDeviceModels();
    this.createSMOrderObj.lines = [];
    this.addInventoryDto.devices = []
    this.previousOrdersList = [];

  }
  CustomerTypeCHanged() {
    this.patientHaveAlreadyModality = false;
    this.selectedSku = null;
    this.skuQty = 1
    if (!this.createSMOrderObj.customer_type && this.createSMOrderObj.customer_type !== 0) {
      this.createSMOrderObj.customer_type = +this.customerType;
    }
    if (+this.createSMOrderObj.customer_type !== +this.customerType) {
      this.createSMOrderObj = new CreateSMOrderDto();
      this.createSMOrderObj.customer_type = +this.customerType;
    }
    this.filterPatientId = null;
    // DELIVERY IS ONLY USED FOR sMARTMETER
    this.skuList = this.skuListPres.filter(x => x.delivery.toString() === this.customerType.toString() || x.delivery.toString() === '2' || this.customerType == CustomerType.CCHealth);
    this.previousOrdersList = [];
  }
  // SearchObserver() {
  //   this.searchWatch.pipe(debounceTime(1000)).subscribe(x => {
  //     if (x) {
  //       this.searchChatUsers(x);
  //     }
  //   });
  // }
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
  getFilterPatientsList2() {
    const fPDto = new FilterPatient();
    this.patientList = [];
    this.LoadingData = true;
    for (const filterProp in this.filterPatientDto) {
      if (
        this.filterPatientDto[filterProp] === null ||
        this.filterPatientDto[filterProp] === undefined
      ) {
        this.filterPatientDto[filterProp] = fPDto[filterProp];
        // this.FilterPatientDto[filterProp] = 0;
      }
    }
    this.LoadingData = true;
    // this.LoadingDataPayersList = true;
    this.filterPatientDto.FacilityUserId = 0;
    // FacilityId = 0
    this.filterPatientDto.CareProviderId = 0;
    this.filterPatientDto.FacilityId = this.facilityId;
    this.filterPatientDto.PageNumber = 1;
    this.filterPatientDto.PageSize = 20;
    this.filterPatientDto.ccmStatus = [];

    this.patientService.getFilterPatientsList2(this.filterPatientDto).subscribe(
      (res: any) => {
        this.LoadingData = false;
        this.patientList = res.patientsList;
      },
      (error: HttpResError) => {
        this.LoadingData = false;
        // this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  searchChatUsers(searchStr: string) {
    if (!searchStr) {
      searchStr = '';
    }
    this.searchIngPatients = true;
    this.TwocHatService.SearchChatUsers(
      this.securityService.securityObject.appUserId,
      this.facilityId,
      searchStr,
      1
    ).subscribe(
      res => {
        this.searchIngPatients = false;
        this.searchedChatUserList = res;
      },
      err => {
        this.searchIngPatients = false;
        this.toaster.show('error searching data');
      }
    );
  }
  getPatientById(filterPatientId: number, fillPatientDetail?: boolean) {
    if (filterPatientId) {
      this.patientList = [];
      this.LoadingData = true;
      this.patientService.getPatientDetail(filterPatientId).subscribe(
        (res: PatientDto) => {
          this.LoadingData = false;
          this.selectedPatient = res;
          this.searchParam = res.firstName + ' ' + res.lastName;
          this.createSMOrderObj.customer_id = res.id.toString();
          this.createSMOrderObj.customer_name = res.firstName + ' ' + res.lastName;
          this.createSMOrderObj.address1 = res.currentAddress;
          this.createSMOrderObj.city = res.city;
          this.createSMOrderObj.state = res.state;
          this.createSMOrderObj.zipcode = res.zip;
          this.previousOrdersList = [];
          if (fillPatientDetail) {
            this.autoFillPatientAndFacilityData();
          }
        }, (err) => {
          this.LoadingData = false;

        });
    }
  }
  getFacilityList() {
    this.facilityService
      .getFacilityList()
      .subscribe(
        (res: any) => {
          if (res) {
            this.facilityList = res;
            // console.log(this.facilityList)
          }
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
          // console.log(error);
        }
      );
  }
  GetSmartMeterOrderDetail(modal: ModalDirective) {
    this.gettingSMOrders = true;
    this.LoadingDataOrder = true;
    this.smService.GetOrderDetails(this.manualOrderId.trim())
      .subscribe(
        (res: SMOrderDetailsRes) => {
          // modal.hide();
          this.orderDetailObj = res;
          // this.orderDetailObj.order['oStatus'] = this.orderStatusEnum[order.orderStatus];
          if(this.orderDetailObj?.order?.tracking_number){
            this.trackingNumberList = this.orderDetailObj.order.tracking_number.split(',');
          }
          this.LoadingDataOrder = false;
        },
        (err: HttpResError) => {
          this.toaster.error(err.message);
          this.gettingSMOrders = false;
        })
  }
  GetDeviceVendors() {
    this.dvService
      .GetDeviceVendors().subscribe(
        (res: DeviceVendorsListDto[]) => {
          res = res.filter(item => item.code !== 'DX')
          Object.assign(this.deviceVendorsList, res);
          this.selectedVendor = this.deviceVendorsList[0]
          // console.log(this.facilityList)
          this.GetSkus();
          this.getDeviceModels();
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
          // console.log(error);
        }
      );
  }
  GetSkus() {
    this.dvService
      .GetSkusByVendorId(this.selectedVendor.id)
      .subscribe(
        (res: SMModelDto[]) => {
          Object.assign(this.skuListPres, res);
          // Object.assign(this.skuList, res);
          if (this.customerType || this.customerType == 0) {
            this.CustomerTypeCHanged();
          }
          // console.log(this.facilityList)
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
          // console.log(error);
        }
      );
  }
  getDeviceModels() {
    this.dvService.GetDeviceModelsByVendorId(this.selectedVendor.id).subscribe((res: SMSKuDto) => {
      Object.assign(this.modelListPres, res);
      if (this.customerType || this.customerType == 0) {
        this.CustomerTypeCHanged();
      }
    },
      (err) => {
        this.toaster.error(err.message, err.error || err.error);
      })
  }
  SkuChanged() {
    console.log(this.selectedSku)
  }
  checkPatientDeviceExists() {
    if (this.customerType === CustomerType.Patient) {
      this.checkPatientDeviceExistsDto.patientId = this.selectedPatient.id;
      this.checkPatientDeviceExistsDto.modalityCode =
        this.selectedSku.modality;
      if (this.checkPatientDeviceExistsDto.modalityCode) {
        this.PHDPricing
          .CheckPatientDeviceExists(this.checkPatientDeviceExistsDto)
          .subscribe(
            (res: boolean) => {
              if (res == true) {
                this.patientHaveAlreadyModality = true;
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
  }

  AddSMOrderDevice(modal: ModalDirective) {

    var selectedDevice = new CreateOrderDevice();
    let dataValid = true;
    this.orderDetailObj?.order?.lines.forEach((element) => {
      const filteredData = this.modelListPres.filter((deviceModel: any) => deviceModel.name == element.device_model);
      if (!element.serial_number || !element.imei || !element.device_model) {
        return;
      }
      if (!filteredData) {
        dataValid = false;
        return;
      }
      selectedDevice.serialNo = element.serial_number;
      selectedDevice.macAddress = element.imei?.toString();
      selectedDevice.model = element.device_model;
      this.addInventoryDto.devices.push(selectedDevice);
      selectedDevice = new CreateOrderDevice();
    })
    if (!dataValid) {
      this.toaster.warning(`Device data invalid`)
    }
    this.addInventoryDto.vendorId = this.selectedVendor.id;
    modal.hide()
  }
  AddSku() {
    if (this.createSMOrderObj.lines?.length && this.selectedVendor?.code !== 'Tellihealth') {
      this.toaster.warning('Already one SKU selected')
    } else {
      if (!this.createSMOrderObj?.lines) {
        this.createSMOrderObj.lines = [];
      }
      if (this.selectedSku && this.selectedSku.sku && this.skuQty) {
        const alreadyExist = this.createSMOrderObj?.lines?.find(x => x.sku === this.selectedSku.sku);
        if (alreadyExist) {
          alreadyExist.quantity = this.skuQty;
        } else {
          const modality = this.selectedSku.modality;
          const modalityPricing = this.phDevicesPricingList?.find(x => x.modality === modality)
          this.createSMOrderObj?.lines.push(
            {
              modality: modality,
              line_name: this.selectedSku.description,
              quantity: this.skuQty,
              sku: this.selectedSku.sku,
              devices: [],
              "saleType": SaleTypeEnum.Sale,
              "salePrice": modalityPricing?.price,
              "shipping": 0,
              "discount": 0,
              "totalPrice": modalityPricing?.price,
              "note": "",
              "installmentCount": 0,
              "freeTransmissionMonths": 0
              // "transmissionCharges": this.transmissionCHargesObj.transmissionCharges
            });
        }
      }
      if (this.selectedSku && this.selectedSku.sku && !this.skuQty) {
        this.createSMOrderObj.lines = this.createSMOrderObj?.lines?.filter(x => x.sku !== this.selectedSku.sku);
      }
      this.createSMOrderObj.lines = [...this.createSMOrderObj.lines];
      this.selectedSku = new SMSKuDto();
      this.skuQty = 1;
    }
    if (this.customerType == CustomerType.Patient) {
      this.getOrdersListByPatientId();
    } else {
      this.getOrdersListByFacilityId();
    }
  }
  getOrdersListByPatientId() {
    if (this.selectedPatient && this.selectedPatient.id) {
      this.isLoadingPreviousOrders = true;
      this.smService.getOrdersListByPatientId(this.selectedPatient.id).subscribe(
        (res: any) => {
          this.previousOrdersList = res;
          this.isLoadingPreviousOrders = false;
        }, (err: HttpResError) => {
          this.toaster.error(err.error);
          this.isLoadingPreviousOrders = false;
        }
      )
    }
  }
  getOrdersListByFacilityId() {
    if (this.facilityId) {
      this.isLoadingPreviousOrders = true;
      this.smService.getOrdersListByFacilityId(this.facilityId).subscribe(
        (res: any) => {
          this.previousOrdersList = res;
          this.isLoadingPreviousOrders = false;
        }, (err: HttpResError) => {
          this.toaster.error(err.error);
          this.isLoadingPreviousOrders = false;
        }
      )
    }
  }
  changed(searchStr: string) {
    if (!searchStr) {
      this.searchedChatUserList = new Array<SearchedChatUsersDto>();
      return;
    }
    this.searchWatch.next(searchStr);
  }
  facilityChanged() {
    if (0 === +this.createSMOrderObj.customer_type) {
      const facility = this.facilityList.find(x => x.id === this.facilityId);
      if (!facility) {
        return;
      }
      this.createSMOrderObj.customer_id = facility.id.toString();
      this.createSMOrderObj.customer_name = facility.facilityName;
      this.createSMOrderObj.address1 = facility.address;
      this.createSMOrderObj.city = facility.city;
      this.createSMOrderObj.state = facility.stateName;
      this.createSMOrderObj.zipcode = facility.zipCode;
    }
    this.GetTransmissionChargesByFacilityId();
    this.GetPricingsByFacilityId();
  }

  createOrder() {
    if (this.addInventoryDto.devices || this.addInventoryDto.devices.length) {
      this.openConfirmModal();
    } else {
      this.CreateSMOrder();
    }
  }

  openConfirmModal() {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Order Confirmation";
    modalDto.Text = 'Are you sure you want to order?';
    modalDto.callBack = this.callBack;
    // modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.CreateSMOrder();
  }
  CreateSMOrder() {
    this.creatingSMOrders = true;

    this.dvService.AddInventory(this.addInventoryDto)
      .subscribe(
        (res: any) => {
          this.toaster.success('Order created successfully');
          this.creatingSMOrders = false;
          this.addInventoryDto = new AddInventoryDto();
          this.navigateBack();
        },
        (error: HttpResError) => {
          this.toaster.error(error.message, error.error);
          this.creatingSMOrders = false;
        }
      );
  }
  navigateBack() {
    this.location.back();
  }
  DeleteSku(row: any) {
    this.createSMOrderObj?.lines.splice(row, 1);
    this.previousOrdersList = [];
  }
  OpenSkuDetailModal(orderDevicesDetailModal: ModalDirective, row: Line) {
    this.selectedSkuLine = this.cloner.deepClone<Line>(row);
    orderDevicesDetailModal.show();
  }
  OrderDeviceDetailMOdalClosed() {
    let row = this.createSMOrderObj?.lines.find(x => x.sku === this.selectedSkuLine.sku);
    const newData = this.cloner.deepClone<Line>(this.selectedSkuLine);
    Object.assign(row, newData)
  }
  async OnAddAllDevices(output: any): Promise<void> {
    if (output.target.files[0]) {
      this.allDevicesFile = output.target.files[0];
    }
    const fileData = await this.ReadExcelFile(this.allDevicesFile) as THExcelFileDto[];
    const isDataValid = this.ValidateExcelData(fileData);
    if (isDataValid) {
      var selectedDevice = new CreateOrderDevice();
      fileData.forEach((element) => {
        selectedDevice.serialNo = element.serialNumber;
        selectedDevice.macAddress = element.imei.toString();
        selectedDevice.model = element.modelNumber;
        this.addInventoryDto.devices.push(selectedDevice);
        selectedDevice = new CreateOrderDevice();
      })
      this.addInventoryDto.vendorId = this.selectedVendor.id;
    } else {
      this.toaster.warning(`Invalid Excel File Data`);
    }
  }
  async OnAddSkuDevices(output: any): Promise<void> {
    if (output.target.files[0]) {
      this.skuDevicesFile = output.target.files[0];
    }
    const fileData = await this.ReadExcelFile(this.skuDevicesFile) as [];
    const isDataValid = this.ValidateExcelData(fileData);
    if (isDataValid) {

    } else {
      this.toaster.warning(`Invalid Excel File Data`);
    }
  }
  ValidateExcelData(fileData: THExcelFileDto[]) {
    var isValidCount = 0;
    var isValidData = true;
    fileData.forEach(element => {
      const filteredData = this.modelListPres.filter((deviceModel: any) => deviceModel.name == element.modelNumber);
      if (!filteredData.length) {
        isValidData = false;
      }
    });
    return isValidData;
  }
  ReadExcelFile(file: File) {
    // const fileContent = XLSX.readFile()
    return new Promise((resolve, reject) => {
      try {
        const reader: FileReader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (e: any) => {
          /* create workbook */
          const binarystr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

          /* selected the first sheet */
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];

          /* save data */
          const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
          console.log(data); // Data will be logged in array format containing objects
          resolve(data)
        };
      } catch (error) {
        reject('Invalid File Format');
        this.toaster.error(`Invalid File Format ${error.message || error.error}`)
      }

    })
  }
  GetPricingsByFacilityId() {
    this.gettignPricing = true;
    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
    this.PHDPricing.GetPricingsByFacilityId(this.facilityId).subscribe(
      (res: PHDevicePricingListDto[]) => {
        this.gettignPricing = false;
        this.phDevicesPricingList = res.sort((x, y) => x.modality.localeCompare(y.modality));
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
    this.PHDPricing.GetTransmissionChargesByFacilityId(this.facilityId).subscribe(
      (res: TransmissionChargesDto) => {
        this.gettignCharges = false;
        this.transmissionCHargesObj = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error || error.error);
        this.gettignCharges = false;
        // this.closeModal.emit();
      }
    );
  }
  SaleTypeCHanged() {
    const modalityPricing = this.phDevicesPricingList.find(x => x.modality === this.selectedSkuLine.modality)
    if (this.selectedSkuLine.saleType === SaleTypeEnum.Sale) {
      this.selectedSkuLine.salePrice = modalityPricing.price;
      this.selectedSkuLine.installmentCount = 0;
    } else {
      this.selectedSkuLine.installmentCount = modalityPricing.installmentsCount || 2;
      this.selectedSkuLine.salePrice = modalityPricing.leasePrice;
    }
    this.PricesChanged();
  }
  PricesChanged() {
    if (this.selectedSkuLine.discount > this.selectedSkuLine.salePrice) {
      this.toaster.warning('Discount should be less than sale price');
      this.selectedSkuLine.discount = 0;
    }
    this.selectedSkuLine.totalPrice = (this.selectedSkuLine.salePrice + this.selectedSkuLine.shipping || 0) - (this.selectedSkuLine.discount || 0);
  }
  InstallmentChanged() {
    if (this.selectedSkuLine.discount) {

    }
    if (this.selectedSkuLine.saleType === SaleTypeEnum.Lease && this.selectedSkuLine.installmentCount < 1) {
      this.toaster.warning('Installments can not be Zero')
      this.selectedSkuLine.installmentCount = 1;
    }
  }
}
